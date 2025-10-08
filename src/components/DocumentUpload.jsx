"use client"

import { useState } from "react"
import { FiUpload, FiFile, FiX, FiCheck, FiCheckCircle, FiAlertCircle } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"

export default function DocumentUpload({ userId, eventId, onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [docType, setDocType] = useState("Other")
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const API_URL = import.meta.env.VITE_BACKEND_URL

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError("")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setUploading(true)
    setError("")
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", userId)
      formData.append("eventId", eventId)
      formData.append("docType", docType)

      const res = await fetch(
        "https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/azure/upload",
        {
          method: "POST",
          body: formData,
        },
      )

      if (!res.ok) throw new Error("Upload failed")

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      setFile(null)
      setDocType("Other")

      if (onUploadSuccess) onUploadSuccess()
    } catch (err) {
      console.error("Upload error:", err)
      setError("Failed to upload document. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200 shadow-sm">
      <h4 className="text-lg font-semibold text-teal-900 mb-4 flex items-center gap-2">
        <FiUpload className="text-teal-600" />
        Upload New Document
      </h4>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
          >
            <option value="FloorPlan">Floor Plan</option>
            <option value="Agenda">Agenda</option>
            <option value="Budget">Budget</option>
            <option value="VendorContract">Vendor Contract</option>
            <option value="Photos">Photos</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
          <div className="flex items-center gap-3">
            <label className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all">
                <FiFile className="text-gray-400" />
                <span className="text-sm text-gray-600">{file ? file.name : "Choose a file..."}</span>
              </div>
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
            {file && (
              <button
                onClick={() => setFile(null)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove file"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        </div>

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 animate-fade-in">
            <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700 font-medium">Document uploaded successfully!</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg font-medium hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <AiOutlineLoading className="animate-spin" size={20} />
              Uploading...
            </>
          ) : (
            <>
              <FiCheck size={20} />
              Upload Document
            </>
          )}
        </button>
      </div>
    </div>
  )
}
