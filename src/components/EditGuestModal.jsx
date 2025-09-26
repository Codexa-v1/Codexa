function EditGuestModal({ guest, onClose, onSave }) {
  const [form, setForm] = useState({ ...guest });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-lg font-bold mb-4">Edit Guest</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border px-2 py-1 rounded"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border px-2 py-1 rounded"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border px-2 py-1 rounded"
          />
          <select
            name="rsvpStatus"
            value={form.rsvpStatus}
            onChange={handleChange}
            className="border px-2 py-1 rounded"
          >
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Declined">Declined</option>
          </select>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-green-700 text-white hover:bg-green-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
