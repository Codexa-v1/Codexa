import { FiMail, FiPhone } from "react-icons/fi"

export default function TeamCard({ name, role, email, phone }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-teal-300 group hover:-translate-y-1">
      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center group-hover:from-teal-500 group-hover:to-teal-700 transition-all duration-300 shadow-md">
        <span className="text-3xl font-bold text-white">{initials}</span>
      </div>

      {/* Name and Role */}
      <h3 className="text-xl font-bold text-gray-900 text-center mb-1">{name}</h3>
      <p className="text-teal-600 font-semibold text-center mb-4 text-lg">{role}</p>

    </div>
  )
}
