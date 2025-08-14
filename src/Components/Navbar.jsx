import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { HiChevronDown } from "react-icons/hi";
import profile from "../assets/profile.png";

import { mockUser } from "../mockuser"; // Import the mock user data

const Navbar = () => {
  return (
    <nav className="bg-white px-6 py-3 flex justify-between items-center shadow-sm">
      <h1 className="text-2xl font-bold text-green-800">PlanIt</h1>

      <section className="flex space-x-6">
        <a
          href="/dashboard"
          className="text-gray-700 hover:text-green-800 font-medium"
        >
          Dashboard
        </a>
        <a
          href="/events"
          className="text-gray-700 hover:text-green-800 font-medium"
        >
          Events
        </a>
      </section>

      {/* Profile */}
      <section className="flex items-center space-x-2 cursor-pointer">
        {mockUser.profilePic ? (
          <img
            src={mockUser.profilePic}
            alt={mockUser.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <FaUserCircle className="text-gray-700 text-2xl" />
        )}
        <span className="text-gray-700 font-medium">{mockUser.name}</span>
        <HiChevronDown className="text-gray-600 w-4 h-4" />
      </section>
    </nav>
  );
};

export default Navbar;
