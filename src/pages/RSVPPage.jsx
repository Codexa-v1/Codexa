import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getEvent } from "../backend/api/EventData";

export default function RSVPPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [attending, setAttending] = useState("yes");
  const [plusOne, setPlusOne] = useState("no");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEvent(eventId);
        setEvent(eventData);
      } catch (err) {
        setError(err.message || "Failed to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const rsvpData = { fullName, email, mobileNumber, attending, plusOne };
    console.log("Submitting RSVP:", rsvpData);

    // later → send to backend API
    alert("Thank you for your RSVP!");
  };

  if (loading) return <p>Loading event...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <section className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-2 text-center">{event.title}</h1>
      <p className="text-gray-600 mb-2 text-center">{event.description}</p>
      <p className="text-gray-600 mb-1">
        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
      </p>
      <p className="text-gray-600 mb-4">
        {" "}
        <strong>Location: </strong> {event.location}
      </p>

      <form onSubmit={handleSubmit} className=" space-y-6">
        <section>
          <label className="block text-gray-700 font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
            required
          />
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-300"
            required
          />
          <label className="block text-gray-700 font-medium mb-1">
            Mobile Number
          </label>
          <input
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
  );
}
