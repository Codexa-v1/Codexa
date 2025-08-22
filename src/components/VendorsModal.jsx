import React from "react";
import NewVendorModal from "./NewVendorModal";

export default function VendorsModal({ vendors, onClose }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterType, setFilterType] = React.useState("All");
  const [showNewVendorModal, setShowNewVendorModal] = React.useState(false);
  const [vendorList, setVendorList] = React.useState(vendors);

  // Filter and search logic
  const filteredVendors = vendorList.filter((vendor) => {
    const matchesType =
      filterType === "All" || vendor.vendorType === filterType;
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vendor.contactPerson &&
        vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Get unique vendor types for filter dropdown
  const vendorTypes = [
    "All",
    ...Array.from(new Set(vendorList.map((v) => v.vendorType).filter(Boolean))),
  ];

  // Handler for removing a vendor
  const handleRemoveVendor = (idx) => {
    const updatedList = vendorList.filter((_, i) => i !== idx);
    setVendorList(updatedList);
  };

  // Handler for editing a vendor (stub)
  const handleEditVendor = (idx) => {
    // Implement edit logic or open edit modal here
    alert(`Edit vendor: ${vendorList[idx].name}`);
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-12 max-w-7xl w-full relative">
      {showNewVendorModal && (
        <NewVendorModal
          onClose={() => setShowNewVendorModal(false)}
          onSave={(newVendor) => setVendorList([...vendorList, newVendor])}
        />
      )}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        &times;
      </button>
      <h3 className="text-xl font-bold mb-4 text-blue-900">Vendor List</h3>
      <section className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by Name or Contact Person..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700 w-full md:w-1/2"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-700 w-full md:w-1/4"
        >
          {vendorTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 text-sm font-semibold shadow"
          type="button"
          onClick={() => setShowNewVendorModal(true)}
        >
          + Add New Vendor
        </button>
      </section>
      <section className="overflow-y-auto" style={{ maxHeight: "350px" }}>
        <table className="w-full mb-4 border border-gray-200 rounded">
          <thead>
            <tr className="bg-blue-50">
              <th className="py-2 px-3 text-left text-xs font-semibold text-blue-900 border border-gray-200 align-middle">
                Name
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-blue-900 border border-gray-200 align-middle">
                Type
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-blue-900 border border-gray-200 align-middle">
                Contact Person
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-blue-900 border border-gray-200 align-middle">
                Phone
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-blue-900 border border-gray-200 align-middle">
                Email
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-blue-900 border border-gray-200 align-middle">
                Website
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-blue-900 border border-gray-200 align-middle">
                Address
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-blue-900 border border-gray-200 align-middle">
                Rating
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-blue-900 border border-gray-200 align-middle">
                Notes
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-blue-900 border border-gray-200 align-middle">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-4 text-center text-gray-500">
                  No vendors found.
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor, idx) => (
                <tr key={idx} className="border-t border-gray-100">
                  <td className="py-2 px-3 text-sm font-medium border border-gray-200 align-middle text-left">
                    {vendor.name}
                  </td>
                  <td className="py-2 px-3 text-sm border border-gray-200 align-middle text-left">
                    {vendor.vendorType}
                  </td>
                  <td className="py-2 px-3 text-sm border border-gray-200 align-middle text-left">
                    {vendor.contactPerson}
                  </td>
                  <td className="py-2 px-3 text-sm border border-gray-200 align-middle text-left">
                    {vendor.phone}
                  </td>
                  <td className="py-2 px-3 text-sm border border-gray-200 align-middle text-left">
                    {vendor.email}
                  </td>
                  <td className="py-2 px-3 text-sm border border-gray-200 align-middle text-left">
                    {vendor.website ? (
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline"
                      >
                        {vendor.website}
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-sm border border-gray-200 align-middle text-left">
                    {vendor.address}
                  </td>
                  <td className="py-2 px-3 text-sm border border-gray-200 align-middle text-left">
                    {vendor.rating ? `${vendor.rating}/5` : "-"}
                  </td>
                  <td className="py-2 px-3 text-sm border border-gray-200 align-middle text-left">
                    {vendor.notes || "-"}
                  </td>
                  <td className="py-2 px-3 text-sm border border-gray-200 align-middle text-left flex gap-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold"
                      onClick={() => handleEditVendor(idx)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold"
                      onClick={() => handleRemoveVendor(idx)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </section>
  );
}
