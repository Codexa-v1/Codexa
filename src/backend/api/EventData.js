// Event metadata (theme, date, schedule, maps).
const url = 'http://localhost:3000';

export function createEvent(eventData) {
    return fetch(`${url}/api/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Event created successfully');
            return response.json();
        });
}

export function getEvent(eventId) {
    return fetch(`${url}/api/events/${eventId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

export function updateEvent(eventId, eventData) {
    return fetch(`${url}/api/events/${eventId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

export function deleteEvent(eventId) {
    return fetch(`${url}/api/events/${eventId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

export function getAllEvents(id) {
    return fetch(`${url}/api/events/all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
    })
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
    });
}

export default {
    getEvent,
    updateEvent,
    deleteEvent,
    createEvent,
    getAllEvents
};
