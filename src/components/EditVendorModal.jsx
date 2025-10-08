"use client"

import { useState, useEffect } from "react"
import { updateVendor, getEventVendorDetails } from "../backend/api/EventVendor"
import { getVenues } from "../backend/api/EventVenue"
import { FiDollarSign, FiFileText, FiAlertCircle } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"

export default function EditVendorModal({ vendor, eventId, eventBudget, onClose, onSave }) {
  const [vendorCost, setVendorCost] = useState(
    vendor.eventVendor?.vendorCost?.toString() || vendor.vendorCost?.toString() || "",
  )
  const [notes, setNotes] = useState(vendor.eventVendor?.notes || vendor.notes || "")
  const [loading, setLoading] = useState(false)
  const [remainingBudget, setRemainingBudget] = useState(eventBudget || 0)

  // Compute remaining budget dynamically
  useEffect(() => {
    const fetchRemaining = async () => {
      try {
        const vendors = await getEventVendorDetails(eventId)
        const venues = await getVenues(eventId)

        const totalVendorCost = vendors.reduce((sum, v) => sum + Number.parseFloat(v.eventVendor?.vendorCost || 0), 0)

        const totalVenueCost = venues.reduce((sum, v) => sum + Number.parseFloat(v.venueCost || 0), 0)

        // Subtract current vendor cost only once
        const remaining =
          eventBudget - totalVenueCost - (totalVendorCost - Number.parseFloat(vendor.eventVendor?.vendorCost || 0))

        setRemainingBudget(Math.max(Math.round(remaining * 100) / 100, 0))
      } catch (err) {
        console.error("Error fetching vendors/venues:", err)
        setRemainingBudget(eventBudget || 0)
      }
    }

    fetchRemaining()
  }, [eventId, eventBudget, vendor.eventVendor?.vendorCost])

  const handleSave = async () => {
    const numericCost = Number.parseFloat(vendorCost) || 0

    if (numericCost > remainingBudget) {
      alert(`Cost exceeds remaining budget of R${remainingBudget.toFixed(2)}`)
      return
    }

    try {
      setLoading(true)

      // Only send event-specific fields
      const payload = { vendorCost: numericCost, notes, contacted: true }
      await updateVendor(eventId, vendor.vendor._id, payload)

      onSave({ ...vendor, eventVendor: { ...vendor.eventVendor, ...payload } })
      onClose()
    } catch (err) {
      console.error("Error updating vendor:", err)
      alert("Failed to update vendor.")
    } finally {
      setLoading(false)
    }
  }

  const handleCostChange = (val) => {
    // Allow only digits and a single dot with up to 2 decimals
    if (/^\d*\.?\d{0,2}$/.test(val) || val === "") {
      setVendorCost(val)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-5">
          <h3 className="text-xl font-bold text-white">Edit Vendor</h3>
          <p className="text-teal-50 text-sm mt-1">Update vendor cost and notes</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Budget Warning */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <FiAlertCircle className="text-amber-600 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Remaining Budget</p>
              <p className="text-2xl font-bold text-amber-700">R{(remainingBudget || 0).toFixed(2)}</p>
            </div>
          </div>

          {/* Cost Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FiDollarSign className="inline mr-1 text-teal-600" />
              Vendor Cost (R)
            </label>
            <input
              type="text"
              value={vendorCost}
              onChange={(e) => handleCostChange(e.target.value)}
              placeholder="Enter cost (e.g., 1200.50)"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none text-gray-900"
            />
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FiFileText className="inline mr-1 text-teal-600" />
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all outline-none text-gray-900 resize-none"
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || (remainingBudget || 0) <= 0}
              className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                (remainingBudget || 0) <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? (
                <>
                  <AiOutlineLoading className="animate-spin text-lg" />
                  Saving...
                </>
              ) : (remainingBudget || 0) <= 0 ? (
                "Budget Full"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
