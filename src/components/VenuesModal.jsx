import React, { useState, useEffect } from "react";
import NewVenueModal from "@/components/AddVenuesModal";
import EditVenueModal from "@/components/EditVenueModal";
import { getVenues, deleteVenue } from "@/backend/api/EventVenue";
import { getEvent } from "@/backend/api/EventData"; // fetch event to get budget

export default function VenuesModal({ eventId, onClose, onVenuesUpdated }) {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("All");
  const [showNewVenueModal, setShowNewVenueModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eventBudget, setEventBudget] = useState(0); // store event budget

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

  // Fetch venues
  useEffect(() => {
    if (!eventId) return;
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const data = await getVenues(eventId);
        setVenues(data);
      } catch (err) {
        console.error("Error fetching venues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [eventId, showNewVenueModal, editingVenue]);

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

  const handleRemoveVenue = async (venueId) => {
    try {
      await deleteVenue(eventId, venueId);
      const updatedVenues = venues.filter((v) => v._id !== venueId);
      setVenues(updatedVenues);
      if (onVenuesUpdated) onVenuesUpdated(updatedVenues);
    } catch (err) {
      console.error("Failed to delete venue:", err);
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-12 max-w-7xl w-full relative">
      {showNewVenueModal && (
        <NewVenueModal
          eventId={eventId}
          onClose={() => setShowNewVenueModal(false)}
          onSave={() => setShowNewVenueModal(false)}
        />
      )}

      {editingVenue && (
        <EditVenueModal
          venue={editingVenue}
          eventId={eventId}
          eventBudget={eventBudget} // pass event budget to edit modal
          onClose={() => setEditingVenue(null)}
          onSave={() => setEditingVenue(null)}
        />
      )}

      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        &times;
      </button>

      <h3 className="text-xl font-bold mb-4 text-red-900">Venues</h3>

      {/* Search + Filter */}
      <section className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by Name or Address..."
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
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm font-semibold shadow"
          type="button"
          onClick={async () => {
            setLoading(true);
            try {
              const data = await getVenues(eventId);
              setVenues(data);
            } catch (err) {
              console.error("Error refreshing venues:", err);
            } finally {
              setLoading(false);
            }
          }}
        >
          Refresh
        </button>
      </section>

      {/* Venue List */}
      <section className="overflow-y-auto" style={{ maxHeight: "350px" }}>
        {loading ? (
          <p className="text-gray-500 text-center py-4">Loading venues...</p>
        ) : filteredVenues.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No venues for this event.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVenues.map((venue, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col justify-between relative"
              >
                <span
                  className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${
                    venue.venueStatus === "Contacted"
                      ? "bg-green-500 text-white"
                      : "bg-red-400 text-white"
                  }`}
                >
                  {venue.venueStatus || "Not Contacted"}
                </span>

                <div className="mb-2">
                  <h3 className="text-lg font-semibold">{venue.venueName}</h3>
                  <p className="text-sm text-gray-500">{venue.venueAddress}</p>
                </div>

                <div className="space-y-1 text-sm text-gray-700">
                  <p><span className="font-medium">Phone:</span> {venue.venuePhone || "-"}</p>
                  <p><span className="font-medium">Email:</span> {venue.venueEmail || "-"}</p>
                  <p><span className="font-medium">Capacity:</span> {venue.capacity || "-"}</p>
                  <p><span className="font-medium">Cost:</span> {venue.venueCost != null ? `R ${venue.venueCost}` : "-"}</p>
                  <p><span className="font-medium">Notes:</span> {venue.notes || "-"}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold"
                    onClick={() => setEditingVenue(venue)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold"
                    onClick={() => handleRemoveVenue(venue._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
