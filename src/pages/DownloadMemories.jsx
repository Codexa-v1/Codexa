// src/pages/DownloadMemories.jsx
import React, { useEffect, useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { getPublicResource } from "@/backend/api/EventMemories";

export default function DownloadMemories() {
  const [status, setStatus] = useState("Preparing download...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("eventId");
    if (!eventId) {
      setStatus("Missing eventId in URL.");
      return;
    }

    async function fetchAndDownload() {
      try {
        const data = await getPublicResource(eventId);
        const zip = new JSZip();

        // Add pictures
        for (const pic of data.pictures || []) {
          const res = await fetch(pic.url);
          const blob = await res.blob();
          zip.file(`pictures/${pic.url.split("/").pop()}`, blob);
        }

        // Add PDF if exists
        if (data.pdf) {
          const res = await fetch(data.pdf.url);
          const blob = await res.blob();
          zip.file(`pdf/${data.pdf.url.split("/").pop()}`, blob);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, `Event_${eventId}_Memories.zip`);
        setStatus("Download should begin shortly!");
      } catch (err) {
        console.error(err);
        setStatus("Failed to download event memories.");
      }
    }

    fetchAndDownload();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col text-center p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Event Memories</h1>
      <p className="text-gray-600">{status}</p>
    </div>
  );
}
