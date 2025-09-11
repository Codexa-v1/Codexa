# PlanIt Event Planner: Sprint 3 Development Plan 

---

## 1. 🎯 Sprint Goal
Deliver a **feature-complete, stable, and tested event planning web application** by:  
- Implementing guest and vendor management enhancements (VIP guests, vendor validation, budget tracking).  
- Expanding and documenting automated testing to achieve ≥80% coverage.  
- Making APIs externally available and reliable.  
- Improving app performance with auto-reload and faster refresh.  
- Conducting stakeholder reviews and incorporating feedback.  
- Providing clear, updated documentation (features, APIs, DB schema, testing).  
- Demonstrating adherence to Agile Scrum through standups, retros, and backlog tracking.  

---

## 2. 🛠️ Tasks / Features with Responsibilities (Roles)

### 🧑‍🏫 Scrum Master: **Given**
- Facilitate standups (Tue, Thu, Sun) and retrospectives.  
- Track sprint progress in Trello (burndown, blockers, priorities).  
- Ensure backlog is groomed and aligned with rubric.  
- Oversee documentation site updates.  

### 📃 Documentation Specialist: **Given**
- Record meeting minutes, agendas, and stakeholder reviews.  
- Document testing approach (what’s tested, what isn’t, justification).  
- Maintain Sprint 3 Development Plan and publish on docs site.  
- Monitor User feedback using google forms

### 🧑‍💻 Backend Developers: **Molemo & Kutlwano**
- Guest Management:  
  - Replace email as guest ID → event-specific unique IDs.  
  - Add **VIP Guest feature**.  
- Vendor Management:  
  - Input validation (alert if missing fields).  
  - Vendor comparison (availability + affordability).  
  - Prevent double booking.  
  - Implement budget tracking (alerts + cost subtraction).  
- Implement auto-reload & faster refresh.  
- Maintain bug tracker entries for backend issues.  

### 🧑‍💻 Frontend Developers: **Ntando, Ntobeko, Kutlwano**
- Build responsive UI components (React, Vite, Tailwind, Material Tailwind, Framer Motion).  
- Guest management UI (VIP tag, guest list upload/download).  
- Vendor browsing & management UI (compare vendors, budget warnings).  
- Enhance responsiveness for small/large screens.  
- Connect UI to backend APIs and ensure smooth data flow.  

### 🧪 Code Tester / QA: **Ntando**
- Write & run automated test cases:  
  - Unit tests (frontend + backend).  
  - Integration tests (guest/vendor flows).  
  - End-to-End (E2E) tests.  
- Document testing scope on GitHub:  
  - What is tested, what is not tested, why.  
- Manual testing for UI/UX issues.  
- Report & document bugs (Trello + GitHub issues).  
- Track bug fixes and report status.  

### 🚀 DevOps Engineer: **Kutlwano**
- Maintain CI/CD pipelines with GitHub Actions.  
- Deploy app to Microsoft Azure.  
- Integrate automated test suite into pipeline (≥80% coverage gate).  
- Ensure production environment stability.  
- Monitor performance benchmarks.  

---

## 3. 👤 User Stories with Acceptance Criteria

### User Story 1: Guest Management
**As an event planner,** I want to add guests with unique IDs (not emails), so that I can reuse the same guest across multiple events.  
- **Acceptance Criteria:**  
  - Guests can be added without duplicate errors.  
  - Each guest has a unique ID scoped to an event.  
  - A “VIP” tag can be added to highlight priority guests.  

---

### User Story 2: Vendor Management
**As an event planner,** I want to compare vendors by availability and affordability, so that I can make cost-effective and conflict-free choices.  
- **Acceptance Criteria:**  
  - Alerts if required vendor details are missing.  
  - Vendors unavailable if booked on the same date.  
  - Vendors can be filtered by budget.  
  - When a vendor is added, the budget reduces accordingly.  
  - Alert appears if budget is exceeded.  

---

### User Story 3: App Performance
**As a user,** I want the app to refresh automatically after changes, so that I can see updated information without manually reloading.  
- **Acceptance Criteria:**  
  - Pages refresh automatically after guest/vendor changes.  
  - No noticeable performance lag (>2s delay avoided).  

---

 ## 3. ⌛ Sprint Timeline
- Below are snapshots of our Trello board as we progress through the entire sprint. The trello board can be accessed via this [Link](https://trello.com/invite/b/688926a06672f847b26eadd8/ATTI44809ab9733ae3526b4a7133a7e97f41E5E6470D/codexa)


---
