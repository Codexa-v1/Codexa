import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getGuests, deleteGuest } from "../backend/api/EventGuest";
import AddGuestsModal from "./AddGuestsModal"; // 👈 import your new modal

export default function RSVPModal({ guests: initialGuests, onClose, eventId, onAddGuests }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [exportType, setExportType] = useState("CSV");
  const [guests, setGuests] = useState(initialGuests || []);
  const [showAddGuestsModal, setShowAddGuestsModal] = useState(false); // 👈 modal state

  // Fetch guests
  useEffect(() => {
    async function fetchGuests() {
      if (!eventId) return;
      try {
        getGuests(eventId)
          .then((data) => setGuests(data))
          .catch((err) => console.error(err));
      } catch (error) {
        console.error(error);
      }
    }
    fetchGuests();
  }, [eventId]);

  // Remove guest
  const handleRemoveGuest = async (guestId) => {
    if (!eventId) return;
    try {
      await deleteGuest(eventId, guestId);
      const updatedGuests = await getGuests(eventId);
      setGuests(updatedGuests);
    } catch (error) {
      console.error(error);
    }
  };

  // Filtering
  const filteredGuests = guests.filter((guest) => {
    const matchesStatus = filterStatus === "All" || guest.rsvpStatus === filterStatus;
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Export
  const handleExport = () => {
    if (exportType === "CSV") {
      const csvRows = [
        ["Name", "Email", "Mobile Number", "Status"],
        ...filteredGuests.map((g) => [g.name, g.email, g.phone, g.rsvpStatus]),
      ];
      const csvContent = csvRows
        .map((row) =>
          row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
        )
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "guests.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const jsonContent = JSON.stringify(filteredGuests, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "guests.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <section className="bg-white rounded-lg shadow-lg p-12 max-w-7xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
            &times;
          </button>

          <h3 className="text-xl font-bold mb-4 text-green-900">Guest List</h3>

          {/* Search + Filters */}
          <section className="flex flex-col md:flex-row gap-2 mb-4">
            <input
              type="text"
              placeholder="Search by Name, Email, or Mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700 w-full md:w-1/2"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700 w-full md:w-1/4"
            >
              <option value="All">All Statuses</option>
              <option value="Accepted">Accepted</option>
              <option value="Pending">Pending</option>
              <option value="Declined">Declined</option>
            </select>
            <section className="flex gap-2 items-center">
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="px-2 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700"
              >
                <option value="CSV">CSV</option>
                <option value="JSON">JSON</option>
              </select>
              <button
                className="bg-green-700 text-white px-3 py-2 rounded hover:bg-green-800 text-xs"
                onClick={handleExport}
                type="button"
              >
                Export
              </button>
              
              <button
                className="bg-green-700 text-white px-3 py-2 rounded hover:bg-green-800 text-xs"
                onClick={() => setShowAddGuestsModal(true)} // 👈 open modal
                type="button"
              >
                Add Guests
              </button>
            </section>
          </section>

          {/* Guests Table */}
          <section className="overflow-y-auto" style={{ maxHeight: "350px" }}>
            <table className="w-full mb-4 border border-gray-200 rounded">
              <thead>
                <tr className="bg-green-50">
                  <th className="py-2 px-3 text-left text-xs font-semibold text-green-900 border border-gray-200">
                    Name
                  </th>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-green-900 border border-gray-200">
                    Email
                  </th>
                  <th className="py-2 px-3 text-left text-xs font-semibold text-green-900 border border-gray-200">
                    Mobile Number
                  </th>
                  <th className="py-2 px-3 text-center text-xs font-semibold text-green-900 border border-gray-200">
                    Status
                  </th>
                  <th className="py-2 px-3 text-center text-xs font-semibold text-green-900 border border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      No guests found.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest, idx) => (
                    <tr key={idx} className="border-t border-gray-100">
                      <td className="py-2 px-3 text-sm font-medium border border-gray-200">
                        {guest.name}
                      </td>
                      <td className="py-2 px-3 text-sm border border-gray-200">
                        {guest.email}
                      </td>
                      <td className="py-2 px-3 text-sm border border-gray-200">
                        {guest.phone}
                      </td>
                      <td className="py-2 px-3 text-sm border border-gray-200 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            guest.rsvpStatus === "Accepted"
                              ? "bg-green-200 text-green-900"
                              : guest.rsvpStatus === "Pending"
                              ? "bg-yellow-200 text-yellow-900"
                              : "bg-red-200 text-red-900"
                          }`}
                        >
                          {guest.rsvpStatus}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-sm border border-gray-200 text-center">
                        <div className="flex gap-2 justify-center items-center">
                          <button className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200"
                          onClick={() => handleRemoveGuest(guest.id)}>
                            Remove
                          </button>
                          {guest.rsvpStatus === "Pending" && (
                            <button className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200">
                              Remind
                            </button>
                          )}
                          {guest.rsvpStatus === "Declined" && (
                            <button className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200">
                              Re-invite
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          {/* Progress Bar */}
          <section className="mb-2">
            <h4 className="text-sm font-semibold mb-1">Invitation Progress</h4>
            <section className="bg-gray-300 h-2 rounded">
              <section
                className="bg-green-900 h-2 rounded"
                style={{
                  width: `${
                    guests.length > 0
                      ? (guests.filter((g) => g.rsvpStatus === "Accepted").length /
                          guests.length) *
                        100
                      : 0
                  }%`,
                }}
              ></section>
            </section>
            <p className="text-xs mt-1">
              Accepted: {guests.filter((g) => g.rsvpStatus === "Accepted").length}/{guests.length}
            </p>
          </section>
        </section>

      {/* AddGuestsModal */}
      {showAddGuestsModal && (
        <AddGuestsModal
          onClose={() => setShowAddGuestsModal(false)}
          eventId={eventId}
          onGuestsAdded={(newGuests) => {
            setGuests([...guests, ...newGuests]);
            if (onAddGuests) onAddGuests(newGuests);
          }}
        />
      )}
    </>
  );
}
