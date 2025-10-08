"use client"

import { useState } from "react"
import { FiUpload, FiX, FiFile, FiAlertCircle, FiCheckCircle } from "react-icons/fi"
import { AiOutlineLoading } from "react-icons/ai"

export default function FloorPlanUpload({ userId, eventId, onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)

  const docType = "FloorPlan"

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setFileName(selectedFile.name.replace(/\.[^/.]+$/, ""))
    setError("")
  }

  const handleRemoveFile = () => {
    setFile(null)
    setFileName("")
    setError("")
    setSuccess(false) // Clear success message when removing file
  }

  const validateFileName = (name) => {
    if (!name.trim()) return "File name cannot be empty."
    if (/[<>:"/\\|?*]/.test(name)) return "File name contains invalid characters."
    return ""
  }

  const handleUpload = async () => {
    if (!file || !userId || !eventId) {
      setError("Missing required information.")
      return
    }

    const validationError = validateFileName(fileName)
    if (validationError) {
      setError(validationError)
      return
    }

    setUploading(true)
    setError("")
    setSuccess(false) // Clear previous success message

    const extension = file.name.includes(".") ? file.name.substring(file.name.lastIndexOf(".")) : ""

    const uploadFile =
      fileName.trim() && fileName.trim() !== file.name.replace(extension, "")
        ? new File([file], `${fileName.trim()}${extension}`, { type: file.type })
        : file

    const formData = new FormData()
    formData.append("file", uploadFile)
    formData.append("userId", userId)
    formData.append("eventId", eventId)
    formData.append("docType", docType)

    try {
      const res = await fetch(
        "https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/azure/upload",
        {
          method: "POST",
          body: formData,
        },
      )

      if (!res.ok) throw new Error("Upload failed")

      setSuccess(true) // Show success message
      setTimeout(() => setSuccess(false), 3000) // Auto-dismiss after 3 seconds

      handleRemoveFile()
      if (onUploadSuccess) onUploadSuccess()
    } catch (err) {
      console.error("Upload error:", err)
      setError("Failed to upload file. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 border-2 border-dashed border-teal-200 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 hover:border-teal-300 transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-teal-100 rounded-lg">
          <FiUpload className="w-5 h-5 text-teal-600" />
        </div>
        <h4 className="text-lg font-semibold text-gray-800">Upload Floor Plan</h4>
      </div>

      {/* File input */}
      <label className="block mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-2">Choose File</span>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 file:cursor-pointer cursor-pointer transition-all duration-200"
        />
      </label>

      {/* File preview and name override */}
      {file && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-teal-100 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <FiFile className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{file.name}</p>
              <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-2">File Name (optional)</span>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter custom file name"
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
            />
          </label>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 animate-fade-in">
          <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700 font-medium">Floor plan uploaded successfully!</p>
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
          uploading
            ? "bg-gray-400 cursor-not-allowed"
            : !file
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        }`}
      >
        {uploading ? (
          <>
            <AiOutlineLoading className="w-5 h-5 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <FiUpload className="w-5 h-5" />
            Upload Floor Plan
          </>
        )}
      </button>
    </div>
  )
}
