"use client"

import { useState, useEffect } from "react"
import NewVendorModal from "@/components/NewVendorModal"
import EditVendorModal from "@/components/EditVendorModal"
import { deleteVendor, getEventVendorDetails } from "@/backend/api/EventVendor"
import { getEvent } from "@/backend/api/EventData"
import { FiX, FiSearch, FiRefreshCw, FiPlus, FiEdit2, FiTrash2, FiPhone, FiMail, FiUser, FiStar } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"

export default function VendorsModal({ eventId, onClose }) {
  const [vendorList, setVendorList] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("All")
  const [showNewVendorModal, setShowNewVendorModal] = useState(false)
  const [editingVendor, setEditingVendor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [eventBudget, setEventBudget] = useState(0)

  // Fetch event budget
  useEffect(() => {
    if (!eventId) return
    const fetchEvent = async () => {
      try {
        const event = await getEvent(eventId)
        setEventBudget(event.budget || 0)
      } catch (err) {
        console.error("Error fetching event:", err)
        setEventBudget(0)
      }
    }
    fetchEvent()
  }, [eventId])

  // Fetch combined EventVendor + Vendor data
  const fetchVendors = async () => {
    if (!eventId) return
    setLoading(true)
    try {
      const data = await getEventVendorDetails(eventId)
      // data = [{ vendor: {...}, eventVendor: {...} }]
      setVendorList(data)
    } catch (err) {
      console.error("Error fetching vendors:", err)
      setVendorList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [eventId, showNewVendorModal, editingVendor])

  const vendorTypes = ["All", ...Array.from(new Set(vendorList.map((item) => item.vendor.vendorType).filter(Boolean)))]

  const filteredVendors = vendorList.filter((item) => {
    const { vendor } = item
    const matchesType = filterType === "All" || vendor.vendorType === filterType
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.contactPerson && vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesSearch
  })

  const handleRemoveVendor = async (vendorId) => {
    if (!eventId) return
    if (!confirm("Are you sure you want to remove this vendor?")) return
    try {
      await deleteVendor(eventId, vendorId)
      setVendorList((prev) => prev.filter((item) => item.vendor._id !== vendorId))
    } catch (err) {
      console.error("Error deleting vendor:", err)
      alert("Failed to delete vendor. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <section className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full relative max-h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-6 rounded-t-2xl flex items-center justify-between">
          <h3 className="text-2xl font-bold">Vendor Management</h3>
          <button className="text-white hover:bg-white/20 rounded-full p-2 transition-colors" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        <div className="p-8 flex-1 overflow-hidden flex flex-col">
          <section className="flex flex-col lg:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name or contact person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all lg:w-48"
            >
              {vendorTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <button
              className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              type="button"
              onClick={() => setShowNewVendorModal(true)}
            >
              <FiPlus size={20} />
              Add Vendor
            </button>
            <button
              className="bg-white border-2 border-teal-600 text-teal-600 px-6 py-3 rounded-xl hover:bg-teal-50 font-semibold transition-all flex items-center justify-center gap-2"
              type="button"
              onClick={fetchVendors}
              disabled={loading}
            >
              <FiRefreshCw size={20} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </section>

          <section className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-teal-600">
                <AiOutlineLoading size={48} className="animate-spin mb-4" />
                <p className="text-lg font-medium">Loading vendors...</p>
              </div>
            ) : filteredVendors.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No vendors found for this event.</p>
                <button
                  onClick={() => setShowNewVendorModal(true)}
                  className="mt-4 text-teal-600 hover:text-teal-700 font-semibold"
                >
                  Add your first vendor
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredVendors.map((item, idx) => {
                  const { vendor, eventVendor } = item
                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-2xl shadow-md hover:shadow-xl p-6 flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 bg-white"
                    >
                      <span
                        className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1.5 rounded-full ${
                          eventVendor.contacted
                            ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md"
                            : "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md"
                        }`}
                      >
                        {eventVendor.contacted ? "Contacted" : "Not Contacted"}
                      </span>

                      <div className="mb-4 pr-24">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{vendor.name}</h3>
                        <p className="text-sm font-medium text-teal-600 bg-teal-50 inline-block px-3 py-1 rounded-full">
                          {vendor.vendorType}
                        </p>
                      </div>

                      <div className="space-y-3 text-sm text-gray-700 mb-6">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-teal-600" size={16} />
                          <span className="font-medium">Contact:</span>
                          <span>{vendor.contactPerson}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiPhone className="text-teal-600" size={16} />
                          <span className="font-medium">Phone:</span>
                          <span>{vendor.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiMail className="text-teal-600" size={16} />
                          <span className="font-medium">Email:</span>
                          <span className="truncate">{vendor.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiStar className="text-teal-600" size={16} />
                          <span className="font-medium">Rating:</span>
                          <span>{vendor.rating || "-"} / 5</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-teal-700">Cost:</span>
                          <span className="font-semibold text-gray-900">
                            {eventVendor.vendorCost > 0
                              ? `R ${eventVendor.vendorCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                              : "Not obtained"}
                          </span>
                        </div>
                        {eventVendor.notes && (
                          <div className="pt-2 border-t border-gray-200">
                            <span className="font-medium">Notes:</span>
                            <p className="text-gray-600 mt-1">{eventVendor.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          onClick={() => setEditingVendor(item)}
                        >
                          <FiEdit2 size={16} />
                          Edit
                        </button>
                        <button
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          onClick={() => handleRemoveVendor(vendor._id)}
                        >
                          <FiTrash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </section>

      {showNewVendorModal && (
        <NewVendorModal
          eventId={eventId}
          onClose={() => setShowNewVendorModal(false)}
          onSave={() => setShowNewVendorModal(false)}
        />
      )}

      {editingVendor && (
        <EditVendorModal
          vendor={editingVendor}
          eventId={eventId}
          eventBudget={eventBudget}
          onClose={() => setEditingVendor(null)}
          onSave={() => setEditingVendor(null)}
        />
      )}
    </div>
  )
}
