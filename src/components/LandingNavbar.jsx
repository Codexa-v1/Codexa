import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const LandingNavbar = () => {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-900 cursor-pointer" onClick={() => navigate("/")}>PlanIt</h1>

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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {/* Mobile Nav Menu */}
        {mobileNavOpen && (
          <nav className="md:hidden flex flex-col space-y-2 py-2">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 px-4 py-2 text-left"
              onClick={() => { setMobileNavOpen(false); navigate("/about"); }}
            >
              About
            </button>
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => { setMobileNavOpen(false); navigate("/home"); }}
                  className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => { setMobileNavOpen(false); logout({ returnTo: window.location.origin }); }}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 mt-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setMobileNavOpen(false); loginWithRedirect(); }}
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
  );
};

export default LandingNavbar;
