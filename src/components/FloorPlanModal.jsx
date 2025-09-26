import React, { useEffect, useState, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import FloorPlanUpload from "@/components/FloorPlanUpload";

export default function FloorPlanModal({ eventId, onClose }) {
  const { user, isAuthenticated } = useAuth0();
  const [floorPlans, setFloorPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFloorPlans = useCallback(async () => {
    if (!isAuthenticated || !user?.sub || !eventId) return;
    setLoading(true);

    try {
      const res = await fetch(
        `https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/azure/list-user-documents?userId=${encodeURIComponent(
          user.sub
        )}&eventId=${encodeURIComponent(eventId)}`
      );

      if (!res.ok) throw new Error("Failed to fetch floor plans");

      const data = await res.json();

      const floorPlanFiles = data.filter((f) => f.type === "FloorPlan");

      const uniqueFiles = Array.from(
        new Map(floorPlanFiles.map((f) => [f.name, f])).values()
      );

      setFloorPlans(uniqueFiles);
    } catch (err) {
      console.error("Error fetching floor plans:", err);
      setFloorPlans([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, eventId]);

  useEffect(() => {
    fetchFloorPlans();
  }, [fetchFloorPlans]);

  // ---------------- DELETE FUNCTION ----------------
  const handleDelete = async (fPlan) => {
    if (!confirm(`Are you sure you want to delete "${fPlan.name}"?`)) return;

    try {
      const res = await fetch(
        "https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/azure/delete-user-document",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.sub,
            eventId,
            docType: "FloorPlan",
            fileName: fPlan.name,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to delete floor plan");

      fetchFloorPlans();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete floor plan. Please try again.");
    }
  };

  return (
    <section className="bg-white rounded-lg shadow-lg p-8 w-full relative">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        &times;
      </button>

      <h3 className="text-xl font-bold mb-4 text-green-900">Floor Plans</h3>

      {loading ? (
        <p className="text-gray-500">Loading floor plans...</p>
      ) : floorPlans.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {floorPlans.map((fPlan) => (
            <div
              key={fPlan.name}
              className="border rounded-lg shadow p-4 flex flex-col justify-between relative bg-white"
            >
              {/* Top bar: Name + Download + Delete */}
              <section className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">{fPlan.name}</span>
                <div className="flex gap-2">
                  <a
                    href={fPlan.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                      />
                    </svg>
                  </a>
                  <button
                    onClick={() => handleDelete(fPlan)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </section>

              {/* Show PDF as a View/Download button */}
              {fPlan.url.split("?")[0].toLowerCase().endsWith(".pdf") ? (
                <a
                  href={fPlan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded hover:bg-gray-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.84 4.242 12.083 12.083 0 01-.84 4.242L12 14z"
                    />
                  </svg>
                  View / Download PDF
                </a>
              ) : (
                <img
                  src={fPlan.url}
                  alt={fPlan.name}
                  className="mt-2 rounded-md h-40 object-cover border"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No floor plans available for this event.</p>
      )}

      <div className="mt-6">
        <FloorPlanUpload
          userId={user?.sub}
          eventId={eventId}
          onUploadSuccess={fetchFloorPlans}
        />
      </div>
    </section>
  );
}
