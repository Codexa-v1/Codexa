// EventMemories.js
// Usage: import { getPublicResource, uploadPictures, uploadPDF, deletePDF, deletePictures } from "./EventMemories";

const baseUrl = "https://sdp-project-zilb.onrender.com/api/v1/public";

/**
 * Get public resources for an event
 * @param {string} eventId - The event ID
 */
export async function getPublicResource(eventId) {
  const res = await fetch(`${baseUrl}/${eventId}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch public resource");
  return res.json();
}

/**
 * Upload multiple pictures for an event
 * @param {string} eventId - The event ID
 * @param {File[]} files - Array of image files
 */
export async function uploadPictures(eventId, files) {
  const formData = new FormData();

  // API expects field name "images", not "files"
  files.forEach((file) => formData.append("images", file));
  formData.append("event_id", eventId);

  const res = await fetch(`${baseUrl}/pictures`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload pictures");
  return res.json();
}

/**
 * Upload a single PDF file for an event
 * @param {string} eventId - The event ID
 * @param {File} file - The PDF file
 */
export async function uploadPDF(eventId, file) {
  const formData = new FormData();

  // API expects field name "pdf", not "file"
  formData.append("pdf", file);
  formData.append("event_id", eventId);

  const res = await fetch(`${baseUrl}/pdf`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload PDF");
  return res.json();
}

/**
 * Delete all pictures for an event
 * @param {string} eventId - The event ID
 */
export async function deletePictures(eventId) {
  const res = await fetch(`${baseUrl}/pictures/${eventId}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error("Failed to delete pictures");
  return res.json();
}

/**
 * Delete the PDF document for an event
 * @param {string} eventId - The event ID
 */
export async function deletePDF(eventId) {
  const res = await fetch(`${baseUrl}/pdf/${eventId}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) throw new Error("Failed to delete PDF");
  return res.json();
}
