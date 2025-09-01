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

export async function updateGuest(eventId, guestId, guest) {
    fetch(url+'/event/'+eventId+'/guest/'+guestId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(guest)
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
        console.error('Error updating guest:', error);
    });
}

export async function deleteGuest(eventId, guestId) {
    fetch(`${url}/api/guests/event/${eventId}/guest/${guestId}`, {
        method: 'DELETE',   
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Guest deleted successfully');
        } else {
            throw new Error('Failed to delete guest');
        }
    })
    .catch(error => {
        console.error('Error deleting guest:', error);
    });
} 

export default { getGuests, addGuest, updateGuest, deleteGuest };