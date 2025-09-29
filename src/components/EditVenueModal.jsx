import React, { useState, useEffect } from "react";
import { updateVenue, getVenues } from "@/backend/api/EventVenue";
import { getVendors } from "../backend/api/EventVendor";

export default function EditVenueModal({ venue, eventId, eventBudget, onClose, onSave }) {
  const [form, setForm] = useState({
    venueName: venue.venueName || "",
    venueAddress: venue.venueAddress || "",
    venueEmail: venue.venueEmail || "",
    venuePhone: venue.venuePhone || "",
    capacity: venue.capacity || 0,
    venueCost: venue.venueCost || 0,
    venueStatus: venue.venueStatus || "Pending",
    notes: venue.notes || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remainingBudget, setRemainingBudget] = useState(eventBudget || 0);

  // Compute remaining budget dynamically
  useEffect(() => {
    const fetchRemaining = async () => {
      try {
        const venues = await getVenues(eventId);
        const vendors = await getVendors(eventId);

        // Total venue costs, excluding the current venue being edited
        const totalVenueCost = venues.reduce(
          (sum, v) => sum + (parseFloat(v.venueCost) || 0),
          0
        ) - (parseFloat(venue.venueCost) || 0);
        

        const totalVendorCost = vendors.reduce(
          (sum, v) => sum + (parseFloat(v.vendorCost) || 0),
          0
        );
        
        const remaining = eventBudget - totalVenueCost - totalVendorCost;
        setRemainingBudget(Math.max(Math.round(remaining * 100) / 100, 0));
      } catch (err) {
        console.error("Error fetching venues:", err);
        setRemainingBudget(eventBudget || 0);
      }
    };

    fetchRemaining();
  }, [eventId, eventBudget, venue.venueCost]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const numericCost = parseFloat(form.venueCost) || 0;

    if (numericCost > remainingBudget) {
      setError(`Cost exceeds remaining event budget: R${remainingBudget.toFixed(2)}`);
      setLoading(false);
      return;
    }

    try {
      await updateVenue(eventId, venue._id, {
        ...form,
        capacity: Number(form.capacity),
        venueCost: numericCost,
        notes: form.notes.trim() || "",
      });
      if (onSave) onSave();
      onClose();
    } catch (err) {
      console.error("Error updating venue:", err);
      setError(err.message || "Failed to update venue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2 sm:px-0">
      <section className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative max-h-screen overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        <h3 className="text-xl font-bold mb-4">Edit Venue</h3>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium">Capacity</span>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                min={0}
                className="px-3 py-2 border rounded w-full"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium">Cost</span>
              <input
                type="number"
                name="venueCost"
                value={form.venueCost}
                onChange={handleChange}
                min={0}
                className="px-3 py-2 border rounded w-full"
              />
              <small className="text-gray-500">
                Remaining event budget: R{remainingBudget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </small>
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium">Status</span>
              <select
                name="venueStatus"
                value={form.venueStatus}
                onChange={handleChange}
                className="px-3 py-2 border rounded w-full"
              >
                <option value="">Choose a valid status</option>
                <option value="Contacted">Contacted</option>
                <option value="Unavailable">Unavailable</option>
                <option value="Declined">Declined</option>
              </select>
            </label>

            <label className="flex flex-col md:col-span-2">
              <span className="text-sm font-medium">Notes</span>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Notes (optional)"
                className="px-3 py-2 border rounded w-full"
              />
            </label>
          </section>

          <section className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 text-gray-700"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-yellow-400 text-white hover:bg-yellow-500 disabled:opacity-50"
              disabled={loading || remainingBudget <= 0}
            >
              {loading ? "Saving..." : remainingBudget <= 0 ? "Budget Full" : "Save Changes"}
            </button>
          </section>
        </form>
      </section>
    </section>
  );
}
