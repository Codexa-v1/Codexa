import React, { useState, useEffect } from "react";
import { updateVendor, getVendors } from "@/backend/api/EventVendor";
import { getVenues } from "@/backend/api/EventVenue";

export default function EditVendorModal({ vendor, eventId, eventBudget, onClose, onSave }) {
  const [vendorCost, setVendorCost] = useState(vendor.vendorCost?.toString() || "");
  const [notes, setNotes] = useState(vendor.notes || "");
  const [loading, setLoading] = useState(false);
  const [remainingBudget, setRemainingBudget] = useState(eventBudget || 0);

  // Compute remaining budget dynamically
  useEffect(() => {
    const fetchRemaining = async () => {
      try {
        const vendors = await getVendors(eventId);
        const venues = await getVenues(eventId);

        // Ensure numeric values
        const totalVendorCost = vendors.reduce(
          (sum, v) => sum + (parseFloat(v.vendorCost) || 0),
          0
        );
        const totalVenueCost = venues.reduce(
          (sum, v) => sum + (parseFloat(v.venueCost) || 0),
          0
        );

        // Subtract the current vendor cost only once if editing
        const remaining =
          eventBudget - totalVenueCost - (totalVendorCost - (parseFloat(vendor.vendorCost) || 0));

        setRemainingBudget(Math.max(Math.round(remaining * 100) / 100, 0));
      } catch (err) {
        console.error("Error fetching vendors/venues:", err);
        setRemainingBudget(eventBudget || 0);
      }
    };

    fetchRemaining();
  }, [eventId, eventBudget, vendor.vendorCost]);


  const handleSave = async () => {
    const numericCost = parseFloat(vendorCost) || 0;

    if (numericCost > remainingBudget) {
      alert(`Cost exceeds remaining budget of R${remainingBudget.toFixed(2)}`);
      return;
    }

    try {
      setLoading(true);
      await updateVendor(eventId, vendor._id, { vendorCost: numericCost, notes, contacted: true });
      onSave({ ...vendor, vendorCost: numericCost, notes, contacted: true });
      onClose();
    } catch (err) {
      console.error("Error updating vendor:", err);
      alert("Failed to update vendor.");
    } finally {
      setLoading(false);
    }
  };

  const handleCostChange = (val) => {
    // Allow only digits and a single dot with up to 2 decimals
    if (/^\d*\.?\d{0,2}$/.test(val) || val === "") {
      setVendorCost(val);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-lg font-bold mb-4">Edit Vendor</h3>

        <p className="text-sm text-red-600 mb-2">
          Remaining budget: R{(remainingBudget || 0).toFixed(2)}
        </p>

        <label className="block mb-2">
          <span className="font-medium">Cost (R)</span>
          <input
            type="text"
            value={vendorCost}
            onChange={(e) => handleCostChange(e.target.value)}
            placeholder="Enter cost (e.g., 1200.50)"
            className="mt-1 block w-full rounded border-gray-300 focus:ring focus:ring-blue-300 px-3 py-2"
          />
        </label>

        <label className="block mb-4">
          <span className="font-medium">Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full rounded border-gray-300 focus:ring focus:ring-blue-300 px-3 py-2"
            rows={3}
          />
        </label>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || (remainingBudget || 0) <= 0}
            className={`px-4 py-2 rounded text-white ${
              (remainingBudget || 0) <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : (remainingBudget || 0) <= 0 ? "Budget Full" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
