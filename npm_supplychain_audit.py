#!/usr/bin/env python3
"""
npm_supplychain_audit.py

Usage:
  python npm_supplychain_audit.py --compromised compromised.txt \
      --project /path/to/project \
      --out report.json

compromised.txt lines: package or package@version
Example:
  chalk
  @ctrl/tinycolor@4.1.1
"""

import argparse
import json
import os
import sys
from collections import defaultdict, deque

def load_compromised(path):
    items = {}
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            s = line.strip()
            if not s or s.startswith('#'):
                continue
            if '@' in s and not s.startswith('@'):
                # simple name@version
                name, ver = s.rsplit('@', 1)
                items[name] = items.get(name, set())
                items[name].add(ver)
            elif s.startswith('@') and s.count('@') >= 2:
                # scoped package like @ctrl/tinycolor@4.1.1
                # split from right
                name, ver = s.rsplit('@', 1)
                items[name] = items.get(name, set())
                items[name].add(ver)
            else:
                # name only
                items[s] = None  # None => any version
    return items  # dict: name -> None (any) or set(versions)

def load_json_if_exists(path):
    if not os.path.exists(path):
        return None
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def check_package_json(pkg_json, compromised):
    results = []
    if not pkg_json:
        return results
    deps = {}
    for sec in ('dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'):
        if sec in pkg_json:
            deps.update(pkg_json[sec])
    for name, spec in deps.items():
        if name in compromised:
            vers = compromised[name]
            if vers is None:
                results.append({'package': name, 'matched': 'any-version', 'declared_version_spec': spec})
            else:
                # can't determine matching version from package.json spec; warn
                results.append({'package': name, 'matched': 'some-versions-specified', 'declared_version_spec': spec, 'compromised_versions': list(vers)})
    return results

def normalize_name(n):
    return n

def scan_lockfile(lock_json, compromised):
    """
    Supports package-lock v1 and v2 (node_modules-like tree in lockfile).
    Returns list of matches with paths (list of dependency names from root).
    """
    matches = []

    # Node structure differences:
    # - lockfile v1: lock_json['dependencies'] is a mapping of name->{version, dependencies}
    # - lockfile v2: lock_json['packages'] with keys like "" or "node_modules/pkg" and lock_json['dependencies']
    if 'packages' in lock_json:
        # lockfile v2+
        # Build a graph mapping package path -> its dependencies (names with versions)
        packages = lock_json.get('packages', {})
        # We'll traverse starting from "" (root)
        # Build a mapping from (package name, version) to its children occurrences via 'dependencies' fields in lock_json['dependencies']
        # But simpler: use lock_json['dependencies'] entries which map name -> {version, requires}
        deps_root = lock_json.get('dependencies', {})
        # We'll BFS through dependencies using 'dependencies' structure to resolve subtree.
        # Helper to record path
        def bfs():
            q = deque()
            # start with top-level dependencies
            for name in deps_root:
                q.append( (name, deps_root[name], [name]) )
            while q:
                name, meta, path = q.popleft()
                version = meta.get('version')
                # check match
                if name in compromised:
                    vers = compromised[name]
                    if vers is None or (version and version in vers):
                        matches.append({'package': name, 'version': version, 'path': list(path)})
                # push children
                requires = meta.get('requires') or {}
                for child in requires:
                    child_meta = deps_root.get(child) or lock_json.get('dependencies', {}).get(child)
                    if child_meta:
                        q.append( (child, child_meta, path + [child]) )
        bfs()
    elif 'dependencies' in lock_json:
        # lockfile v1-ish
        top = lock_json.get('dependencies', {})
        def recurse(node, path):
            for name, meta in node.items():
                version = meta.get('version')
                if name in compromised:
                    vers = compromised[name]
                    if vers is None or (version and version in vers):
                        matches.append({'package': name, 'version': version, 'path': list(path + [name])})
                child_deps = meta.get('dependencies') or {}
                if child_deps:
                    recurse(child_deps, path + [name])
        recurse(top, [])
    else:
        # unknown structure: try to inspect for a 'dependencies' anywhere
        # fallback: search entire JSON for objects that look like {version: "..."}
        def walk(obj, path):
            if isinstance(obj, dict):
                if 'version' in obj and isinstance(path, list) and len(path)>0:
                    name = path[-1]
                    if name in compromised:
                        version = obj.get('version')
                        vers = compromised[name]
                        if vers is None or (version and version in vers):
                            matches.append({'package': name, 'version': version, 'path': list(path)})
                for k,v in obj.items():
                    walk(v, path + [k])
            elif isinstance(obj, list):
                for i, v in enumerate(obj):
                    walk(v, path + [str(i)])
        walk(lock_json, [])
    return matches

def make_json_safe(obj):
        if isinstance(obj, set):
            return list(obj)
        if isinstance(obj, dict):
            return {k: make_json_safe(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [make_json_safe(v) for v in obj]
        return obj

def main():
    parser = argparse.ArgumentParser(description="Scan npm project for compromised packages (direct & transitive)")
    parser.add_argument('--compromised', '-c', required=True, help='file with compromised package names (name or name@version per line)')
    parser.add_argument('--project', '-p', default='.', help='path to project root (containing package.json/package-lock.json)')
    parser.add_argument('--out', '-o', default='audit_report.json', help='output JSON report path')
    args = parser.parse_args()

    compromised = load_compromised(args.compromised)
    project = args.project

    pkg_json = load_json_if_exists(os.path.join(project, 'package.json'))
    lock_json = load_json_if_exists(os.path.join(project, 'package-lock.json'))

    report = {
        'project_path': os.path.abspath(project),
        'package_json_present': pkg_json is not None,
        'package_lock_present': lock_json is not None,
        'compromised_input': compromised,
        'direct_matches': [],
        'lockfile_matches': []
    }

    if pkg_json:
        report['direct_matches'] = check_package_json(pkg_json, compromised)

    if lock_json:
        report['lockfile_matches'] = scan_lockfile(lock_json, compromised)

    # Human summary
    summary = []
    if report['direct_matches']:
        summary.append(f"Direct references found: {len(report['direct_matches'])}")
    if report['lockfile_matches']:
        summary.append(f"Transitive/lockfile matches found: {len(report['lockfile_matches'])}")
    if not summary:
        summary_text = "No matches found in package.json or package-lock.json."
    else:
        summary_text = "; ".join(summary)

    report['summary'] = summary_text
   

    with open(args.out, 'w', encoding='utf-8') as f:
        json.dump(make_json_safe(report), f, indent=2)
    print("Audit complete.")
    print(summary_text)
    print(f"Full JSON report written to: {args.out}")

if __name__ == '__main__':
    main()
