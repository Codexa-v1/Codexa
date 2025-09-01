import React, { useState, useEffect } from "react";
import { 
  getSchedule, 
  deleteEventSchedule, 
  updateEventSchedule 
} from "../backend/api/EventSchedule";
const url = import.meta.env.VITE_BACKEND_URL;

export default function ScheduleModal({ eventId, onClose, onAddSchedule, onEditSchedule }) {
  // --- Export to Word ---
  async function handleExportWord() {
    // Get event details (fetch from backend or pass as prop if available)
    let eventDetails = {};
    try {
      const res = await fetch(`${url}/api/events/${eventId}`);
      if (res.ok) {
        eventDetails = await res.json();
      }
    } catch (err) {
      console.error("Error fetching event details for export:", err);
    }

    // Format date for display
    let formattedDate = "";
    if (eventDetails.date) {
      const dateObj = new Date(eventDetails.date);
      formattedDate = dateObj.toLocaleDateString();
    }

    // Build Word document
    const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } = await import("docx");

    const scheduleTable = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Time")] }),
            new TableCell({ children: [new Paragraph("Description")] }),
          ],
        }),
        ...schedule.map(item =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(`${item.startTime} – ${item.endTime}`)] }),
              new TableCell({ children: [new Paragraph(item.description)] }),
            ],
          })
        )
      ]
    });

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: `Event Title: ${eventDetails.title || ""}`, heading: "Heading1" }),
          new Paragraph({ text: `Date: ${formattedDate}` }),
          new Paragraph({ text: `Location: ${eventDetails.location || ""}` }),
          new Paragraph({ text: `Description: ${eventDetails.description || ""}` }),
          new Paragraph({ text: "Schedule:", heading: "Heading2" }),
          scheduleTable
        ]
      }]
    });

    Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "EventSchedule.docx";
      a.click();
      URL.revokeObjectURL(url);
    });
  }
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getSchedule(eventId);

        // Sort by startTime (HH:mm)
        const sorted = data.sort((a, b) => {
          const [aHour, aMin] = a.startTime.split(":").map(Number);
          const [bHour, bMin] = b.startTime.split(":").map(Number);
          return aHour !== bHour ? aHour - bHour : aMin - bMin;
        });

        setSchedule(sorted);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };
    fetchSchedule();
  }, [eventId]);


  // --- Handlers ---
  const handleEditSchedule = (index) => {
    const item = schedule[index];
    if (onEditSchedule) {
      // pass item to AddScheduleModal for editing
      onEditSchedule(item, async (updatedData) => {
        try {
          const updated = await updateEventSchedule(eventId, item._id, updatedData);

          // update local state with new data
          setSchedule((prev) =>
            prev.map((s) => (s._id === item._id ? updated : s))
          );

          console.log("Updated schedule:", updated);
        } catch (error) {
          console.error("Error updating schedule item:", error);
        }
      });
    }
  };

  const handleRemoveSchedule = async (index) => {
    const item = schedule[index];
    if (!item?._id) {
      console.error("No scheduleId found for:", item);
      return;
    }

    try {
      await deleteEventSchedule(eventId, item._id);
      setSchedule((prev) => prev.filter((_, i) => i !== index));
      console.log("Removed schedule item:", item._id);
    } catch (error) {
      console.error("Error removing schedule item:", error);
    }
  };

  return (
  <section className="bg-white rounded-lg shadow-lg p-4 sm:p-12 max-w-7xl w-full relative max-h-screen overflow-y-auto">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        &times;
      </button>

      <h3 className="text-xl font-bold mb-4 text-yellow-900">Event Schedule</h3>

      <section className="flex gap-2 mb-4">
        <button
          className="px-3 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800"
          onClick={() => onAddSchedule(null)} // open AddScheduleModal for new
        >
          + Add Schedule Item
        </button>
        <button
          className="px-3 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
          onClick={handleExportWord}
        >
          Export to Word
        </button>
      </section>

      {schedule.length === 0 ? (
        <p>No schedule items added yet.</p>
      ) : (
        <ul className="space-y-2">
          {schedule.map((item, idx) => (
            <li key={item._id || idx} className="border rounded p-2 space-y-2">
              <p className="font-semibold">{item.description}</p>
              <p className="text-xs text-gray-500">
                {item.startTime} – {item.endTime}
              </p>
              <div className="flex space-x-2">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm font-semibold"
                  onClick={() => handleEditSchedule(idx)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold"
                  onClick={() => handleRemoveSchedule(idx)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
