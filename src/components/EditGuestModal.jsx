import { useState } from "react";

export default function EditGuestModal({ guest, onClose, onSave }) {
  const [form, setForm] = useState({ ...guest });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg w-full max-w-md shadow-lg relative">
        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl sm:text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h3 className="text-lg sm:text-xl font-bold mb-6 text-green-900">
          Edit Guest
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border px-3 py-2 rounded w-full text-sm sm:text-base"
            required
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border px-3 py-2 rounded w-full text-sm sm:text-base"
            required
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border px-3 py-2 rounded w-full text-sm sm:text-base"
          />

          <select
            name="rsvpStatus"
            value={form.rsvpStatus}
            onChange={handleChange}
            className="border px-3 py-2 rounded w-full text-sm sm:text-base"
          >
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Declined">Declined</option>
          </select>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 sm:px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800 text-sm sm:text-base"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
