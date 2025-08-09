// Add, update, and retrieve guest details and RSVP status.
const url = 'http://localhost:3000'; // Base URL for the API - the reason why this is the full address is because the frontend and the backend are running on different ports.

async function getGuests() {
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

export { getGuests };