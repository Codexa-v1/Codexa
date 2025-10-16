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

    const getFileNameFromUrl = (url) => {
      const parts = url.split("/");
      return parts[parts.length - 1].split("?")[0]; // remove query params
    };

    async function fetchAndDownload() {
      try {
        setStatus("Fetching files...");

        const res = await getPublicResource(eventId);
        const data = res.data?.data || res.data || {};
        const records = Array.isArray(data) ? data : [data];

        const zip = new JSZip();

        // Add pictures
        const pictureRecords = records.filter(r => r.picture_url);
        for (const r of pictureRecords) {
          const url = r.picture_url;
          const resp = await fetch(url);
          const blob = await resp.blob();
          zip.file(`pictures/${getFileNameFromUrl(url)}`, blob);
        }

        // Add PDF (force correct MIME type using Blob)
        const pdfRecord = records.find(r => r.file_url);
        if (pdfRecord) {
          const url = pdfRecord.file_url;
          const resp = await fetch(url);
          const blob = await resp.blob();

          // Force MIME type PDF
          const pdfBlob = new Blob([blob], { type: "application/pdf" });

          zip.file(`pdf/${getFileNameFromUrl(url)}`, pdfBlob);
        }

        setStatus("Generating ZIP...");
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