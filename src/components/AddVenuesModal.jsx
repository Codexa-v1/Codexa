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
    venueCost: "",
    venueAvailability: "",
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
    const { venueName, venueAddress, venueEmail, venuePhone, capacity, venueStatus, venueAvailability, venueCost } = form;
    if (!venueName || !venueAddress || !venueEmail || !venuePhone || !capacity || !venueStatus || !venueAvailability || !venueCost) return;

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
        venueCost: form.venueCost ? Number(form.venueCost) : 0,
        venueAvailability,
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
      venueCost: "",
      venueAvailability: "",
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
            
            <section className="relative">{form.venueName && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Name</label>}
              <input name="venueName" value={form.venueName} onChange={handleChange} required placeholder={form.venueName ? "" : "Name"} className="px-3 py-2 border rounded w-full" />
            </section>

            <section className="relative">{form.venueAddress && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Address</label>}
              <input name="venueAddress" value={form.venueAddress} onChange={handleChange} required placeholder={form.venueAddress ? "" : "Address"} className="px-3 py-2 border rounded w-full" />
            </section>

            <section className="relative">{form.venueEmail && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Email</label>}
              <input name="venueEmail" value={form.venueEmail} onChange={handleChange} required placeholder={form.venueEmail ? "" : "Email"} className="px-3 py-2 border rounded w-full" />
            </section>

            <section className="relative">{form.venuePhone && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Phone</label>}
              <input name="venuePhone" value={form.venuePhone} onChange={handleChange} required placeholder={form.venuePhone ? "" : "Phone"} className="px-3 py-2 border rounded w-full" />
            </section>

            <section className="relative">{form.capacity && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Capacity</label>}
              <input name="capacity" type="number" value={form.capacity} onChange={handleChange} required placeholder={form.capacity ? "" : "Capacity"} className="px-3 py-2 border rounded w-full" />
            </section>

            <section className="relative">{form.venueCost && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Cost</label>}
              <input name="venueCost" type="number" value={form.venueCost} onChange={handleChange} required placeholder={form.venueCost ? "" : "Cost"} className="px-3 py-2 border rounded w-full" />
            </section>

            <section className="relative">{form.venueAvailability && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Availability</label>}
              <select name="venueAvailability" value={form.venueAvailability} onChange={handleChange} className="px-3 py-2 border rounded w-full">
                <option value="" disabled hidden>Venue Availability</option>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </section>

            <section className="relative">{form.venueStatus && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Status</label>}<select name="venueStatus" value={form.venueStatus} onChange={handleChange} className="px-3 py-2 border rounded w-full"><option value="" disabled hidden>Venue Status</option><option value="Pending">Pending</option><option value="Accepted">Accepted</option><option value="Declined">Declined</option></select></section>
          </section>
          <section className="relative">{form.venueImage && <label className="absolute left-3 -top-5 text-xs font-semibold text-red-900 bg-white px-1">Image URL</label>}<textarea name="venueImage" value={form.venueImage} onChange={handleChange} placeholder={form.venueImage ? "" : "Venue Image URL (optional)"} className="px-3 py-2 border rounded w-full" /></section>
          <button type="submit" className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">+ Add Venue</button>
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
                  <th className="border px-2">Cost</th>
                  <th className="border px-2">Availability</th>
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
                    <td className="border px-2">{v.venueCost}</td>
                    <td className="border px-2">{v.venueAvailability}</td>
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
