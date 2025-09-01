# Backend Explained

## 🔬 Overview
Our backend is built with **Node.js** and **Express.js**, which provides routing capabilities. The backend forms one of the three main parts of our project:
- **Frontend** → where users interact with the application.
- **API Layer** → defines functions that connect the frontend to the backend.
- **Backend** → handles routing logic and connects to the database.

When a request is made, the flow looks like this:  
**Frontend → API Layer → Backend (routes) → Database**

---

## 📈 Database and Models
For our database system, we decided to use **MongoDB** as our database. The reason for 
this lies in the way in which one can specify how exactly data will be stored in the 
database for different **collections**, using models. **Models** are pieces of code where one 
specifies what fields an object will have, for instance, for a guest a model would have 
information such as name, surname, contact details, etc. This would be the structure of all 
guests for our application, and so by using models we can ensure consistency in how we 
send and receive data from the database. Furthermore, we can add whichever fields we 
desire for models that we are planning to use, making models a good choice to store fine
tuned data in our database

We used eight different schemas for our models, namely: event, guest, vendor, venue, 
eventguest, eventvendor, eventguest, eventschedule

- The **Event model** has information that we keep on a specific evet
```bash

```

---

## API and Routes
Our routes, built with **Express.js**, define how data is sent and retrieved from the database. These include CRUD operations (Create, Read, Update, Delete) across our collections. The API layer ensures the frontend communicates seamlessly with these routes.

---

## 🔒 Authentication 
We are using **Auth0** for authentication and authorization. This ensures secure login, token-based authentication, and role-based access control.

- **SPA (Frontend)** → Uses `@auth0/auth0-react` for handling login/logout, token retrieval, and redirects.
- **Backend (API)** → Uses Auth0-issued JWT tokens to verify requests, with audience and issuer checks enabled.
- **Allowed URLs** → Auth0 configured with callback, logout, and web origins for both localhost (development) and Azure production domains.
- **Environment variables**:
  - Frontend: `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`  
    → injected at build time via GitHub Secrets.
  - Backend: `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`  
    → stored securely in Azure App Service Configuration.

🔐 **Security note:** Secrets are never stored in the repo. SPA keys are safe to expose (domain, clientId, audience) but API secrets remain on the server side.

---

## 🧪 Testing
We are implementing testing at three levels: frontend, backend, and end-to-end.

### 1. Frontend Unit & Integration Tests → Vitest + React Testing Library
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom      #install
npx vitest      #test
```
- Vitest → Chosen because it is optimized for Vite projects, fast
- React Testing Library → Helps ensure UI components work as expected from a user perspective.
- @testing-library/jest-dom → Provides expressive matchers for DOM node assertions.

### 2. End-to-End (E2E) Tests → Playwright
```bash
npm install --save-dev @playwright/test #install
npx playwright test         #test
```
- Playwright → Chosen for cross-browser testing (Chromium, Firefox, WebKit). Provides automated testing that simulates real user interactions across multiple devices and screen sizes.

### 3. Backend Tests → Jest + Supertest
**Install:**
```bash
npm install --save-dev jest supertest       #install
npx jest        #test
```
- Jest → A widely adopted JavaScript testing framework, simple configuration, good for asynchronous tests.
- Supertest → Specialized for testing HTTP APIs in Node.js, making it easy to assert responses from Express routes

---

## 🚀 Deployment
We chose **Microsoft Azure** for deployment because:  
- **Seamless GitHub Integration** → Built-in GitHub Actions support makes CI/CD pipelines easier to set up and maintain.  
- **Free/Student-friendly Tiers** → Azure provides free hosting credits and student benefits (via GitHub Student Developer Pack), reducing deployment costs.  
- **Separation of Concerns** → Azure allows us to host the **frontend (Static Web Apps)** and **backend (App Service)** independently, ensuring scalability and clear architecture.  
- **Environment Variables & Secrets Management** → Azure App Service configuration ensures sensitive data (DB connections, Auth0 secrets) remain secure and out of source control.   
- **Scalability** → Both Static Web Apps and App Service can scale automatically as traffic increases, ensuring reliability.  

We deploy the system in two parts:

- **Frontend (Vite + React SPA)** → Hosted on **Azure Static Web Apps**  
  - Deployed via GitHub Actions workflow.  
  - Handles SPA routing with `staticwebapp.config.json` to redirect all paths to `index.html`.  
  - Uses environment variables (`VITE_*`) injected at build time.

- **Backend (Node/Express API)** → Hosted on **Azure App Service (Linux)**  
  - Deployed via a separate GitHub Actions workflow using an App Service publish profile.  
  - Configured with environment variables (Auth0, DB connection, CORS origins).  
  - CORS enabled to allow only requests from the SPA domain.

- **CI/CD (GitHub Actions)**  
  - Automated build and deploy pipelines for both frontend and backend.  
  - Workflows fetch environment variables from GitHub Secrets.  
  - Any push to `main` triggers deployment.

⚠️ **Issues faced & resolutions**:
1. **GitHub Actions build failed** due to relative path imports → fixed using Vite `@` alias pointing to `src/`.  
2. **Handling Auth0 secrets safely** → moved SPA config to GitHub Secrets (`VITE_*`) and API secrets into Azure App Service settings.

## 🏃‍♂️ Running web app locally

### 1. Clone the repository
```bash
git clone https://github.com/Codexa-v1/Codexa.git
cd Codexa
```

### 2. 📍 Install dependencies
```bash
npm install
npm install @auth0/auth0-react   #Auth0
```

### 3. 🏃‍♂️ Run the development servers
```bash
npm run dev         #Frontend
npm run server       #Backend
cd api 
npm run start         #Api
```



---

