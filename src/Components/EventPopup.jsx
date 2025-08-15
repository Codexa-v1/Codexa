import { GrClose } from "react-icons/gr";
import React, { useState } from "react";

export default function EventPopup({ onClose }) {
  const [category, setCategory] = useState("");

  return (
    <section>
      <section className="newEvent-wrapper z-1 bg-white p-6 rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[80vh] overflow-y-auto">
        <section className="newEvent space-y-4">
          <GrClose
            className="fixed top-5 right-5 hover:text-red-500 cursor-pointer"
            onClick={onClose}
          />
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 text-center">
            Add New Event
          </h2>

          {/* Category */}
          <section>
            <label htmlFor="category" className="block font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              className="w-full border border-gray-300 rounded-md p-2 mb-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="conference">Conference</option>
              <option value="meeting">Meeting</option>
              <option value="party">Party</option>
              <option value="wedding">Wedding</option>
              <option value="other">Other</option>
            </select>
            {category === "other" && (
              <input
                type="text"
                id="newCategory"
                placeholder="Add new category"
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
            )}
          </section>

          {/* Event Title */}
          <section>
            <label htmlFor="title" className="block font-medium text-gray-700">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Event Title"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </section>

          {/* Start & End Date & Time */}
          <section className="grid grid-cols-2 gap-4">
            <section>
              <label
                htmlFor="startDate"
                className="block font-medium text-gray-700"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </section>
            <section>
              <label
                htmlFor="startTime"
                className="block font-medium text-gray-700"
              >
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </section>
          </section>
          <section className="grid grid-cols-2 gap-4 mt-2">
            <section>
              <label
                htmlFor="endDate"
                className="block font-medium text-gray-700"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </section>
            <section>
              <label
                htmlFor="endTime"
                className="block font-medium text-gray-700"
              >
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </section>
          </section>

          {/* Location & Capacity */}
          <section className="grid grid-cols-2 gap-4">
            <section>
              <label htmlFor="location" className="block font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                placeholder="Location"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </section>
            <section>
              <label htmlFor="capacity" className="block font-medium text-gray-700">
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                placeholder="Capacity"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </section>
          </section>

          {/* Description of Event */}
          <section>
            <label
              htmlFor="description"
              className="block font-medium text-gray-700"
            >
              Description of Event
            </label>
            <textarea
              id="description"
              placeholder="Description of the event..."
              className="w-full border border-gray-300 rounded-md p-2"
            ></textarea>
          </section>

          {/* Event Organizer Details (optional) */}
          <section>
            <label className="block font-medium text-gray-700">
              Event Organizer Details (optional)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                id="organizerName"
                placeholder="Name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                id="organizerContact"
                placeholder="Contact Details"
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <input
                type="email"
                id="organizerEmail"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </section>

          {/* Submit Button */}
          <button className="bg-green-800 text-white px-4 py-2 rounded-md w-full hover:bg-green-700 transition-colors">
            Add New Event
          </button>
        </section>
      </section>
    </section>
  );
}
