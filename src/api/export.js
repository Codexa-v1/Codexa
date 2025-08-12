// Provide downloadable event packages for other apps.

const url = 'http://localhost:3000';

export function getEvent(eventId) {
    return fetch(`${url}/event/${eventId}`)
    .then(response => response.json())
    .then(data => {
        const csv = convertToCSV(data);
        downloadCSV(csv, 'data.csv');
    })
    .catch(error => console.error('Error:', error));
}

function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','), // Header row
        ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
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
    getEvents,
};