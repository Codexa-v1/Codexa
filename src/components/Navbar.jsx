import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FaUserCircle } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import { HiMenu, HiX } from "react-icons/hi"; // hamburger + close icons

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth0();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // mobile nav toggle
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="sticky top-0 left-0 z-10 w-full bg-white px-6 py-3 shadow-sm">
      <div className="flex justify-between items-center">
        <h1
          className="text-2xl font-bold text-green-800 cursor-pointer"
          onClick={() => navigate("/")}
        >
          PlanIt
        </h1>

        {/* Desktop links */}
        <section className="hidden md:flex space-x-6">
          <a
            href="/home"
            className={`font-medium px-2 py-1 rounded transition-colors duration-200 ${
              location.pathname === "/home"
                ? "bg-green-800 text-white"
                : "text-gray-700 hover:text-green-800"
            }`}
          >
            Dashboard
          </a>
          <a
            href="/events"
            className={`font-medium px-2 py-1 rounded transition-colors duration-200 ${
              location.pathname === "/events"
                ? "bg-green-800 text-white"
                : "text-gray-700 hover:text-green-800"
            }`}
          >
            Events
          </a>
        </section>

        {/* Hamburger (only mobile) */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMobileOpen((prev) => !prev)}
        >
          {mobileOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Profile Dropdown */}
        <section className="relative ml-4" ref={dropdownRef}>
          <section
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            {isAuthenticated && user && user.picture ? (
              <img
                src={user.picture}
                alt={user.name || user.email}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-gray-700 text-2xl" />
            )}
            <span className="text-gray-700 font-medium">
              {isAuthenticated && user ? user.name || user.email : "Guest"}
            </span>
            <HiChevronDown className="text-gray-600 w-4 h-4" />
          </section>
          {dropdownOpen && (
            <section className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                onClick={() => {
                  /* TODO: navigate to settings */
                }}
              >
                Settings
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                onClick={() => {
                  logout({ returnTo: window.location.origin });
                }}
              >
                Sign Out
              </button>
            </section>
          )}
        </section>
      </div>

      {/* Mobile dropdown links */}
      {mobileOpen && (
        <section className="absolute flex flex-col left-1/3 bg-black bg-opacity-20 backdrop-blur-sm mt-3 p-2 rounded shadow-lg z-50 space-y-2 md:hidden">
          <a
            href="/home"
            className={`font-medium px-2 py-1 rounded transition-colors duration-200 ${
              location.pathname === "/home"
                ? "bg-green-800 text-white"
                : "text-gray-700 hover:text-green-800"
            }`}
          >
            Dashboard
          </a>
          <a
            href="/events"
            className={`font-medium px-2 py-1 rounded transition-colors duration-200 ${
              location.pathname === "/events"
                ? "bg-green-800 text-white"
                : "text-gray-700 hover:text-green-800"
            }`}
          >
            Events
          </a>
        </section>
      )}
    </nav>
  );
};

export default Navbar;
