// Event metadata (theme, date, schedule, maps).
const url = 'http://localhost:3000';

export function getEventData(eventId) {
    return fetch(`${url}/events/${eventId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

export function updateEventData(eventId, eventData) {
    return fetch(`${url}/events/${eventId}`, {
        method: 'PUT',
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

export function deleteEventData(eventId) {
    return fetch(`${url}/events/${eventId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

export function createEventData(eventData) {
    return fetch(`${url}/events`, {
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
            return response.json();
        });
}

export default {
    getEventData,
    updateEventData,
    deleteEventData,
    createEventData
};
