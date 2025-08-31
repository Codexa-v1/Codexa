# 🎉 PlanIt: Event Planning App

PlanIt is a full-stack **Event Planning Web Application** built with the **MERN stack** (MongoDB, Express, React, Node.js), along with **Vite, Tailwind CSS, and Auth0** for authentication.  

The app allows users to:  
- Create and manage events  
- Handle guest lists (upload/download)  
- Manage vendors and compare options  
- Schedule event activities (with export to PDF/CSV)  
- Upload/download event-related documents  
- Integrate with a calendar  
- Share event details easily  

---

## 🚀 Tech Stack
- **Frontend**: React 19 + Vite + Tailwind CSS + Framer Motion  
- **Backend**: Node.js + Express.js  
- **Database**: MongoDB Atlas + Mongoose  
- **Authentication**: Auth0 (OAuth 2.0)  
- **Deployment**: Microsoft Azure (Backend + Frontend)  
- **CI/CD**: GitHub Actions  

---

## 🛠️ Getting Started

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

### 4. ✅ Testing
- **Frontend (Unit & Integration):** Vitest + React Testing Library 
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom      #install
npx vitest      #Test
```
- **End-to-End (E2E):** Playwright
```bash
npm install --save-dev @playwright/test     #install
npx playwright test     #test
```
- **Backend (API Tests):** Jest + Supertest
```bash
npm install --save-dev jest supertest     #install
npx jest     #test
```

### 5. 📦 Deployment
We deploy via Azure App Services:
- https://victorious-ground-09423c310.1.azurestaticapps.net/
- VITE_BACKEND_URL=https://planit-backend-amfkhqcgbvfhamhx.canadacentral-01.azurewebsites.net 

### 6. 📖 Documentation
Full documentation (meeting minutes, sprints, design decisions) is available on our GitHub Pages site:
- 👉 https://codexa-v1.github.io/Codexa/

### 7. 👥 Team Codexa
- Given: Documentation + Scrum Master
- Kutlwano: Backend, DevOps, Auth0, Deployment
- Molemo: Full-Stack Development
- Ntando: Testing + Frontend
- Ntobeko: Frontend Development

[![codecov](https://codecov.io/github/Codexa-v1/Codexa/graph/badge.svg?token=A79VJR62ZH)](https://codecov.io/github/Codexa-v1/Codexa)
