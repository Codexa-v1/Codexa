// Add, update, and retrieve guest details and RSVP status.
const url = 'http://localhost:3000'; // Base URL for the API - the reason why this is the full address is because the frontend and the backend are running on different ports.

export async function getGuests() {
    fetch(url+'/guests', {
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

export async function addGuest(guest) {
    fetch(url+'/guests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(guest)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Guest added:', data);
    })
    .catch(error => {
        console.error('Error adding guest:', error);
    });
}

export async function updateGuest(id) {
    fetch(url+'/guests/'+id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
        console.error('Error updating guest:', error);
    });
}

export async function deleteGuest(id) {
    fetch(url+'/guests/'+id, {
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