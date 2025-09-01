import React, { useState } from "react";
import { addVendor, getVendors } from "@/backend/api/EventVendor";

export default function NewVendorModal({ eventId, onClose, onVendorsUpdated }) {
  const [form, setForm] = useState({
    name: "",
    vendorType: "",
    contactPerson: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    rating: "",
    vendorCost: "",
    notes: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If numeric field, store value as string (convert later)
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required numeric fields
      if (!form.vendorCost || isNaN(Number(form.vendorCost))) {
        setError("Vendor cost is required and must be a number");
        setLoading(false);
        return;
      }

      const vendor = {
        ...form,
        rating: form.rating ? Number(form.rating) : undefined,
        vendorCost: Number(form.vendorCost) // important: convert string -> number
      };

      console.log("Adding vendor with request body:", vendor);

      await addVendor(eventId, vendor);

      const vendors = await getVendors(eventId);
      if (onVendorsUpdated) onVendorsUpdated(vendors);

      onClose();
    } catch (err) {
      console.error("Error adding vendor:", err);
      setError(err.message || "Error saving vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <section className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>

        <h3 className="text-xl font-bold mb-4 text-blue-900">Add New Vendor</h3>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Name" className="px-3 py-2 border rounded w-full" />
            <input name="vendorType" value={form.vendorType} onChange={handleChange} required placeholder="Type" className="px-3 py-2 border rounded w-full" />
            <input name="contactPerson" value={form.contactPerson} onChange={handleChange} required placeholder="Contact Person" className="px-3 py-2 border rounded w-full" />
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone" className="px-3 py-2 border rounded w-full" />
            <input name="email" value={form.email} onChange={handleChange} required placeholder="Email" className="px-3 py-2 border rounded w-full" />
            <input name="website" value={form.website} onChange={handleChange} placeholder="Website" className="px-3 py-2 border rounded w-full" />
            <input name="address" value={form.address} onChange={handleChange} required placeholder="Address" className="px-3 py-2 border rounded w-full" />
            <input name="rating" value={form.rating} onChange={handleChange} type="number" min="1" max="5" placeholder="Rating (1-5)" className="px-3 py-2 border rounded w-full" />
            <input name="vendorCost" value={form.vendorCost} onChange={handleChange} type="number" min="0" step="0.01" required placeholder="Vendor Cost" className="px-3 py-2 border rounded w-full" />
          </section>

          <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="px-3 py-2 border rounded w-full" />

          <section className="flex justify-end gap-2">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 text-gray-700" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50" disabled={loading}>
              {loading ? "Saving..." : "Save Vendor"}
            </button>
          </section>
        </form>
      </section>
    </section>
  );
}
