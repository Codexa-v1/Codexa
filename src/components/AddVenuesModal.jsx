import React, { useState } from "react";
import { addVenue, getVenues } from "@/backend/api/EventVenue";

export default function AddVenuesModal({ eventId, onClose, onVenuesUpdated }) {
  const [form, setForm] = useState({
    venueName: "",
    venueAddress: "",
    venueEmail: "",
    venuePhone: "",
    capacity: "",
    venueStatus: "",
    venueImage: "",
  });
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleAddVenue(e) {
    e.preventDefault();
    const { venueName, venueAddress, venueEmail, venuePhone, capacity, venueStatus } = form;
    if (!venueName || !venueAddress || !venueEmail || !venuePhone || !capacity || !venueStatus) return;

    setVenues(prev => [
      ...prev,
      {
        ...form,
        venueName: venueName.trim(),
        venueAddress: venueAddress.trim(),
        venueEmail: venueEmail.trim(),
        venuePhone: venuePhone.trim(),
        capacity: Number(capacity),
        venueStatus,
        venueImage: form.venueImage?.trim() || "",
      },
    ]);

    setForm({
      venueName: "",
      venueAddress: "",
      venueEmail: "",
      venuePhone: "",
      capacity: "",
      venueStatus: "",
      venueImage: "",
    });
  }

  async function handleSaveAll() {
    if (venues.length === 0) return;

    const validVenues = venues.filter(v =>
      v.venueName && v.venueAddress && v.venueEmail && v.venuePhone && v.capacity && v.venueStatus
    );

    if (validVenues.length === 0) {
      alert("No valid venues to save.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      for (const venue of validVenues) {
        await addVenue(eventId, venue);
      }

      const venues = await getVenues(eventId);

      // Pass back the updated venues list to the parent
      if (onVenuesUpdated) onVenuesUpdated(venues);

      setVenues([]);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save venues.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <section className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-red-900">Add New Venue(s)</h3>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form onSubmit={handleAddVenue} className="space-y-4">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="venueName"
              value={form.venueName}
              onChange={handleChange}
              required
              placeholder="Venue Name"
              className="px-3 py-2 border rounded w-full"
            />
            <input
              name="venueAddress"
              value={form.venueAddress}
              onChange={handleChange}
              required
              placeholder="Venue Address"
              className="px-3 py-2 border rounded w-full"
            />
            <input
              name="venueEmail"
              value={form.venueEmail}
              onChange={handleChange}
              required
              placeholder="Email"
              className="px-3 py-2 border rounded w-full"
            />
            <input
              name="venuePhone"
              value={form.venuePhone}
              onChange={handleChange}
              required
              placeholder="Phone"
              className="px-3 py-2 border rounded w-full"
            />
            <input
              name="capacity"
              type="number"
              value={form.capacity}
              onChange={handleChange}
              required
              placeholder="Capacity"
              className="px-3 py-2 border rounded w-full"
            />
            <select
              name="venueStatus"
              value={form.venueStatus}
              onChange={handleChange}
              className="px-3 py-2 border rounded w-full"
            >
              <option value="" disabled hidden>Venue Status</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
            </select>
          </section>
          <textarea
            name="venueImage"
            value={form.venueImage}
            onChange={handleChange}
            placeholder="Venue Image URL (optional)"
            className="px-3 py-2 border rounded w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            + Add Venue
          </button>
        </form>

        {venues.length > 0 && (
          <section className="mt-6">
            <h4 className="font-bold mb-2">Venue List Preview</h4>
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2">Name</th>
                  <th className="border px-2">Address</th>
                  <th className="border px-2">Email</th>
                  <th className="border px-2">Phone</th>
                  <th className="border px-2">Capacity</th>
                  <th className="border px-2">Status</th>
                  <th className="border px-2">Image</th>
                </tr>
              </thead>
              <tbody>
                {venues.map((v, i) => (
                  <tr key={i}>
                    <td className="border px-2">{v.venueName}</td>
                    <td className="border px-2">{v.venueAddress}</td>
                    <td className="border px-2">{v.venueEmail}</td>
                    <td className="border px-2">{v.venuePhone}</td>
                    <td className="border px-2">{v.capacity}</td>
                    <td className="border px-2">{v.venueStatus}</td>
                    <td className="border px-2">{v.venueImage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 text-gray-700"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800"
            onClick={handleSaveAll}
            disabled={loading || venues.length === 0}
          >
            {loading ? "Saving..." : "Save All Venues"}
          </button>
        </section>
      </section>
    </section>
  );
}
