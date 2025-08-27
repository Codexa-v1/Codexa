import { time } from "framer-motion";
import React, { useState } from "react";
import { updateEvent } from "../backend/api/EventData";

export default function EditEventModal({ event, onClose, onSave }) {
  function formatBudget(val) {
    if (!val) return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const [form, setForm] = useState({
    title: event.title || "",
    category: event.category || "",
    startDate: event.date || "",
    endDate: event.endDate || "",
    startTime: event.startTime || "",
    endTime: event.endTime || "",
    location: event.location || "",
    budget: event.budget || "",
    description: event.description || ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // assuming your updateEvent takes (id, data)
      await updateEvent(event._id, form);

      // let parent component refresh state if needed
      if (onSave) {
        onSave(form);
      }

      onClose();
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event. Please try again.");
    }
  }

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <section className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>&times;</button>
        <h3 className="text-xl font-bold mb-10 text-green-900">Edit Event Details</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
            <section className="relative">
              {form.title && <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">Title</label>}
              <input name="title" value={form.title} onChange={handleChange} required placeholder={form.title ? "" : "Title"} className="px-3 py-2 border rounded w-full" />
            </section>
            <section className="relative">
              {form.category && <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">Category</label>}
              <input name="category" value={form.category} onChange={handleChange} required placeholder={form.category ? "" : "Category"} className="px-3 py-2 border rounded w-full" />
            </section>
            <section className="relative">
              {form.startDate && <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">Start Date</label>}
              <input name="startDate" value={form.startDate} onChange={handleChange} required type="date" placeholder={form.startDate ? "" : "Start Date"} className="px-3 py-2 border rounded w-full" />
            </section>
            <section className="relative">
              {form.endDate && <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">End Date</label>}
              <input name="endDate" value={form.endDate} onChange={handleChange} required type="date" placeholder={form.endDate ? "" : "End Date"} className="px-3 py-2 border rounded w-full" />
            </section>
            <section className="relative">
              {form.startTime && <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">Start Time</label>}
              <input name="startTime" value={form.startTime} onChange={handleChange} required type="time" placeholder={form.startTime ? "" : "Start Time"} className="px-3 py-2 border rounded w-full" />
            </section>
            <section className="relative">
              {form.endTime && <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">End Time</label>}
              <input name="endTime" value={form.endTime} onChange={handleChange} required type="time" placeholder={form.endTime ? "" : "End Time"} className="px-3 py-2 border rounded w-full" />
            </section>
            <section className="relative">
              {form.location && <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">Location</label>}
              <input name="location" value={form.location} onChange={handleChange} required placeholder={form.location ? "" : "Location"} className="px-3 py-2 border rounded w-full" />
            </section>
            <section className="relative">
              {form.budget && <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">Budget</label>}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">R</span>
              <input
                name="budget"
                value={formatBudget(form.budget)}
                onChange={e => {
                  // Remove commas before saving to state
                  const raw = e.target.value.replace(/,/g, "");
                  handleChange({ target: { name: "budget", value: raw } });
                }}
                required
                type="text"
                inputMode="numeric"
                min="0"
                placeholder={form.budget ? "" : "Budget"}
                className="pl-7 pr-3 py-2 border rounded w-full"
              />
            </section>
          </section>
          <section className="relative">
            {form.description && <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">Description</label>}
            <textarea name="description" value={form.description} onChange={handleChange} placeholder={form.description ? "" : "Description"} className="px-3 py-2 border rounded w-full" />
          </section>
          <section className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800">Save Changes</button>
          </section>
        </form>
      </section>
    </section>
  );
}
