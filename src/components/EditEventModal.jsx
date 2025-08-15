import React, { useState } from "react";

export default function EditEventModal({ event, onClose, onSave }) {
  function formatBudget(val) {
    if (!val) return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const [form, setForm] = useState({
    title: event.title || "",
    type: event.type || "",
    date: event.date || "",
    location: event.location || "",
    budget: event.budget || "",
    description: event.description || ""
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
    onClose();
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
              {form.type && <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">Type</label>}
              <input name="type" value={form.type} onChange={handleChange} required placeholder={form.type ? "" : "Type"} className="px-3 py-2 border rounded w-full" />
            </section>
            <section className="relative">
              {form.date && <label className="absolute left-3 -top-5 text-xs font-semibold text-green-900 bg-white px-1">Date</label>}
              <input name="date" value={form.date} onChange={handleChange} required type="datetime-local" placeholder={form.date ? "" : "Date"} className="px-3 py-2 border rounded w-full" />
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
