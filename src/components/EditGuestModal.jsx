"use client"

import { useState } from "react"
import { FiX, FiUser, FiMail, FiPhone, FiSave } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"

export default function EditGuestModal({ guest, onClose, onSave }) {
  const [form, setForm] = useState({ ...guest })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(form)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 to-teal-600 rounded-t-2xl" />

        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
          disabled={loading}
        >
          <FiX className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold mb-6 text-teal-900 mt-2">Edit Guest</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="border border-gray-300 pl-10 pr-4 py-3 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              required
              disabled={loading}
            />
          </div>

          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="border border-gray-300 pl-10 pr-4 py-3 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              required
              disabled={loading}
            />
          </div>

          <div className="relative">
            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="border border-gray-300 pl-10 pr-4 py-3 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">RSVP Status</label>
            <select
              name="rsvpStatus"
              value={form.rsvpStatus}
              onChange={handleChange}
              className="border border-gray-300 px-4 py-3 rounded-lg w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              disabled={loading}
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm sm:text-base font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 transition-all shadow-md hover:shadow-lg text-sm sm:text-base font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <AiOutlineLoading className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
