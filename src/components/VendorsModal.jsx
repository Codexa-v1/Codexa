import React, { useState, useEffect } from "react";
import NewVendorModal from "./NewVendorModal";

export default function VendorsModal({ vendors, onClose, eventId, onEditVendor }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [vendorList, setVendorList] = useState(vendors);

  useEffect(() => {
    setVendorList(vendors);
  }, [vendors]);

  const vendorTypes = ["All", ...Array.from(new Set(vendorList.map(v => v.vendorType).filter(Boolean)))];

  const filteredVendors = vendorList.filter(vendor => {
    const matchesType = filterType === "All" || vendor.vendorType === filterType;
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.contactPerson && vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleRemoveVendor = idx => {
    const updatedList = vendorList.filter((_, i) => i !== idx);
    setVendorList(updatedList);
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-12 max-w-7xl w-full relative">
      {showNewVendorModal && (
        <NewVendorModal
          eventId={eventId}
          onClose={() => setShowNewVendorModal(false)}
          onSave={newVendor => setVendorList([...vendorList, newVendor])}
        />
      )}

      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        &times;
      </button>

      <h3 className="text-xl font-bold mb-4 text-blue-900">Vendor List</h3>

      <section className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by Name or Contact Person..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700 w-full md:w-1/2"
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700 w-full md:w-1/4"
        >
          {vendorTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 text-sm font-semibold shadow"
          type="button"
          onClick={() => setShowNewVendorModal(true)}
        >
          + Add New Vendor
        </button>
      </section>

      <section className="overflow-y-auto" style={{ maxHeight: "350px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVendors.map((vendor, idx) => (
            <div key={idx} className="border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col justify-between">
              <div className="mb-2">
                <h3 className="text-lg font-semibold">{vendor.name}</h3>
                <p className="text-sm text-gray-500">{vendor.vendorType}</p>
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                <p><span className="font-medium">Contact:</span> {vendor.contactPerson}</p>
                <p><span className="font-medium">Phone:</span> {vendor.phone}</p>
                <p><span className="font-medium">Email:</span> {vendor.email}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold"
                  onClick={() => onEditVendor(vendor)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold"
                  onClick={() => handleRemoveVendor(idx)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
