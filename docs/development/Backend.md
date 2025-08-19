# Backend Explained

## Overview
Our backend is built with **Node.js** and **Express.js**, which provides routing capabilities. The backend forms one of the three main parts of our project:
- **Frontend** → where users interact with the application.
- **API Layer** → defines functions that connect the frontend to the backend.
- **Backend** → handles routing logic and connects to the database.

When a request is made, the flow looks like this:  
**Frontend → API Layer → Backend (routes) → Database**

---

## Database and Models
We use **MongoDB Atlas** as our database, connected via **Mongoose**, which allows us to define schemas and models. Schemas enforce structure on the data stored in collections, ensuring uniformity across entries. Models are the building blocks of the data we query, create, update, and delete.

Currently, we have five main collections (subject to change as development progresses):

- **events** → stores details about events (date, time, description, etc.)
- **guests** → stores information about guests (name, email, phone, etc.)
- **vendors** → stores information about vendors (business details, services, etc.)
- **eventguests** → links guests to specific events using `guestId` and `eventId`
- **eventvendors** → links vendors to specific events using `vendorId` and `eventId`

This design allows us to manage many-to-many relationships between events and both guests and vendors.

---

## API and Routes
Our routes, built with **Express.js**, define how data is sent and retrieved from the database. These include CRUD operations (Create, Read, Update, Delete) across our collections. The API layer ensures the frontend communicates seamlessly with these routes.

---

## Authentication and Authorization
We are using **Auth0** for authentication and authorization. This allows secure login and role-based access management across the application.

---

## Testing
We plan to implement both **unit tests** (for models and API endpoints) and **integration tests** to ensure the backend interacts properly with the database. Postman is currently used for manual testing of routes.

---

## Deployment
The backend will be deployed on **Microsoft Azure**, integrated into our CI/CD pipeline using **GitHub Actions** for automated builds, testing, and deployment.
