import React, { useState, useEffect } from "react";
import { getVenues } from "../backend/api/EventVenue"; // your venues API

export default function VenuesSection({ venues: initialVenues, eventId, onAddVenues, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("All");
  const [exportType, setExportType] = useState("CSV");
  const [venues, setVenues] = useState(initialVenues || []);

  // Fetch venues when eventId changes
  useEffect(() => {
    async function fetchVenues() {
      if (!eventId) return;
      try {
        const data = await getVenues(eventId);
        setVenues(data);
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    }
    fetchVenues();
  }, [eventId]);

  // Filter by capacity + search
  const filteredVenues = venues.filter((venue) => {
    const matchesCapacity =
      filterCapacity === "All" ||
      (filterCapacity === "Small" && venue.capacity < 50) ||
      (filterCapacity === "Medium" && venue.capacity >= 50 && venue.capacity < 200) ||
      (filterCapacity === "Large" && venue.capacity >= 200);
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCapacity && matchesSearch;
  });

  // Export venues (CSV/JSON)
  const handleExport = () => {
    if (exportType === "CSV") {
      const csvRows = [
        ["Name", "Address", "Contact Person", "Phone", "Email", "Capacity"],
        ...filteredVenues.map((v) => [
          v.name,
          v.address,
          v.contactPerson,
          v.phone,
          v.email,
          v.capacity,
        ]),
      ];
      const csvContent = csvRows
        .map((row) =>
          row.map((field) => `"${String(field || "").replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "venues.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const jsonContent = JSON.stringify(filteredVenues, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "venues.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Remove venue
  const handleRemoveVenue = (idx) => {
    const updatedList = venues.filter((_, i) => i !== idx);
    setVenues(updatedList);
  };

  // Edit venue (stub)
  const handleEditVenue = (idx) => {
    alert(`Edit venue: ${venues[idx].name}`);
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-12 max-w-7xl w-full relative">
      {/* Close Button */}
      {onClose && (
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
      )}

      <h3 className="text-xl font-bold mb-4 text-red-900">Venues</h3>

      {/* Search & Controls */}
      <section className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by Name, Address, or Contact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700 w-full md:w-1/2"
        />
        <select
          value={filterCapacity}
          onChange={(e) => setFilterCapacity(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700 w-full md:w-1/4"
        >
          <option value="All">All Capacities</option>
          <option value="Small">Small (&lt; 50)</option>
          <option value="Medium">Medium (50–199)</option>
          <option value="Large">Large (200+)</option>
        </select>
        <section className="flex gap-2 items-center">
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
            className="px-2 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-700"
          >
            <option value="CSV">CSV</option>
            <option value="JSON">JSON</option>
          </select>
          <button
            className="bg-red-700 text-white px-3 py-2 rounded hover:bg-red-800 text-xs"
            onClick={onAddVenues}
            type="button"
          >
            Add Venue(s)
          </button>
          <button
            className="bg-red-700 text-white px-3 py-2 rounded hover:bg-red-800 text-xs"
            onClick={handleExport}
            type="button"
          >
            Export
          </button>
        </section>
      </section>

      {/* Venue Cards */}
      <section className="overflow-y-auto" style={{ maxHeight: "350px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredVenues.length === 0 ? (
            <p className="text-center text-gray-500">No venues found.</p>
          ) : (
            filteredVenues.map((venue, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col justify-between"
              >
                {/* Venue Header */}
                <div className="mb-2">
                  <section className="flex gap-4 items-center mb-1">
                    <h3 className="text-lg font-semibold">{venue.name}</h3>
                    <p>
                      <span className="font-semibold">Capacity:</span>{" "}
                      {venue.capacity || "-"}
                    </p>
                  </section>
                  <p className="text-sm text-gray-500">{venue.address}</p>
                </div>

                {/* Venue Info */}
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Contact:</span>{" "}
                    {venue.contactPerson || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {venue.phone || "-"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {venue.email || "-"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold"
                    onClick={() => handleEditVenue(idx)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold"
                    onClick={() => handleRemoveVenue(idx)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </section>
  );
}
