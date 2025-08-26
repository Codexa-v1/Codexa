// Manage venues, catering, and other services.
const url = 'http://localhost:3000';

export function getVenues(eventId) {
    return fetch(`${url}/api/venues/event/${eventId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}
export function addVenue(eventId, venue) {
    return fetch(`${url}/api/venues/event/${eventId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(venue),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}
export function updateVenue(eventId, venueId, venue) {
    return fetch(`${url}/api/venues/event/${eventId}/venue/${venueId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(venue),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}
export function deleteVenue(eventId, venueId) {
    return fetch(`${url}/api/venues/event/${eventId}/venue/${venueId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

export default {
    getVenues,
    addVenue,
    updateVenue,
    deleteVenue
};
