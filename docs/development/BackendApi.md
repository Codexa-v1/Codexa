# Planit Backend API Documentation

## Base URL
```
https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net
```

## Authentication
- Most endpoints do **not** require authentication by default.
- If your deployment enforces authentication, provide a valid token in the `Authorization` header.

## Common Headers
```http
Content-Type: application/json
```

---

## Endpoints Overview

### Events
- **Get Event by ID**
  ```
  GET /api/events/:id
  ```
- **Create Event**
  ```
  POST /api/events
  ```
  **Body Example:**
  ```json
  {
    "eventPlanner": "user123",
    "title": "Annual Gala",
    "description": "A special event",
    "location": "Toronto",
    "category": "Conference",
    "capacity": 100,
    "budget": 5000,
    "theme": "Gala",
    "date": "2025-09-02",
    "startTime": "2025-09-02T18:00:00Z",
    "endTime": "2025-09-02T23:00:00Z",
    "endDate": "2025-09-02"
  }
  ```
- **Update Event**
  ```
  PATCH /api/events/:id
  ```
- **Delete Event**
  ```
  DELETE /api/events/:id
  ```

---

### Guests
- **Get Guests for Event**
  ```
  GET /api/guests/event/:eventId
  ```
- **Add Guest to Event**
  ```
  POST /api/guests/event/:eventId
  ```
  **Body Example:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "1234567890",
    "rsvpStatus": "Pending",
    "dietaryPreferences": "Vegetarian"
  }
  ```
- **Update Guest**
  ```
  PATCH /api/guests/event/:eventId/guest/:guestId
  ```
- **Delete Guest**
  ```
  DELETE /api/guests/event/:eventId/guest/:guestId
  ```

---

### Vendors
- **Get Vendors for Event**
  ```
  GET /api/vendors/event/:eventId
  ```
- **Add Vendor to Event**
  ```
  POST /api/vendors/event/:eventId
  ```
  **Body Example:**
  ```json
  {
    "vendorName": "Catering Co",
    "vendorEmail": "contact@cateringco.com",
    "vendorPhone": "9876543210",
    "vendorType": "Catering"
  }
  ```
- **Update Vendor**
  ```
  PATCH /api/vendors/event/:eventId/vendors/:vendorId
  ```
- **Delete Vendor**
  ```
  DELETE /api/vendors/event/:eventId/vendors/:vendorId
  ```

---

### Venues
- **Get Venues for Event**
  ```
  GET /api/venues/event/:eventId
  ```
- **Add Venue to Event**
  ```
  POST /api/venues/event/:eventId
  ```
  **Body Example:**
  ```json
  {
    "venueName": "Grand Hall",
    "venueAddress": "123 Main St",
    "venueEmail": "info@grandhall.com",
    "venuePhone": "5551234567",
    "capacity": 200,
    "venueStatus": "Available",
    "venueCost": 2000,
    "venueAvailability": "Yes"
  }
  ```
- **Update Venue**
  ```
  PATCH /api/venues/event/:eventId/venue/:venueId
  ```
- **Delete Venue**
  ```
  DELETE /api/venues/event/:eventId/venue/:venueId
  ```

---

### Schedules
- **Get Schedule for Event**
  ```
  GET /api/schedules/event/:eventId
  ```
- **Add Schedule Item**
  ```
  POST /api/schedules/event/:eventId
  ```
  **Body Example:**
  ```json
  {
    "description": "Welcome Speech",
    "startTime": "2025-09-02T18:00:00Z",
    "endTime": "2025-09-02T18:30:00Z"
  }
  ```
- **Update Schedule Item**
  ```
  PATCH /api/schedules/event/:eventId/schedule/:scheduleId
  ```
- **Delete Schedule Item**
  ```
  DELETE /api/schedules/event/:eventId/schedule/:scheduleId
  ```

---

### Export Event
- **Export Event Data**
  ```
  GET /api/export/event/:eventId
  ```

---

## Error Handling
- All endpoints return standard HTTP status codes:
  - `200` Success
  - `201` Created
  - `400` Bad Request (invalid input)
  - `404` Not Found
  - `500` Server Error

## Example Usage (with curl)
```sh
curl -X GET https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net/api/events/1234567890abcdef12345678
```