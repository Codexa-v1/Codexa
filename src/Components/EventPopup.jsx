import { GrClose } from "react-icons/gr";

export default function EventPopup({ onClose }) {
  return (
    <section>
      <section className="newEvent-wrapper z-1 bg-white p-6 rounded-lg shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <section className="newEvent space-y-4">
          <GrClose
            className="fixed top-5 right-5 hover:text-red-500 cursor-pointer"
            onClick={onClose}
          />
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 text-center">
            Add New Event
          </h2>

          {/* Category */}
          <section>
            <label
              htmlFor="category"
              className="block font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select Category</option>
              <option value="conference">Conference</option>
              <option value="meeting">Meeting</option>
              <option value="party">Party</option>
              <option value="wedding">Wedding</option>
              <option value="other">Other</option>
            </select>
          </section>

          {/* Event Name */}
          <section>
            <label htmlFor="title" className="block font-medium text-gray-700">
              Event Name
            </label>
            <input
              type="text"
              id="title"
              placeholder="Event Name"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </section>

          {/* Date & Time */}
          <section className="grid grid-cols-2 gap-4">
            <section>
              <label htmlFor="date" className="block font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                id="date"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </section>
            <section>
              <label htmlFor="time" className="block font-medium text-gray-700">
                Time
              </label>
              <input
                type="time"
                id="time"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </section>
          </section>

          {/* Address & Guests */}
          <section className="grid grid-cols-2 gap-4">
            <section>
              <label
                htmlFor="address"
                className="block font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                placeholder="Address"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </section>
            <section>
              <label
                htmlFor="guests"
                className="block font-medium text-gray-700"
              >
                Expected Guests
              </label>
              <input
                type="number"
                id="guests"
                placeholder="Number of guests"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </section>
          </section>

          {/* Details */}
          <section>
            <label
              htmlFor="details"
              className="block font-medium text-gray-700"
            >
              Details
            </label>
            <textarea
              id="details"
              placeholder="Additional details..."
              className="w-full border border-gray-300 rounded-md p-2"
            ></textarea>
          </section>

          {/* Submit Button */}
          <button className="bg-green-800 text-white px-4 py-2 rounded-md w-full hover:bg-green-700 transition-colors">
            Add New Event
          </button>
        </section>
      </section>
    </section>
  );
}
