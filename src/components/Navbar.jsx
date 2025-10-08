"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { FaUserCircle } from "react-icons/fa"
import { HiChevronDown } from "react-icons/hi"
import { Calendar } from "lucide-react";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth0()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const navigate = useNavigate()
  const location = useLocation()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  return (
    <nav className="sticky top-0 left-0 z-10 w-full bg-white/90 backdrop-blur-md px-4 sm:px-8 py-4 flex justify-between items-center shadow-sm border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-md">
          <Calendar className="w-6 h-6 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent" 
          onClick={() => navigate("/")} style={{ cursor: 'pointer' }}
        >
          PlanIt
        </h1>
      </div>

      {/* Desktop Nav */}
      <section className="hidden sm:flex space-x-2">
        <a
          href="/home"
          className={`font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
            location.pathname === "/home"
              ? "bg-teal-700 text-white shadow-md"
              : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
          }`}
        >
          Dashboard
        </a>
        <a
          href="/events"
          className={`font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
            location.pathname === "/events"
              ? "bg-teal-700 text-white shadow-md"
              : "text-gray-700 hover:text-teal-700 hover:bg-teal-50"
          }`}
        >
          Events
        </a>
      </section>

      {/* Mobile Nav Toggle */}
      <button
        className="sm:hidden flex items-center px-3 py-2 border rounded-lg text-teal-700 border-teal-300 hover:bg-teal-50 transition-colors duration-200"
        onClick={() => setMobileNavOpen((open) => !open)}
        aria-label="Open navigation menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Profile Dropdown */}
      <section className="relative" ref={dropdownRef}>
        <section
          className="flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          onClick={() => setDropdownOpen((open) => !open)}
        >
          {isAuthenticated && user && user.picture ? (
            <img
              src={user.picture || "/placeholder.svg"}
              alt={user.name || user.email}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-100"
            />
          ) : (
            <FaUserCircle data-testid="fallback-user-icon" className="text-gray-600 text-3xl" />
          )}
          <span className="text-gray-800 font-medium hidden sm:block">
            {isAuthenticated && user ? user.name || user.email : "Guest"}
          </span>
          <HiChevronDown
            className={`text-gray-600 w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </section>
        {dropdownOpen && (
          <section className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
            <button
              className="w-full text-left px-4 py-3 hover:bg-teal-50 text-gray-700 transition-colors duration-150 font-medium"
              onClick={() => {
                /* TODO: navigate to settings */
              }}
            >
              Settings
            </button>
            <button
              className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 transition-colors duration-150 font-medium border-t border-gray-100"
              onClick={() => {
                logout({ returnTo: window.location.origin })
              }}
            >
              Sign Out
            </button>
          </section>
        )}
      </section>

      {/* Mobile Nav Menu */}
      {mobileNavOpen && (
        <nav className="sm:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50 flex flex-col items-center py-2 animate-in slide-in-from-top duration-200">
          <a
            href="/home"
            className="font-medium px-4 py-3 text-teal-700 hover:bg-teal-50 w-full text-center transition-colors duration-150"
          >
            Dashboard
          </a>
          <a
            href="/events"
            className="font-medium px-4 py-3 text-teal-700 hover:bg-teal-50 w-full text-center transition-colors duration-150"
          >
            Events
          </a>
          <button
            className="w-full px-4 py-3 text-red-600 hover:bg-red-50 text-center font-medium transition-colors duration-150 border-t border-gray-100"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            Sign Out
          </button>
        </nav>
      )}
    </nav>
  )
}

export default Navbar
