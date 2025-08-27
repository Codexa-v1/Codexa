import React, { useState } from "react";
import { updateVenue, getVenues } from "../backend/api/EventVenue";

export default function EditVenueModal({ eventId, onClose, onVenuesUpdated, venue }) {
  const initialForm = {
    venueName: venue.venueName || "",
    venueAddress: venue.venueAddress || "",
    venueEmail: venue.venueEmail || "",
    venuePhone: venue.venuePhone || "",
    capacity: venue.capacity || "",
    venueStatus: venue.venueStatus || "",
    venueImage: venue.venueImage || "",
  };

  const [form, setForm] = useState(initialForm);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add venue to list
  const handleAddVenue = (e) => {
    e.preventDefault();

    const { venueName, venueAddress, venueEmail, venuePhone, capacity, venueStatus } = form;
    if (!venueName || !venueAddress || !venueEmail || !venuePhone || !capacity || !venueStatus) return;

    const newVenue = {
      ...form,
      venueName: venueName.trim(),
      venueAddress: venueAddress.trim(),
      venueEmail: venueEmail.trim(),
      venuePhone: venuePhone.trim(),
      capacity: Number(capacity),
      venueStatus,
      venueImage: form.venueImage?.trim() || "",
    };

    setVenues((prev) => [...prev, newVenue]);
    setForm(initialForm); // Reset form
  };

  const handleSave = async () => {
  setLoading(true);
  setError(null);
  try {
    await updateVenue(eventId, form); // update the single venue
    const updatedVenues = await getVenues(eventId);
    if (onVenuesUpdated) onVenuesUpdated(updatedVenues);
    onClose();
  } catch (err) {
    setError(err.message || "Failed to save venue.");
  } finally {
    setLoading(false);
  }
};

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <section className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h3 className="text-xl font-bold mb-4 text-red-900">Edit Venue</h3>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        {/* Form */}
        <form onSubmit={handleAddVenue} className="space-y-4">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="venueName" value={form.venueName} onChange={handleChange} required placeholder="Venue Name" className="px-3 py-2 border rounded w-full" />
            <input name="venueAddress" value={form.venueAddress} onChange={handleChange} required placeholder="Venue Address" className="px-3 py-2 border rounded w-full" />
            <input name="venueEmail" value={form.venueEmail} onChange={handleChange} required placeholder="Email" className="px-3 py-2 border rounded w-full" />
            <input name="venuePhone" value={form.venuePhone} onChange={handleChange} required placeholder="Phone" className="px-3 py-2 border rounded w-full" />
            <input name="capacity" type="number" value={form.capacity} onChange={handleChange} required placeholder="Capacity" className="px-3 py-2 border rounded w-full" />
            <select name="venueStatus" value={form.venueStatus} onChange={handleChange} className="px-3 py-2 border rounded w-full">
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
        </form>

        {/* Venue preview table */}
        {venues.length > 0 && (
          <section className="mt-6">
            <h4 className="font-bold mb-2">Venue List Preview</h4>
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {["Name", "Address", "Email", "Phone", "Capacity", "Status", "Image"].map((h) => (
                    <th key={h} className="border px-2">{h}</th>
                  ))}
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

        {/* Footer actions */}
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
            onClick={handleSave}
            disabled={loading || venues.length === 0}
          >
            {loading ? "Saving..." : "Save Venue"}
          </button>
        </section>
      </section>
    </section>
  );
}
