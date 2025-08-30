import { GrClose } from "react-icons/gr";
import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { createEvent } from "@/backend/api/EventData.js";
import dayjs from "dayjs";
import { eventColors } from "@/utils/eventColors";

export default function EventPopup({ onClose, selectedDate }) {
  const { user } = useAuth0();
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [organizerContact, setOrganizerContact] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Planned");
  const [floorplan, setFloorplan] = useState("");
  const [success, setSuccess] = useState(false);

  const handleCreateEvent = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    // Compose date fields as Date objects
    const startDateTime =
      startDate && startTime ? new Date(`${startDate}T${startTime}`) : null;
    const endDateTime =
      endDate && endTime ? new Date(`${endDate}T${endTime}`) : null;
    // Get eventPlanner from Auth0 user ID
    const eventPlanner = user?.sub || "demo@user.com";
    const eventData = {
      eventPlanner,
      title,
      date: startDateTime,
      endDate: endDateTime,
      location,
      budget,
      description,
      status,
      capacity: capacity ? Number(capacity) : undefined,
      category: category === "other" ? newCategory : category,
      organizer: {
        name: organizerName,
        contact: organizerContact,
        email: organizerEmail,
      },
      startTime,
      endTime,
      floorplan,
    };
    try {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      if (!res.ok) throw new Error("Failed to create event");
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

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
            <label
              htmlFor="category"
              className="block font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              className="w-full border border-gray-300 rounded-md p-2 mb-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {Object.keys(eventColors).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
            {category === "other" && (
              <input
                type="text"
                id="newCategory"
                placeholder="Add new category"
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                value={
                  selectedDate
                    ? dayjs(selectedDate).format("YYYY-MM-DD")
                    : startDate
                }
                onChange={(e) => setStartDate(e.target.value)}
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
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
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
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </section>
          </section>

          {/* Location & Capacity */}
          <section className="grid grid-cols-2 gap-4">
            <section>
              <label
                htmlFor="location"
                className="block font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                placeholder="Location"
                className="w-full border border-gray-300 rounded-md p-2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </section>
            <section>
              <label
                htmlFor="capacity"
                className="block font-medium text-gray-700"
              >
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                placeholder="Capacity"
                className="w-full border border-gray-300 rounded-md p-2"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </section>
          </section>

          <section>
              <label htmlFor="budget" className="block font-medium text-gray-700">
                Budget
              </label>
              <input
                type="number"
                id="budget"
                placeholder="Budget"
                className="w-full border border-gray-300 rounded-md p-2"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
              />
              <input
                type="text"
                id="organizerContact"
                placeholder="Contact Details"
                className="w-full border border-gray-300 rounded-md p-2"
                value={organizerContact}
                onChange={(e) => setOrganizerContact(e.target.value)}
              />
              <input
                type="email"
                id="organizerEmail"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-md p-2"
                value={organizerEmail}
                onChange={(e) => setOrganizerEmail(e.target.value)}
              />
            </div>
          </section>

          {/* Status */}
          <section>
            <label htmlFor="status" className="block font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              className="w-full border border-gray-300 rounded-md p-2 mb-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Planned">Planned</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </section>
          {/* Floorplan */}
          <section>
            <label
              htmlFor="floorplan"
              className="block font-medium text-gray-700"
            >
              Floorplan URL
            </label>
            <input
              type="text"
              id="floorplan"
              placeholder="URL to floorplan image"
              className="w-full border border-gray-300 rounded-md p-2"
              value={floorplan}
              onChange={(e) => setFloorplan(e.target.value)}
            />
          </section>

          {/* Submit Button */}
          <button
            className="bg-green-800 text-white px-4 py-2 rounded-md w-full hover:bg-green-700 transition-colors"
            onClick={handleCreateEvent}
            disabled={loading}
          >
            {loading ? "Creating..." : "Add New Event"}
          </button>
          {error && <p className="text-red-600 text-center mt-2">{error}</p>}
          {success && (
            <section className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white border border-green-600 rounded-lg shadow-lg p-6 text-center">
                <h3 className="text-green-700 text-xl font-bold mb-2">
                  Event Created Successfully!
                </h3>
                <p className="text-green-600">Your event has been saved.</p>
              </div>
            </section>
          )}
        </section>
      </section>
    </section>
  );
}
