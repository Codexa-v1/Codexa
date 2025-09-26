import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const InvitePage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  const [guestData, setGuestData] = useState({
    name: "",
    email: "",
    phone: "",
    rsvpStatus: "Pending", // default
    dietaryPreferences: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/events/${eventId}`
        );
        setEvent(res.data);
      } catch (err) {
        console.error("Failed to load event", err);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    setGuestData({
      ...guestData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(
        `https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/guests/event/${eventId}`,
        { ...guestData, eventId }
      );
      setSuccess(true); // ✅ switch to success view
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 && err.response.data.includes("duplicate key")) {
        alert("This email has already RSVP’d for the event.");
      } else {
        alert("Failed to submit RSVP");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateOnly = (isoString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(isoString).toLocaleDateString(undefined, options);
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      {success ? (
        // ✅ Success screen
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-800 mb-4">
            RSVP Confirmation Successful!
          </h1>
          <p className="text-gray-700">
            Thank you for confirming your attendance for{" "}
            <span className="font-semibold">{event.title}</span>.
          </p>
        </div>
      ) : (
        // RSVP Form screen
        <>
          <h1 className="text-2xl font-bold text-green-900 mb-4">
            You’re Invited to {event.title}
          </h1>
          <div className="mb-4 text-gray-700">
            <p>
              From:{" "}
              <span className="font-semibold">{formatDateOnly(event.date)}</span> to{" "}
              <span className="font-semibold">{formatDateOnly(event.endDate)}</span>
            </p>
            <p>
              Time:{" "}
              <span className="font-semibold">
                {event.startTime} – {event.endTime}
              </span>
            </p>
            <p>
              Location: <span className="font-semibold">{event.location}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={guestData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={guestData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={guestData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="text"
              name="dietaryPreferences"
              placeholder="Dietary Preferences (optional)"
              value={guestData.dietaryPreferences}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />

            {/* RSVP Options */}
            <div className="flex gap-6 mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rsvpStatus"
                  value="Accepted"
                  checked={guestData.rsvpStatus === "Accepted"}
                  onChange={handleChange}
                  className="accent-green-600"
                />
                <span className="text-green-700 font-medium">Accept</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rsvpStatus"
                  value="Declined"
                  checked={guestData.rsvpStatus === "Declined"}
                  onChange={handleChange}
                  className="accent-red-600"
                />
                <span className="text-red-700 font-medium">Decline</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rsvpStatus"
                  value="Pending"
                  checked={guestData.rsvpStatus === "Pending"}
                  onChange={handleChange}
                  className="accent-yellow-500"
                />
                <span className="text-yellow-700 font-medium">Maybe</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 font-semibold disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit RSVP"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default InvitePage;
