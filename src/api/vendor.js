// Manage venues, catering, and other services.
const url = 'http://localhost:3000';

export function getVendors() {
    return fetch(`${url}/vendors`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}
export function addVendor(vendor) {
    return fetch(`${url}/vendors`, {
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
export function updateVendor(vendorId, vendor) {
    return fetch(`${url}/vendors/${vendorId}`, {
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
export function deleteVendor(vendorId) {
    return fetch(`${url}/vendors/${vendorId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}
