import React, { useState, useEffect } from "react";
import { getVenues } from "../backend/api/EventVenue"; // your venues API

export default function VenuesModal({ venues: initialVenues, onClose, eventId, onAddVenues }) {
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
        .map((row) => row.map((field) => `"${String(field || "").replace(/"/g, '""')}"`).join(","))
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

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <section className="bg-white rounded-lg shadow-lg p-12 max-w-7xl w-full relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

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

        {/* Venues Table */}
        <section className="overflow-y-auto" style={{ maxHeight: "350px" }}>
          <table className="w-full mb-4 border border-gray-200 rounded">
            <thead>
              <tr className="bg-red-50">
                <th className="py-2 px-3 text-left text-xs font-semibold text-red-900 border">Name</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-red-900 border">Address</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-red-900 border">Contact</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-red-900 border">Email</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-red-900 border">Phone</th>
                <th className="py-2 px-3 text-center text-xs font-semibold text-red-900 border">Capacity</th>
              </tr>
            </thead>
            <tbody>
              {filteredVenues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-gray-500">
                    No venues found.
                  </td>
                </tr>
              ) : (
                filteredVenues.map((venue, idx) => (
                  <tr key={idx} className="border-t border-gray-100">
                    <td className="py-2 px-3 text-sm font-medium border">{venue.name}</td>
                    <td className="py-2 px-3 text-sm border">{venue.address}</td>
                    <td className="py-2 px-3 text-sm border">{venue.contactPerson}</td>
                    <td className="py-2 px-3 text-sm border">{venue.email}</td>
                    <td className="py-2 px-3 text-sm border">{venue.phone}</td>
                    <td className="py-2 px-3 text-sm border text-center">{venue.capacity || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </section>
    </section>
  );
}
