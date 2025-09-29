import React, { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { addVendor, getVendors, searchVendors } from "@/backend/api/EventVendor";

export default function VendorManagementModal({ eventId, onClose, onVendorsUpdated }) {
  const [activeTab, setActiveTab] = useState("add"); // 'add' | 'search'

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
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search Vendor State
  const [searchQuery, setSearchQuery] = useState({ category: "", city: "" });
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {

      const vendor = {
        ...form,
        rating: form.rating ? Number(form.rating) : undefined,
        vendorCost: 0
      };

      await addVendor(eventId, vendor);

      const vendors = await getVendors(eventId);
      if (onVendorsUpdated) onVendorsUpdated(vendors);

      onClose();
    } catch (err) {
      console.error("Error adding vendor:", err);
      setError(err.message || "Error saving vendor");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      const results = await searchVendors(searchQuery.category, searchQuery.city);
      const uniqueResults = results.filter(
        (vendor, index, self) =>
          index === self.findIndex(
            (v) => v._id === vendor._id || v.name.toLowerCase() === vendor.name.toLowerCase()
          )
      );
      setSearchResults(uniqueResults);
    } catch (err) {
      console.error("Error searching vendors:", err);
    }
    setSearchLoading(false);
  };

  const handleSelectVendor = async (vendor) => {
    console.log("Vendor added to event:", vendor);
    try {
      // Add selected vendor to this event
      await addVendor(eventId, { ...vendor });
      
      const vendors = await getVendors(eventId);
      if (onVendorsUpdated) onVendorsUpdated(vendors);
      onClose();
    } catch (err) {
      console.error("Error selecting vendor:", err);
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <section className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
          onClick={onClose}
        >
          ×
        </button>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`flex items-center gap-2 px-4 py-2 ${
              activeTab === "add"
                ? "border-b-2 border-blue-700 text-blue-700 font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("add")}
          >
            <FaPlus /> Add New Vendor
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 ${
              activeTab === "search"
                ? "border-b-2 border-green-700 text-green-700 font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("search")}
          >
            <FaSearch /> Search Used Vendors
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "add" && (
        <form onSubmit={handleAddVendor} className="space-y-4">
          {error && <p className="text-red-600">{error}</p>}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium">
                Name <span className="text-red-600">*</span>
              </span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Vendor Name (required)"
                className="px-3 py-2 border rounded w-full"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium">
                Type <span className="text-red-600">*</span>
              </span>
              <select
                name="vendorType"
                value={form.vendorType}
                onChange={handleChange}
                required
                className="px-3 py-2 border rounded w-full"
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
              <span className="text-sm font-medium">
                Contact Person <span className="text-red-600">*</span>
              </span>
              <input
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                required
                placeholder="Contact Person (required)"
                className="px-3 py-2 border rounded w-full"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium">
                Phone <span className="text-red-600">*</span>
              </span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Phone (required)"
                className="px-3 py-2 border rounded w-full"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium">
                Email <span className="text-red-600">*</span>
              </span>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email (required)"
                className="px-3 py-2 border rounded w-full"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium">Website</span>
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="Website (optional)"
                className="px-3 py-2 border rounded w-full"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium">
                City <span className="text-red-600">*</span>
              </span>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                placeholder="City (required)"
                className="px-3 py-2 border rounded w-full"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium">Rating</span>
              <input
                name="rating"
                value={form.rating}
                onChange={handleChange}
                type="number"
                min="1"
                max="5"
                placeholder="Rating (1-5, optional)"
                className="px-3 py-2 border rounded w-full"
              />
            </label>

          </section>

          <label className="flex flex-col">
            <span className="text-sm font-medium">Notes</span>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes (optional)"
              className="px-3 py-2 border rounded w-full"
            />
          </label>

          <section className="flex justify-end gap-2">
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
              className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Vendor"}
            </button>
          </section>
        </form>
      )}


        {activeTab === "search" && (
          <div className="space-y-4">
            {/* Category Dropdown */}
            <select
              value={searchQuery.category}
              onChange={(e) =>
                setSearchQuery((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Category</option>
              <option value="Catering">Catering</option>
              <option value="Photography">Photography</option>
              <option value="Venue">Venue</option>
              <option value="Music">Music</option>
              <option value="Decor">Decor</option>
              <option value="Transport">Transport</option>
              <option value="Other">Other</option>
            </select>

            {/* City Input */}
            <input
              type="text"
              placeholder="Enter city..."
              value={searchQuery.city}
              onChange={(e) =>
                setSearchQuery((prev) => ({ ...prev, city: e.target.value }))
              }
              className="w-full px-3 py-2 border rounded"
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
              disabled={searchLoading}
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>

            {/* Results */}
            <ul className="mt-2 max-h-64 overflow-y-auto border rounded p-2">
              {searchResults.length === 0 ? (
                <p className="text-gray-500 text-sm">No vendors found.</p>
              ) : (
                searchResults.map((v) => (
                  <li key={v._id} className="border-b py-2 last:border-b-0 flex justify-between items-center">
                    <span>
                      <span className="font-semibold">{v.name}</span> ({v.vendorType})  
                      <br />
                      <span className="text-gray-600 text-sm">{v.address}</span>
                      {v.rating && (
                        <span className="ml-2 text-yellow-600 font-medium">
                          ⭐ {v.rating}/5
                        </span>
                      )}
                    </span>

                    <button
                      onClick={() => handleSelectVendor(v)}
                      className="text-green-700 text-sm hover:underline"
                    >
                      Add to Event
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </section>
    </section>
  );
}
