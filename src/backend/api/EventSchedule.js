const url = "http://localhost:3000";

export function getSchedule(eventId) {
  return fetch(`${url}/api/schedules/event/${eventId}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching event schedule:", error);
      throw error;
    });
}

export function createEventSchedule(eventId, scheduleData) {
  return fetch(`${url}/api/schedules/event/${eventId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scheduleData),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error creating event schedule:", error);
      throw error;
    });
}

export function updateEventSchedule(eventId, scheduleId, updateData) {
  return fetch(`${url}/api/schedules/event/${eventId}/schedule/${scheduleId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error updating event schedule:", error);
      throw error;
    });
}

export function deleteEventSchedule(eventId, scheduleId) {
  return fetch(`${url}/api/schedules/event/${eventId}/schedule/${scheduleId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error deleting event schedule");
      }
    })
    .catch((error) => {
      console.error("Error deleting event schedule:", error);
      throw error;
    });
}