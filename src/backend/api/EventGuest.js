// Add, update, and retrieve guest details and RSVP status.
const url = import.meta.env.VITE_BACKEND_URL; // Base URL for the API

export function getGuests(eventId) {
    return fetch(`${url}/api/guests/event/${eventId}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) return []; // treat "no guests" as empty array
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

export function addGuest(eventId, guest) {
    return fetch(`${url}/api/guests/event/${eventId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(guest),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

export function updateGuest(eventId, guestId, guest) {
    return fetch(`${url}/event/${eventId}/guest/${guestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(guest),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update guest');
            }
            return response.json();
        });
}

export function deleteGuest(eventId, guestId) {
    return fetch(`${url}/event/${eventId}/guest/${guestId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete guest');
            }
            return { success: true };
        });
}

export default { getGuests, addGuest, updateGuest, deleteGuest };
