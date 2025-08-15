import React from "react";

export default function VendorsModal({ vendors, onClose }) {
  return (
    <section className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <section className="bg-white rounded-lg shadow-lg p-12 max-w-4xl w-full relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={onClose}>&times;</button>
        <h3 className="text-xl font-bold mb-4 text-blue-900">Vendor List</h3>
        <section className="overflow-y-auto" style={{ maxHeight: "350px" }}>
          <table className="w-full mb-4 border border-gray-200 rounded">
            <thead>
              <tr className="bg-blue-50">
                <th className="py-2 px-3 text-left text-xs font-semibold text-blue-900 border border-gray-200 align-middle">Name</th>
                <th className="py-2 px-3 text-left text-xs font-semibold text-blue-900 border border-gray-200 align-middle">Service</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-500">No vendors found.</td>
                </tr>
              ) : (
                vendors.map((vendor, idx) => (
                  <tr key={idx} className="border-t border-gray-100">
                    <td className="py-2 px-3 text-sm font-medium border border-gray-200 align-middle text-left">{vendor.name}</td>
                    <td className="py-2 px-3 text-sm border border-gray-200 align-middle text-left">{vendor.service}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </section>
    </section>
  );
}
