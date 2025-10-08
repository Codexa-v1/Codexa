"use client"

import { useState } from "react"
import { FaPlus, FaSearch, FaStar, FaTimes } from "react-icons/fa"
import { AiOutlineLoading } from "react-icons/ai"
import { addVendor, getVendors, searchVendors } from "../backend/api/EventVendor"

export default function NewVendorModal({ eventId, onClose, onVendorsUpdated }) {
  const [activeTab, setActiveTab] = useState("add")

  // Add Vendor State
  const [form, setForm] = useState({
    name: "",
    vendorType: "",
    contactPerson: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    rating: "",
    vendorCost: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Search Vendor State
  const [searchQuery, setSearchQuery] = useState({ category: "", city: "" })
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleAddVendor = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const vendor = {
        ...form,
        rating: form.rating ? Number(form.rating) : undefined,
        vendorCost: 0,
      }

      await addVendor(eventId, vendor)
      const vendors = await getVendors(eventId)
      if (onVendorsUpdated) onVendorsUpdated(vendors)
      onClose()
    } catch (err) {
      console.error("Error adding vendor:", err)
      setError(err.message || "Error saving vendor")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    setSearchLoading(true)
    try {
      const results = await searchVendors(searchQuery.category, searchQuery.city)
      const uniqueResults = results.filter(
        (vendor, index, self) =>
          index === self.findIndex((v) => v._id === vendor._id || v.name.toLowerCase() === vendor.name.toLowerCase()),
      )
      setSearchResults(uniqueResults)
    } catch (err) {
      console.error("Error searching vendors:", err)
    }
    setSearchLoading(false)
  }

  const handleSelectVendor = async (vendor) => {
    try {
      await addVendor(eventId, { ...vendor })
      const vendors = await getVendors(eventId)
      if (onVendorsUpdated) onVendorsUpdated(vendors)
      onClose()
    } catch (err) {
      console.error("Error selecting vendor:", err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 rounded-t-2xl">
          <button className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors" onClick={onClose}>
            <FaTimes className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold">Vendor Management</h2>
          <p className="text-teal-100 text-sm mt-1">Add new vendors or search from previous events</p>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
                activeTab === "add" ? "border-b-2 border-teal-600 text-teal-600" : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("add")}
            >
              <FaPlus className="w-4 h-4" /> Add New Vendor
            </button>
            <button
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
                activeTab === "search"
                  ? "border-b-2 border-teal-600 text-teal-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("search")}
            >
              <FaSearch className="w-4 h-4" /> Search Used Vendors
            </button>
          </div>

          {/* Add Vendor Tab */}
          {activeTab === "add" && (
            <form onSubmit={handleAddVendor} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 mb-2">
                    Vendor Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter vendor name"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </span>
                  <select
                    name="vendorType"
                    value={form.vendorType}
                    onChange={handleChange}
                    required
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Category</option>
                    <option value="Catering">Catering</option>
                    <option value="Photographer">Photographer</option>
                    <option value="Music">Music</option>
                    <option value="Decor">Decor</option>
                    <option value="Transport">Transport</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 mb-2">
                    Contact Person <span className="text-red-500">*</span>
                  </span>
                  <input
                    name="contactPerson"
                    value={form.contactPerson}
                    onChange={handleChange}
                    required
                    placeholder="Contact person name"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </span>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone number"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Email address"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 mb-2">Website</span>
                  <input
                    name="website"
                    type="url"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </span>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="City location"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 mb-2">Rating</span>
                  <input
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    placeholder="1-5 stars"
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </label>
              </div>

              <label className="flex flex-col">
                <span className="text-sm font-semibold text-gray-700 mb-2">Notes</span>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Additional notes or requirements"
                  rows={3}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                />
              </label>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 text-white font-medium hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={loading}
                >
                  {loading && <AiOutlineLoading className="w-4 h-4 animate-spin" />}
                  {loading ? "Saving..." : "Save Vendor"}
                </button>
              </div>
            </form>
          )}

          {/* Search Vendors Tab */}
          {activeTab === "search" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 mb-2">Category</span>
                  <select
                    value={searchQuery.category}
                    onChange={(e) => setSearchQuery((prev) => ({ ...prev, category: e.target.value }))}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  >
                    <option value="">All Categories</option>
                    <option value="Catering">Catering</option>
                    <option value="Photography">Photography</option>
                    <option value="Venue">Venue</option>
                    <option value="Music">Music</option>
                    <option value="Decor">Decor</option>
                    <option value="Transport">Transport</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-700 mb-2">City</span>
                  <input
                    type="text"
                    placeholder="Enter city name"
                    value={searchQuery.city}
                    onChange={(e) => setSearchQuery((prev) => ({ ...prev, city: e.target.value }))}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </label>
              </div>

              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 text-white font-medium hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <>
                    <AiOutlineLoading className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch className="w-4 h-4" />
                    Search Vendors
                  </>
                )}
              </button>

              {/* Search Results */}
              <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FaSearch className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No vendors found</p>
                    <p className="text-sm mt-1">Try adjusting your search criteria</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {searchResults.map((vendor) => (
                      <div
                        key={vendor._id}
                        className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-start gap-4"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{vendor.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="inline-block bg-teal-100 text-teal-700 px-2 py-0.5 rounded text-xs font-medium">
                              {vendor.vendorType}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500 mt-2">{vendor.address}</p>
                          {vendor.rating && (
                            <div className="flex items-center gap-1 mt-2">
                              <FaStar className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium text-gray-700">{vendor.rating}/5</span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleSelectVendor(vendor)}
                          className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors whitespace-nowrap"
                        >
                          Add to Event
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
