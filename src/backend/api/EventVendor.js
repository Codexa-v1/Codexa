// Manage venues, catering, and other services.
const url = import.meta.env.VITE_BACKEND_URL;

export function getVendors(eventId) {
    return fetch(`${url}/api/vendors/event/${eventId}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) return []; // treat "no vendors" as empty array
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

export function addVendor(eventId, vendor) {
    return fetch(`${url}/api/vendors/event/${eventId}`, {
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
        method: 'PATCH',
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
            return;
        });
}

export function searchVendors(category, city) {
    return fetch(`${url}/api/vendors/search?category=${encodeURIComponent(category)}&city=${encodeURIComponent(city)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error searching vendors');
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
