import React, { useState } from "react";
import { Building2, Users, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const scrollToFeatures = () => {
    const section = document.getElementById("features");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white w-full pl-6 pr-6">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="w-full px-0 mx-0">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">PlanIt</h1>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                onClick={() => navigate("/about")}
              >
                About
              </button>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate("/home")}
                    className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors duration-200"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => logout({ returnTo: window.location.origin })}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 ml-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => loginWithRedirect()}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                  >
                    Sign In
                  </button>
                </>
              )}
            </nav>

            {/* Mobile Nav */}
            <button
              className="md:hidden flex items-center px-2 py-1 border rounded text-gray-700 border-gray-300"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          {/* Mobile Nav Menu */}
          {mobileNavOpen && (
            <nav className="md:hidden flex flex-col space-y-2 py-2">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900 px-4 py-2 text-left"
                onClick={() => {
                  setMobileNavOpen(false);
                  navigate("/about");
                }}
              >
                About
              </button>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => {
                      setMobileNavOpen(false);
                      navigate("/home");
                    }}
                    className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setMobileNavOpen(false);
                      logout({ returnTo: window.location.origin });
                    }}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 mt-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMobileNavOpen(false);
                      loginWithRedirect();
                    }}
                    className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Sign In
                  </button>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-50 via-teal-50 to-teal-100 min-h-screen flex items-center">
        <div className="w-full px-0 max-w-screen-xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Plan Events That{" "}
                <span className="text-teal-600">People Remember</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Because perfect events don't happen by accident.
              </p>
              <button
                onClick={() => {
                    setMobileNavOpen(false);
                    loginWithRedirect();
                  }}
                className="bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gray-900 text-white p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="p-8 bg-gradient-to-br from-teal-800 to-teal-900 text-white min-h-[300px] flex items-center justify-center relative">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold mb-4">EVENT</h3>
                    <h3 className="text-3xl font-bold">PLANNING</h3>
                  </div>
                  <div className="absolute bottom-4 right-4 w-12 h-8 bg-white rounded opacity-20"></div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-20 bg-amber-100 rounded-full shadow-lg flex items-center justify-center">
                <div className="w-8 h-12 bg-amber-600 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-100 transition-colors duration-300">
                <Building2 className="w-10 h-10 text-gray-700 group-hover:text-teal-600 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Vendor & Venue Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Manage vendors and venues company profiles and track contract
                progress.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-100 transition-colors duration-300">
                <Users className="w-10 h-10 text-gray-700 group-hover:text-teal-600 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Guest Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create guest lists, send invites, and track RSVPs.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-100 transition-colors duration-300">
                <Upload className="w-10 h-10 text-gray-700 group-hover:text-teal-600 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Export Center
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Export events, and guest data as PDF/CSV.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">PlanIt</h3>
              <p className="text-teal-100 leading-relaxed">
                The ultimate platform for planning memorable events.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-teal-100">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                    onClick={() => {
                      setMobileNavOpen(false);
                      navigate("/about");
                    }}
                  >
                    About
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    className="hover:text-white transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer"
                    onClick={() => {
                      const hero = document.getElementById("hero");
                      if (hero) hero.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Features
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-teal-700 mt-12 pt-8 text-center text-teal-100">
            <p>&copy; 2025 PlanIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
