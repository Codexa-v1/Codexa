import React, { useState } from "react";
import { updateEvent } from "@/backend/api/EventData";

export default function EditEventModal({ event, onClose, onSave }) {
  function formatBudget(val) {
    if (!val) return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const today = new Date();
  const eventStarted = new Date(event.date) < today;

  const [form, setForm] = useState({
    title: event.title || "",
    category: event.category || "",
    date: event.date || "",
    endDate: event.endDate || "",
    startTime: event.startTime || "",
    endTime: event.endTime || "",
    location: event.location || "",
    budget: event.budget || "",
    description: event.description || "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const startDate = new Date(form.date);
    const endDate = new Date(form.endDate);

    // Prevent past start dates
    if (startDate < new Date(today.setHours(0, 0, 0, 0))) {
      return alert("Event start date cannot be in the past.");
    }

    // Prevent end date before start date
    if (endDate < startDate) {
      return alert("End date cannot be before start date.");
    }

    try {
      await updateEvent(event._id, form);
      if (onSave) onSave(form);
      onClose();
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event. Please try again.");
    }
  }

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2 sm:px-4">
      <section className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 max-w-3xl w-full relative max-h-[95vh] overflow-y-auto">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl sm:text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h3 className="text-lg sm:text-xl font-bold mb-6 sm:mb-10 text-green-900">
          Edit Event Details
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Title */}
            <section className="relative">
              {form.title && (
                <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">
                  Title
                </label>
              )}
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder={form.title ? "" : "Title"}
                disabled={eventStarted}
                className="px-3 py-2 border rounded w-full text-sm sm:text-base"
              />
            </section>

            {/* Category */}
            <section className="relative">
              {form.category && (
                <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">
                  Category
                </label>
              )}
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                placeholder={form.category ? "" : "Category"}
                disabled={eventStarted}
                className="px-3 py-2 border rounded w-full text-sm sm:text-base"
              />
            </section>

            {/* Start Date */}
            <section className="relative">
              {form.date && (
                <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">
                  Date
                </label>
              )}
              <input
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                type="date"
                disabled={eventStarted}
                min={new Date().toISOString().split("T")[0]}
                className="px-3 py-2 border rounded w-full text-sm sm:text-base"
              />
            </section>

            {/* End Date */}
            <section className="relative">
              {form.endDate && (
                <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">
                  End Date
                </label>
              )}
              <input
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                type="date"
                disabled={eventStarted}
                min={form.date || new Date().toISOString().split("T")[0]}
                className="px-3 py-2 border rounded w-full text-sm sm:text-base"
              />
            </section>

            {/* Start Time */}
            <section className="relative">
              {form.startTime && (
                <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">
                  Start Time
                </label>
              )}
              <input
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                type="time"
                disabled={eventStarted}
                className="px-3 py-2 border rounded w-full text-sm sm:text-base"
              />
            </section>

            {/* End Time */}
            <section className="relative">
              {form.endTime && (
                <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">
                  End Time
                </label>
              )}
              <input
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                type="time"
                disabled={eventStarted}
                className="px-3 py-2 border rounded w-full text-sm sm:text-base"
              />
            </section>

            {/* Location */}
            <section className="relative">
              {form.location && (
                <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">
                  Location
                </label>
              )}
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder={form.location ? "" : "Location"}
                disabled={eventStarted}
                className="px-3 py-2 border rounded w-full text-sm sm:text-base"
              />
            </section>

            {/* Budget */}
            <section className="relative">
              {form.budget && (
                <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">
                  Budget
                </label>
              )}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                R
              </span>
              <input
                name="budget"
                value={formatBudget(form.budget)}
                onChange={(e) => {
                  const raw = e.target.value.replace(/,/g, "");
                  handleChange({ target: { name: "budget", value: raw } });
                }}
                required
                type="text"
                inputMode="numeric"
                min="0"
                placeholder={form.budget ? "" : "Budget"}
                disabled={eventStarted}
                className="pl-7 pr-3 py-2 border rounded w-full text-sm sm:text-base"
              />
            </section>
          </section>

          {/* Description */}
          <section className="relative">
            {form.description && (
              <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">
                Description
              </label>
            )}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={form.description ? "" : "Description"}
              disabled={eventStarted}
              className="px-3 py-2 border rounded w-full text-sm sm:text-base min-h-[100px]"
            />
          </section>

          {/* Actions */}
          <section className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              className="px-3 sm:px-4 py-2 rounded bg-gray-200 text-gray-700 text-sm sm:text-base"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={eventStarted}
              className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
                eventStarted
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-green-700 text-white hover:bg-green-800"
              }`}
            >
              Save Changes
            </button>
          </section>
        </form>
      </section>
    </section>
  );
}
