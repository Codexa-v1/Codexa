# Codexa API & Routes Testing Summary

This document details the tests implemented in the `api` and `routes` folders, specifying what was tested and how.

---

## API Tests (`api`)

### Event API
**Tested:**
- CRUD operations (`createEvent`, `getEvent`, `updateEvent`, `deleteEvent`, `getAllEvents`)

**How:**
- Used Vitest to mock `fetch` calls.
- Verified correct HTTP methods, endpoints, and request bodies.
- Checked returned data matches the event model.
- Simulated network errors and invalid responses.

---

### Event Export API
**Tested:**
- Event export and CSV download logic.

**How:**
- Mocked `fetch` and `URL.createObjectURL`.
- Checked that CSV blob is created and download link is triggered.
- Verified error handling for failed fetches.

---

### Guest API
**Tested:**
- Guest CRUD operations (`getGuests`, `addGuest`, `updateGuest`, `deleteGuest`)

**How:**
- Mocked `fetch` for all endpoints.
- Verified correct data structure for guests.
- Checked error handling and edge cases (404, network errors).

---

### Schedule API
**Tested:**
- Schedule CRUD operations (`getSchedule`, `createEventSchedule`, `updateEventSchedule`, `deleteEventSchedule`)

**How:**
- Mocked `fetch` and checked request payloads.
- Verified returned schedule items match the schema.
- Tested error scenarios.

---

### Vendor API
**Tested:**
- Vendor CRUD operations (`getVendors`, `addVendor`, `updateVendor`, `deleteVendor`)

**How:**
- Mocked `fetch` and checked request/response structure.
- Verified vendor data matches the model.
- Simulated error and edge cases.

---

### Venue API
**Tested:**
- Venue CRUD operations (`getVenues`, `addVenue`, `updateVenue`, `deleteVenue`)

**How:**
- Mocked `fetch` and environment variables.
- Verified correct URLs and payloads.
- Checked error handling and partial updates.

---

## Routes Tests (`routes`)

### Event Routes
**Tested:**
- Express endpoints for events (`GET`, `POST`, `PATCH`, `DELETE`, `/all`)

**How:**
- Used Supertest to simulate HTTP requests.
- Mocked Mongoose model methods.
- Verified response codes, returned data, and error handling.

---

### Event Export Routes
**Tested:**
- Event download endpoint.

**How:**
- Used Supertest for `GET` requests.
- Mocked `Mongoose.findById`.
- Checked for correct status codes and error responses.

---

### Guest Routes
**Tested:**
- Endpoints for managing guests per event.

**How:**
- Used Supertest for all HTTP methods.
- Mocked models for guests and event-guest relationships.
- Verified correct guest creation, updating, deletion, and error handling.

---

### Schedule Routes
**Tested:**
- Endpoints for event schedules.

**How:**
- Used Supertest for CRUD operations.
- Mocked schedule and event models.
- Checked for correct data, status codes, and error handling.

---

### Vendor Routes
**Tested:**
- Endpoints for event vendors.

**How:**
- Used Supertest for all vendor operations.
- Mocked vendor and event-vendor models.
- Verified correct vendor management and error handling.

---

### Venue Routes
**Tested:**
- Endpoints for event venues.

**How:**
- Used Supertest for CRUD operations.
- Mocked venue and event-vendor models.
- Checked for correct venue management and error handling.

---

## Testing Approach

- **Unit Testing**  
  Used Vitest for API logic, mocking network requests and verifying data structures.

- **Integration Testing**  
  Used Supertest for Express routes, simulating real HTTP requests and mocking database models.

- **Error Handling**  
  Simulated network/database errors, missing resources, and invalid data to ensure robust error responses.

- **Model Validation**  
  Ensured all test data matches the actual Mongoose schemas.
 
---

All API and routes were tested, as all of them are crucial in making our application functional.