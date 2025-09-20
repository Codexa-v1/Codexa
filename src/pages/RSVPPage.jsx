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
  );
};

export default RSVPPage;
