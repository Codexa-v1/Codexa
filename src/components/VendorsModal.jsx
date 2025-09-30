import React, { useState, useEffect } from "react";
import NewVendorModal from "@/components/NewVendorModal";
import EditVendorModal from "@/components/EditVendorModal";
import { deleteVendor, getEventVendorDetails } from "@/backend/api/EventVendor";
import { getEvent } from "@/backend/api/EventData";

export default function VendorsModal({ eventId, onClose }) {
  const [vendorList, setVendorList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eventBudget, setEventBudget] = useState(0);

  // Fetch event budget
  useEffect(() => {
    if (!eventId) return;
    const fetchEvent = async () => {
      try {
        const event = await getEvent(eventId);
        setEventBudget(event.budget || 0);
      } catch (err) {
        console.error("Error fetching event:", err);
        setEventBudget(0);
      }
    };
    fetchEvent();
  }, [eventId]);

  // Fetch combined EventVendor + Vendor data
  const fetchVendors = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const data = await getEventVendorDetails(eventId);
      // data = [{ vendor: {...}, eventVendor: {...} }]
      setVendorList(data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
      setVendorList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [eventId, showNewVendorModal, editingVendor]);

  const vendorTypes = [
    "All",
    ...Array.from(new Set(vendorList.map(item => item.vendor.vendorType).filter(Boolean)))
  ];

  const filteredVendors = vendorList.filter(item => {
    const { vendor } = item;
    const matchesType = filterType === "All" || vendor.vendorType === filterType;
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.contactPerson && vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleRemoveVendor = async (vendorId) => {
    if (!eventId) return;
    try {
      await deleteVendor(eventId, vendorId);
      setVendorList(prev => prev.filter(item => item.vendor._id !== vendorId));
    } catch (err) {
      console.error("Error deleting vendor:", err);
      alert("Failed to delete vendor. Please try again.");
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-12 max-w-7xl w-full relative">
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

      <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>
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
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-semibold shadow"
          type="button"
          onClick={fetchVendors}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </section>

      <section className="overflow-y-auto" style={{ maxHeight: "350px" }}>
        {loading ? (
          <p className="text-gray-500 text-center py-4">Loading vendors...</p>
        ) : filteredVendors.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No vendors for this event.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVendors.map((item, idx) => {
              const { vendor, eventVendor } = item;
              return (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col justify-between relative"
                >
                  <span
                    className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${
                      eventVendor.contacted ? "bg-green-500 text-white" : "bg-red-400 text-white"
                    }`}
                  >
                    {eventVendor.contacted ? "Contacted" : "Not Contacted"}
                  </span>

                  <div className="mb-2">
                    <h3 className="text-lg font-semibold">{vendor.name}</h3>
                    <p className="text-sm text-gray-500">{vendor.vendorType}</p>
                  </div>

                  <div className="space-y-1 text-sm text-gray-700">
                    <p><span className="font-medium">Contact:</span> {vendor.contactPerson}</p>
                    <p><span className="font-medium">Phone:</span> {vendor.phone}</p>
                    <p><span className="font-medium">Email:</span> {vendor.email}</p>
                    <p><span className="font-medium">Rating:</span> {vendor.rating || "-"} out of 5</p>
                    <p>
                      <span className="font-medium">Cost:</span>{" "}
                      {eventVendor.vendorCost > 0 
                        ? `R ${eventVendor.vendorCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                        : "Not obtained"}
                    </p>
                    <p><span className="font-medium">Notes:</span> {eventVendor.notes || "-"}</p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold"
                      onClick={() => setEditingVendor(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold"
                      onClick={() => handleRemoveVendor(vendor._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}
