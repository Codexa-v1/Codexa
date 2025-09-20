import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RSVPPage = () => {
  const { eventId, guestId } = useParams();
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // Fetch current RSVP status & event info
    const fetchData = async () => {
      const eventRes = await axios.get(`https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/events/${eventId}`);
      setEvent(eventRes.data);

      const guestsRes = await axios.get(`https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/guests/event/${eventId}`);
      const guest = guestsRes.data.find(g => g._id === guestId);
      if (!guest) throw new Error("Guest not found");
      setRsvpStatus(guest.rsvpStatus);
    };
    fetchData();
  }, [eventId, guestId]);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    setSelectedStatus(rsvpStatus);
  }, [rsvpStatus]);

  const handleChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleConfirm = async () => {
    if (!selectedStatus) return;
    setConfirming(true);
    try {
      await axios.patch(`https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/guests/event/${eventId}/guest/${guestId}`, { rsvpStatus: selectedStatus });
      setRsvpStatus(selectedStatus);
      alert('RSVP updated!');
    } catch (err) {
      alert('Failed to update RSVP');
    } finally {
      setConfirming(false);
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h1 className="text-2xl font-bold text-green-900 mb-4">RSVP for {event.title}</h1>
      <div className="mb-4">
        <p className="text-gray-700 mb-1">From: <span className="font-semibold">{event.date}</span> to <span className="font-semibold">{event.endDate}</span></p>
        <p className="text-gray-700 mb-1">Start Time: <span className="font-semibold">{event.startTime}</span></p>
        <p className="text-gray-700 mb-1">End Time: <span className="font-semibold">{event.endTime}</span></p>
        <p className="text-gray-700 mb-1">Location: <span className="font-semibold">{event.location}</span></p>
      </div>
      <div className="mb-6">
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="Accepted"
              checked={selectedStatus === 'Accepted'}
              onChange={handleChange}
              className="accent-green-600"
            />
            <span className="text-green-700 font-medium">Accept</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="Declined"
              checked={selectedStatus === 'Declined'}
              onChange={handleChange}
              className="accent-red-600"
            />
            <span className="text-red-700 font-medium">Decline</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="Pending"
              checked={selectedStatus === 'Pending'}
              onChange={handleChange}
              className="accent-yellow-500"
            />
            <span className="text-yellow-700 font-medium">Maybe</span>
          </label>
        </div>
      </div>
      <button
        onClick={handleConfirm}
        disabled={confirming || !selectedStatus}
        className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 font-semibold disabled:opacity-50"
      >
        {confirming ? "Confirming..." : "Confirm"}
      </button>
      <div className="mt-4 text-gray-500 text-sm">Current RSVP status: <span className="font-bold text-gray-700">{rsvpStatus || "None"}</span></div>
    </div>
  );
};

export default RSVPPage;