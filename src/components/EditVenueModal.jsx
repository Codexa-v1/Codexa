import React, { useState } from "react";
import { updateVenue, getVenues } from "@/backend/api/EventVenue";

export default function EditVenueModal({ eventId, venue, onClose, onVenuesUpdated }) {
  const [form, setForm] = useState({
    venueName: venue.venueName || "",
    venueAddress: venue.venueAddress || "",
    venueEmail: venue.venueEmail || "",
    venuePhone: venue.venuePhone || "",
    capacity: venue.capacity || "",
    venueStatus: venue.venueStatus || "",
    venueAvailability: venue.venueAvailability || "",
    venueCost: venue.venueCost || "",
    venueImage: venue.venueImage || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateVenue(eventId, venue._id, form);
      const venues = await getVenues(eventId);
      if (onVenuesUpdated) onVenuesUpdated(venues);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update venue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <section className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>
          &times;
        </button>
        <h3 className="text-xl font-bold mb-10 text-red-900">Edit Venue</h3>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Grid of main inputs */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
            <section className="relative">
              {form.venueName && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Name</label>}
              <input name="venueName" value={form.venueName} onChange={handleChange} required placeholder={form.venueName ? "" : "Name"} className="px-3 py-2 border rounded w-full" />
            </section>

            <section className="relative">
              {form.venueAddress && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Address</label>}
              <input name="venueAddress" value={form.venueAddress} onChange={handleChange} required placeholder={form.venueAddress ? "" : "Address"} className="px-3 py-2 border rounded w-full" />
            </section>

            <section className="relative">
              {form.venueEmail && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Email</label>}
              <input name="venueEmail" value={form.venueEmail} onChange={handleChange} required type="email" placeholder={form.venueEmail ? "" : "Email"} className="px-3 py-2 border rounded w-full" />
            </section>

            <section className="relative">
              {form.venuePhone && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Phone</label>}
              <input name="venuePhone" value={form.venuePhone} onChange={handleChange} required placeholder={form.venuePhone ? "" : "Phone"} className="px-3 py-2 border rounded w-full" />
            </section>

            <section className="relative">
              {form.capacity && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Capacity</label>}
              <input name="capacity" value={form.capacity} onChange={handleChange} required type="number" min="1" placeholder={form.capacity ? "" : "Capacity"} className="px-3 py-2 border rounded w-full" />
            </section>

            <section className="relative">
              {form.venueCost && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Cost</label>}
              <input name="venueCost" value={form.venueCost} onChange={handleChange} required type="number" min="0" placeholder={form.venueCost ? "" : "Cost"} className="px-3 py-2 border rounded w-full" />
            </section>

            <section className="relative">
              {form.venueStatus && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Status</label>}
              <select name="venueStatus" value={form.venueStatus} onChange={handleChange} required className="px-3 py-2 border rounded w-full">
                <option value="" disabled hidden>Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Declined">Declined</option>
              </select>
            </section>

            <section className="relative">
              {form.venueAvailability && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Availability</label>}
              <select name="venueAvailability" value={form.venueAvailability} onChange={handleChange} required className="px-3 py-2 border rounded w-full">
                <option value="" disabled hidden>Select Availability</option>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </section>
          </section>

          {/* Venue Image URL */}
          <section className="relative">
            {form.venueImage && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Image URL</label>}
            <input name="venueImage" value={form.venueImage} onChange={handleChange} placeholder={form.venueImage ? "" : "Image URL"} className="px-3 py-2 border rounded w-full" />
          </section>

          {/* Footer buttons */}
          <section className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800" disabled={loading}>{loading ? "Saving..." : "Save Venue"}</button>
          </section>

        </form>
      </section>
    </section>
  );
}
