import React, { useState } from "react";
import { addGuest } from "../backend/api/EventGuest";

export default function NewGuestModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    rsvpStatus: "",
    dietaryPreferences: "",
  });
  const [guests, setGuests] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function addGuest(e) {
    e.preventDefault();
    if (!form.name || !form.email) return; // basic validation
    setGuests((prev) => [...prev, form]);
    setForm({
      name: "",
      phone: "",
      email: "",
      rsvpStatus: "",
      dietaryPreferences: "",
    });
  }

  function handleCSVUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split("\n").map((row) => row.split(","));
      const [header, ...dataRows] = rows;

      const importedGuests = dataRows
        .map((row) => {
          if (row.length < 5) return null;
          return {
            name: row[0]?.trim(),
            phone: row[1]?.trim(),
            email: row[2]?.trim(),
            rsvpStatus: row[3]?.trim(),
            dietaryPreferences: row[4]?.trim(),
          };
        })
        .filter(Boolean);

      setGuests((prev) => [...prev, ...importedGuests]);
    };
    reader.readAsText(file);
  }

  async function handleSaveAll() { // Need to make this actually save to database
    if (guests.length === 0) return;

    // Save each guest to the database
    await Promise.all(guests.map(guest => addGuest(guest)));
    onSave(guests);
    onClose();
  }

  function downloadSampleCSV() {
    const sample = `name,phone,email,rsvpstatus,dietarypreferences
Alice,1234567890,alice@email.com,Pending,Vegan
Bob,0987654321,bob@email.com,Declined,Gluten-free`;
    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guest_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <section className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4 text-green-900">
          Add New Guest(s)
        </h3>

        {/* Manual Guest Form */}
        <form onSubmit={addGuest} className="space-y-4">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Name"
              className="px-3 py-2 border rounded w-full"
            />
            <select
              name="rsvpStatus"
              value={form.rsvpStatus}
              onChange={handleChange}
              required
              className="px-3 py-2 border rounded w-full"
            >
              <option value="">Select RSVP Status</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
            </select>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="px-3 py-2 border rounded w-full"
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Email"
              className="px-3 py-2 border rounded w-full"
            />
          </section>
          <textarea
            name="dietaryPreferences"
            value={form.dietaryPreferences}
            onChange={handleChange}
            placeholder="Dietary Preferences"
            className="px-3 py-2 border rounded w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            + Add Guest
          </button>
        </form>

        {/* CSV Upload */}
        <section className="mt-6">
          <br />
          <label className="block font-medium mb-2">Or upload CSV file</label>
          <input type="file" accept=".csv" onChange={handleCSVUpload} />
          <p className="text-sm text-gray-500 mt-1">
            CSV format: <code>name,phone,email,rsvpStatus,dietaryPreferences</code>
          </p>
          <a
            onClick={downloadSampleCSV}
            className="text-blue-600 underline text-sm"
          >
            Download sample file
          </a>
        </section>

        {/* Guest Preview */}
        {guests.length > 0 && (
          <section className="mt-6">
            <h4 className="font-bold mb-2">Guest List Preview</h4>
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2">Name</th>
                  <th className="border px-2">Phone</th>
                  <th className="border px-2">Email</th>
                  <th className="border px-2">RSVP</th>
                  <th className="border px-2">Dietary</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((g, i) => (
                  <tr key={i}>
                    <td className="border px-2">{g.name}</td>
                    <td className="border px-2">{g.phone}</td>
                    <td className="border px-2">{g.email}</td>
                    <td className="border px-2">{g.rsvpStatus}</td>
                    <td className="border px-2">{g.dietaryPreferences}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Actions */}
        <section className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 text-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-800"
            onClick={handleSaveAll}
            disabled={guests.length === 0}
          >
            Save All Guests
          </button>
        </section>
      </section>
    </section>
  );
}
