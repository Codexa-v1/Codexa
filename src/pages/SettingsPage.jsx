"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { FiUser, FiMail, FiImage, FiSave, FiArrowLeft, FiAlertCircle } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"
import Navbar from "@/components/Navbar"
import { updateUserProfile } from "@/backend/api/UserProfile"

const SettingsPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    picture: "",
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const isSocialLogin = user?.sub && !user.sub.startsWith("auth0|")

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        picture: user.picture || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSocialLogin) {
      return
    }

    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      await updateUserProfile(user.sub, {
        name: formData.name,
        picture: formData.picture,
      })

      setMessage({
        type: "success",
        text: "Profile updated successfully! Please refresh to see changes.",
      })

      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-teal-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AiOutlineLoading className="w-12 h-12 text-teal-600 animate-spin" />
          <p className="text-teal-700 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    navigate("/")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-teal-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-teal-700 hover:text-teal-800 font-medium mb-4 transition-colors duration-200"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-teal-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile information and preferences</p>
        </div>

        {isSocialLogin && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
            <FiAlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-1">Social Login Account</h3>
              <p className="text-sm text-amber-800">
                Your account is connected via social login (Google, Facebook, etc.). Profile information is managed by
                your social provider and cannot be edited here. To update your profile, please visit your social
                provider's settings.
              </p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
            <div className="relative">
              {formData.picture ? (
                <img
                  src={formData.picture || "/placeholder.svg"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-teal-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center ring-4 ring-teal-100">
                  <span className="text-3xl font-bold text-white">
                    {formData.name ? formData.name[0].toUpperCase() : "U"}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{formData.name || "User"}</h2>
              <p className="text-gray-600">{formData.email}</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiUser className="w-4 h-4 text-teal-600" />
                  Full Name
                </div>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSocialLogin}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiMail className="w-4 h-4 text-teal-600" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                placeholder="Email cannot be changed"
              />
              <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
            </div>

            {/* Picture URL Field */}
            <div>
              <label htmlFor="picture" className="block text-sm font-semibold text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <FiImage className="w-4 h-4 text-teal-600" />
                  Profile Picture URL
                </div>
              </label>
              <input
                type="url"
                id="picture"
                name="picture"
                value={formData.picture}
                onChange={handleChange}
                disabled={isSocialLogin}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                placeholder="https://example.com/profile.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                {isSocialLogin
                  ? "Profile picture is managed by your social provider"
                  : "Enter a URL to your profile picture"}
              </p>
            </div>

            {/* Message Display */}
            {message.text && (
              <div
                className={`p-4 rounded-xl ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isSocialLogin}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <AiOutlineLoading className="w-5 h-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  {isSocialLogin ? "Editing Disabled" : "Save Changes"}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Additional Info Card */}
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6">
          <h3 className="font-semibold text-teal-900 mb-2">Account Information</h3>
          <p className="text-sm text-teal-700">
            Your account is managed by Auth0. Some settings may require verification or additional steps.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
