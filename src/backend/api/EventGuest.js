// Add, update, and retrieve guest details and RSVP status.
const url = 'http://localhost:3000'; // Base URL for the API - the reason why this is the full address is because the frontend and the backend are running on different ports.

export async function getGuests(eventId) {
    fetch(url+'/event/'+eventId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Guests:', data);
    })
    .catch(error => {
        console.error('Error fetching guests:', error);
    });
}

export async function addGuest(eventId, guest) {
    fetch(url+'/event/'+eventId+'/guest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(guest)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Guest added:', data);
        return data;
    })
    .catch(error => {
        console.error('Error adding guest:', error);
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
    fetch(url+'/event/'+eventId+'/guest/'+guestId, {
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