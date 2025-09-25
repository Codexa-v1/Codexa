import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export async function getDocuments(userId, eventId) {
  try {
    const res = await axios.get(`${API_BASE}/api/azure/list-user-documents`, {
      params: { userId, eventId },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching documents:", err);
    return [];
  }
}
