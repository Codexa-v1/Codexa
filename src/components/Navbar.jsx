import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { FaUserCircle } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";

// import { mockUser } from "../mockuser"; // Remove mock user import to use actual user data

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth0();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="sticky top-0 left-0 z-10 w-full bg-white px-6 py-3 flex justify-between items-center shadow-sm">
      <h1
        className="text-2xl font-bold text-green-800 cursor-pointer"
        onClick={() => navigate("/")}
      >
        PlanIt
      </h1>

      <section className="flex space-x-6">
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

      {/* Profile Dropdown */}
      <section className="relative" ref={dropdownRef}>
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
    </nav>
  );
};

export default Navbar;
