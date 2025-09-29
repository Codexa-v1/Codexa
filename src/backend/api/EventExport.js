// Provide downloadable event packages for other apps.
const url = import.meta.env.VITE_BACKEND_URL;

export function getEvent(eventId) {
    return fetch(`${url}/event/${eventId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Ensure we always work with an array
            const arr = Array.isArray(data) ? data : [data];
            const csv = convertToCSV(arr);
            downloadCSV(csv, 'data.csv');
            return data; // return for testing purposes
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), // Header row
        ...data.map(row =>
            headers.map(fieldName => JSON.stringify(row[fieldName] ?? "")).join(',')
        ),
    ];
    return csvRows.join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export default {
    getEvent,
};