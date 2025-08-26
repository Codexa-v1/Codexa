import React, { useState, useEffect } from "react";
import NewVenueModal from "./AddVenuesModal"; // your add venue component
import { getVenues } from "../backend/api/EventVenue";

export default function VenuesModal({ eventId, onClose }) {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("All");
  const [showNewVenueModal, setShowNewVenueModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch venues whenever eventId changes or after adding a new venue
  useEffect(() => {
    if (!eventId) return;
    async function fetchVenues() {
      setLoading(true);
      try {
        const data = await getVenues(eventId);
        setVenues(data);
      } catch (err) {
        console.error("Error fetching venues:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVenues();
  }, [eventId, showNewVenueModal]);

  // Filter venues based on capacity and search
  const filteredVenues = venues.filter((venue) => {
    const matchesCapacity =
      filterCapacity === "All" ||
      (filterCapacity === "Small" && venue.capacity < 50) ||
      (filterCapacity === "Medium" && venue.capacity >= 50 && venue.capacity < 200) ||
      (filterCapacity === "Large" && venue.capacity >= 200);

    const matchesSearch =
      venue.venueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.venueAddress?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCapacity && matchesSearch;
  });

  return (
    <section className="bg-white rounded-lg shadow-lg p-12 max-w-7xl w-full relative">
      {showNewVenueModal && (
        <NewVenueModal
          eventId={eventId}
          onClose={() => setShowNewVenueModal(false)}
          onSave={() => setShowNewVenueModal(false)}
        />
      )}

      {/* Close button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        &times;
      </button>

      <h3 className="text-xl font-bold mb-4 text-red-900">Venues</h3>

      {/* Search & Filters */}
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
          <option value="Small">Small (&lt;50)</option>
          <option value="Medium">Medium (50–199)</option>
          <option value="Large">Large (200+)</option>
        </select>
        <button
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 text-sm font-semibold shadow"
          type="button"
          onClick={() => setShowNewVenueModal(true)}
        >
          + Add Venue
        </button>
      </section>

      {/* Venue Cards */}
      <section className="overflow-y-auto" style={{ maxHeight: "350px" }}>
        {loading ? (
          <p className="text-gray-500 text-center py-4">Loading venues...</p>
        ) : filteredVenues.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No venues for this event.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredVenues.map((venue, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col justify-between"
              >
                <div className="mb-2">
                  <h3 className="text-lg font-semibold">{venue.venueName}</h3>
                  <p className="text-sm text-gray-500">{venue.venueAddress}</p>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <p><span className="font-medium">Phone:</span> {venue.venuePhone || "-"}</p>
                  <p><span className="font-medium">Email:</span> {venue.venueEmail || "-"}</p>
                  <p><span className="font-medium">Capacity:</span> {venue.capacity || "-"}</p>
                  <p><span className="font-medium">Status:</span> {venue.venueStatus || "-"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
