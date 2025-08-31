import { useParams } from "react-router-dom";
import { useState } from "react";
import React from "react";


const mockEvents = [
  {
    _id: "789",
    type: "Wedding",
    title: "Emily & Jake’s Wedding",
    date: "2025-08-18T09:00:00",
    location: "Riverside Mansion",
    rsvpCurrent: 34,
    rsvpTotal: 46,
    vendors: [
      {
        name: "Floral Designs",
        vendorType: "Florist",
        contactPerson: "Jane Flowers",
        phone: "012-345-6789",
        email: "floral@email.com",
        website: "https://floraldesigns.com",
        address: "123 Flower St, Cityville",
        location: "Main Hall",
        rating: 5,
        notes: "Specializes in wedding bouquets.",
      },
      {
        name: "DJ Mike",
        vendorType: "Music",
        contactPerson: "Mike Johnson",
        phone: "098-765-4321",
        email: "dj.mike@email.com",
        website: "https://djmike.com",
        address: "456 Music Ave, Cityville",
        location: "Dance Floor",
        rating: 4,
        notes: "Has own sound equipment.",
      },
      {
        name: "Catering Co.",
        vendorType: "Catering",
        contactPerson: "Sarah Chef",
        phone: "011-223-3445",
        email: "catering@email.com",
        website: "https://cateringco.com",
        address: "789 Food Rd, Cityville",
        location: "Dining Area",
        rating: 5,
        notes: "Can accommodate vegan options.",
      },
    ],
    description: "Join us for a beautiful wedding celebration!",
    budget: 120000,
  },
  {
    _id: "456",
    type: "Conference",
    title: "Business Conference",
    date: "2025-08-18T11:00:00",
    location: "Wits Sport Conference Center",
    rsvpCurrent: 24,
    rsvpTotal: 46,
    vendors: [
      {
        name: "AV Solutions",
        vendorType: "Audio/Visual",
        contactPerson: "Alex Vision",
        phone: "021-334-5566",
        email: "av@email.com",
        website: "https://avsolutions.com",
        address: "321 AV Blvd, Cityville",
        location: "Conference Room",
        rating: 4,
        notes: "Provides projectors and microphones.",
      },
      {
        name: "Catering Co.",
        vendorType: "Catering",
        contactPerson: "Sarah Chef",
        phone: "011-223-3445",
        email: "catering@email.com",
        website: "https://cateringco.com",
        address: "789 Food Rd, Cityville",
        location: "Dining Area",
        rating: 5,
        notes: "Can accommodate vegan options.",
      },
    ],
    description: "Annual business conference for networking and learning.",
    budget: 80000,
  },
  {
    _id: "123",
    type: "Birthday",
    title: "John’s 30th Birthday",
    date: "2025-08-26T15:00:00",
    location: "The Beach",
    rsvpCurrent: 33,
    rsvpTotal: 36,
    vendors: [
      {
        name: "Beach Party Rentals",
        vendorType: "Equipment",
        contactPerson: "Sandy Beach",
        phone: "022-445-6677",
        email: "beachparty@email.com",
        website: "https://beachpartyrentals.com",
        address: "654 Beach Rd, Seaville",
        location: "Beach Area",
        rating: 5,
        notes: "Offers full beach setup.",
      },
      {
        name: "DJ Mike",
        vendorType: "Music",
        contactPerson: "Mike Johnson",
        phone: "098-765-4321",
        email: "dj.mike@email.com",
        website: "https://djmike.com",
        address: "456 Music Ave, Cityville",
        location: "Dance Floor",
        rating: 4,
        notes: "Has own sound equipment.",
      },
    ],
    description: "Celebrate John's milestone birthday by the sea!",
    budget: 25000,
  },
];

export default function RSVPPage() {
  const { eventId } = useParams();
  const event = mockEvents.find((e) => e._id === eventId);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [attending, setAttending] = useState("yes");
  const [plusOne, setPlusOne] = useState("no");

  const handleSubmit = (e) => {
    e.preventDefault();
    const rsvpData = { fullName, email, mobileNumber, attending, plusOne };
    console.log("Submitting RSVP:", rsvpData);

    // later → send to backend API
    alert("Thank you for your RSVP!");
  };

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
