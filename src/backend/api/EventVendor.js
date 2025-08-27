// Manage venues, catering, and other services.
const url = 'http://localhost:3000';

export function getVendors(eventId) {
    return fetch(`${url}/api/vendors/event/${eventId}/vendors`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) return []; // treat "no vendors" as empty array
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

export function addVendor(eventId, vendor) {
    return fetch(`${url}/api/vendors/event/${eventId}/vendors`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendor),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

export function updateVendor(eventId, vendorId, vendor) {
    return fetch(`${url}/api/vendors/event/${eventId}/vendors/${vendorId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendor),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

export function deleteVendor(eventId, vendorId) {
    return fetch(`${url}/api/vendors/event/${eventId}/vendors/${vendorId}`, {
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
    getVendors,
    addVendor,
    updateVendor,
    deleteVendor
};
