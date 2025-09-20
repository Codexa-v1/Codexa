<<<<<<< Updated upstream
import { useParams } from "react-router-dom";
import { useState } from "react";
import React from "react";

=======
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
>>>>>>> Stashed changes

const RSVPPage = () => {
  const { eventId, guestId } = useParams();
  const [rsvpStatus, setRsvpStatus] = useState('');
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // Fetch current RSVP status & event info
    const fetchData = async () => {
      const eventRes = await axios.get(`https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/events/${eventId}`);
      setEvent(eventRes.data);

      const rsvpRes = await axios.get(`https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/guest/rsvp/${eventId}/${guestId}`);
      setRsvpStatus(rsvpRes.data.rsvpStatus);
    };
    fetchData();
  }, [eventId, guestId]);

  const handleChange = async (e) => {
    const status = e.target.value;
    setRsvpStatus(status);

    await axios.post(`https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/guest/rsvp/${eventId}/${guestId}`, { rsvpStatus: status });
    alert('RSVP updated!');
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h1>RSVP for {event.title}</h1>
      <p>From Date: {event.date} to {event.endDate}</p>
      <p>Start Time: {event.startTime}</p>
      <p>End Time: {event.endTime}</p>
      <p>Location: {event.location}</p>

<<<<<<< Updated upstream
      <form onSubmit={handleSubmit} className=" space-y-6">
        <section>
          <label htmlFor="Full name" className="block text-gray-700 font-medium mb-1">
            Full Name
          </label>
          <input
            id="Full name"
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
            required
          />
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            id="email"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
            required
          />
          <label htmlFor="mobileNumber" className="block text-gray-700 font-medium mb-1">
            Mobile Number
          </label>
          <input
            id="mobileNumber"
            type="number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
            required
          />
        </section>

        <section>
          <label className="block text-gray-700 font-medium mb-1">
            Will you be attending?
            <select
              value={attending}
              onChange={(e) => setAttending(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Select an option</option>
              <option value="yes">Yes, I’ll be there 🎉</option>
              <option value="no">No, I can’t make it 😔</option>
            </select>
          </label>
        </section>

        <section>
          <span className="block text-gray-700 font-medium mb-1">
            Are you bringing a plus one?
          </span>
          <section className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="yes"
                checked={plusOne === "yes"}
                onChange={(e) => setPlusOne(e.target.value)}
                className="mr-2"
              />{" "}
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="no"
                checked={plusOne === "no"}
                onChange={(e) => setPlusOne(e.target.value)}
                className="mr-2"
              />{" "}
              No
            </label>
          </section>
        </section>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Submit RSVP
        </button>
      </form>
    </section>
=======
      <label>
        <input
          type="radio"
          value="Accepted"
          checked={rsvpStatus === 'Accepted'}
          onChange={handleChange}
        /> Accept
      </label>
      <label>
        <input
          type="radio"
          value="Declined"
          checked={rsvpStatus === 'Declined'}
          onChange={handleChange}
        /> Decline
      </label>
      <label>
        <input
          type="radio"
          value="Pending"
          checked={rsvpStatus === 'Pending'}
          onChange={handleChange}
        /> Maybe
      </label>
    </div>
>>>>>>> Stashed changes
  );
};

export default RSVPPage;
