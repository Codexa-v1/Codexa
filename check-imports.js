// check-imports.js
// Script to detect case mismatches in import paths (useful for Windows devs, Linux deploys)

import fs from "fs";
import path from "path";

const projectRoot = path.resolve("./src");

// Recursively get all files
function getFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (/\.(jsx?|tsx?)$/.test(file)) {
      files.push(fullPath);
    }
  });
  return files;
}

// Check imports in each file
function checkImports(file) {
  const content = fs.readFileSync(file, "utf-8");
  const regex = /import\s+.*?from\s+["'](.*?)["']/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith(".") || importPath.startsWith("..")) {
      const resolved = path.resolve(path.dirname(file), importPath);
      const dir = path.dirname(resolved);
      const base = path.basename(resolved);

      if (fs.existsSync(dir)) {
        const filesInDir = fs.readdirSync(dir);
        if (!filesInDir.includes(base) && !filesInDir.includes(base + ".js") &&
            !filesInDir.includes(base + ".jsx") && !filesInDir.includes(base + ".ts") &&
            !filesInDir.includes(base + ".tsx") && !filesInDir.includes(base + "/index.js") &&
            !filesInDir.includes(base + "/index.jsx")) {
          console.log(`❌ Case mismatch or missing file in: ${file}\n   → Import: ${importPath}`);
        }
      }
    }
  }
}

// Run check
console.log("🔎 Checking imports for case mismatches...");
const files = getFiles(projectRoot);
files.forEach(checkImports);
console.log("✅ Check completed.");
