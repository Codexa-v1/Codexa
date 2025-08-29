import React from "react";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import DocumentUpload from "@/components/DocumentUpload";
import floorPlans from "@/assets/floorPlans/floorPlans";

export default function FloorPlanModal() {
  return (
    <section className="bg-white rounded-lg shadow-lg p-8 w-full relative">
      <h3 className="text-xl font-bold mb-4 text-green-900">Floor plans</h3>

      {floorPlans && floorPlans.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {floorPlans.map((fPlan, idx) => (
            <div
              key={idx}
              className="border rounded-lg shadow p-4 flex flex-col justify-between relative bg-white"
            >
              <section className="flex flex-between">
                <label htmlFor="floorPlan">{fPlan.name}</label>
                <a
                  href={fPlan.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
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
              </section>
              <img src={fPlan.image} alt={fPlan.name} className="floorPlan" />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No floorPlans available for this event.</p>
      )}
      <DocumentUpload />
    </section>
  );
}

