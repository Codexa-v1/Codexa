import React, { useState } from "react";
import { addVenue, getVenues } from "@/backend/api/EventVenue";

export default function AddVenuesModal({ eventId, onClose, onVenuesUpdated }) {
  const [form, setForm] = useState({
    venueName: "",
    venueAddress: "",
    venueEmail: "",
    venuePhone: "",
    notes: "",
  });
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAddVenue = (e) => {
    e.preventDefault();
    const { venueName, venueAddress, venueEmail, venuePhone } = form;
    if (!venueName || !venueAddress || !venueEmail || !venuePhone) return;

    setVenues(prev => [
      ...prev,
      {
        venueName: venueName.trim(),
        venueAddress: venueAddress.trim(),
        venueEmail: venueEmail.trim(),
        venuePhone: venuePhone.trim(),
        capacity: 0,
        venueCost: 0,
        venueStatus: "Pending",
        notes: form.notes?.trim() || "",
      }
    ]);

    setForm({
      venueName: "",
      venueAddress: "",
      venueEmail: "",
      venuePhone: "",
      notes: "",
    });
  };

  const handleSaveAll = async () => {
    if (venues.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      for (const venue of venues) {
        await addVenue(eventId, venue);
      }
      const updatedVenues = await getVenues(eventId);
      if (onVenuesUpdated) onVenuesUpdated(updatedVenues);

      setVenues([]);
      onClose();
    } catch (err) {
      console.error("Error adding venues:", err);
      setError(err.message || "Failed to save venues.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2 sm:px-4">
      <section
        className="
          bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8
          max-w-4xl w-full relative
          max-h-[95vh] overflow-y-auto
        "
      >
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl sm:text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h3 className="text-lg sm:text-xl font-bold mb-4 text-red-900">
          Add New Venue(s)
        </h3>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        {/* Venue form */}
        <form onSubmit={handleAddVenue} className="space-y-4">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="venueName"
              value={form.venueName}
              onChange={handleChange}
              placeholder="Venue Name"
              required
              className="px-3 py-2 border rounded w-full text-sm sm:text-base"
            />
            <input
              name="venueAddress"
              value={form.venueAddress}
              onChange={handleChange}
              placeholder="Venue Address"
              required
              className="px-3 py-2 border rounded w-full text-sm sm:text-base"
            />
            <input
              name="venueEmail"
              value={form.venueEmail}
              onChange={handleChange}
              placeholder="Email"
              required
              className="px-3 py-2 border rounded w-full text-sm sm:text-base"
            />
            <input
              name="venuePhone"
              value={form.venuePhone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="px-3 py-2 border rounded w-full text-sm sm:text-base"
            />
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes (optional)"
              className="px-3 py-2 border rounded w-full text-sm sm:text-base md:col-span-2"
            />
          </section>

          <button
            type="submit"
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 w-full sm:w-auto"
          >
            + Add Venue
          </button>
        </form>

        {/* Venue Preview */}
        {venues.length > 0 && (
          <section className="mt-6">
            <h4 className="font-bold mb-2 text-sm sm:text-base">Venue List Preview</h4>
            <div className="overflow-x-auto">
              <table className="w-full border text-xs sm:text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">Name</th>
                    <th className="border px-2 py-1">Address</th>
                    <th className="border px-2 py-1">Email</th>
                    <th className="border px-2 py-1">Phone</th>
                    <th className="border px-2 py-1">Capacity</th>
                    <th className="border px-2 py-1">Cost</th>
                    <th className="border px-2 py-1">Status</th>
                    <th className="border px-2 py-1">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {venues.map((v, i) => (
                    <tr key={i} className="odd:bg-gray-50">
                      <td className="border px-2 py-1">{v.venueName}</td>
                      <td className="border px-2 py-1">{v.venueAddress}</td>
                      <td className="border px-2 py-1">{v.venueEmail}</td>
                      <td className="border px-2 py-1">{v.venuePhone}</td>
                      <td className="border px-2 py-1">{v.capacity}</td>
                      <td className="border px-2 py-1">{v.venueCost}</td>
                      <td className="border px-2 py-1">{v.venueStatus}</td>
                      <td className="border px-2 py-1">{v.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Actions */}
        <section className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 w-full sm:w-auto"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800 w-full sm:w-auto"
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