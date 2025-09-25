# 🧪 Testing Documentation: Sprint 3

## 1️⃣ How is testing done automatically?
- **CI/CD Integration:**  
  Tests are configured to run automatically through **GitHub Actions**. Each Pull Request (PR) triggers the workflow, which installs dependencies, runs the Vitest test suite, and reports results back into GitHub.  
- **Coverage Reporting:**  
  Code coverage reports are generated to ensure progress toward the **≥80% coverage goal**. 
  
---

## 2️⃣ How is testing done?

### Tools & Frameworks
- **Vitest + React Testing Library (RTL):**  
  Used for frontend unit and integration tests (UI components, API calls, edge cases).  
- **Supertest + Vitest:**  
  Used for backend Express route testing, simulating HTTP requests.  
- **Mocking:**  
  - `vi.mock` from Vitest for APIs and external dependencies.  
  - Mongoose model methods mocked for route tests.  
- **Assertions:**  
  `expect` API for behavior checks, response validation, and error handling.  

### Methodology
1. **Unit Testing**  
   - Tested individual React components and API helper functions.  
   - Mocked dependencies to isolate logic.  
   - Verified rendering, input handling, and API call correctness.  

2. **Integration Testing**  
   - Tested API integration within components.  
   - Simulated user flows with `fireEvent` (add, edit, delete, cancel actions).  
   - Ensured API mocks update UI as expected.  

3. **Backend Route Testing**  
   - Used **Supertest** to hit Express endpoints.  
   - Mocked DB models to simulate CRUD operations.  
   - Checked response codes, payload structure, and error handling.  

4. **Error Handling**  
   - Simulated failed API calls, invalid inputs, and DB/network errors.  
   - Verified error messages and fallback UI states.  

---

## 3️⃣ What we planned to test
- **Frontend Components**
  - Venue Management (`AddVenuesModal`): Adding venues, integration with APIs, error handling.  
  - Vendor Management (`VendorsModal`, `NewVendorModal`): Rendering, adding/removing vendors, validation, error handling.  
  - Other modals/pages: CRUD flows, filtering/search, conditional rendering.  

- **Backend APIs**
  - Event API: CRUD operations, error handling.  
  - Guest API: CRUD operations, validation, and error handling.  
  - Schedule API: CRUD operations, edge cases.  
  - Vendor API: Vendor creation, update, deletion, availability validation.  
  - Venue API: Venue CRUD operations and error cases.  
  - Event Export API: CSV download flow and error handling.  

- **Backend Routes**
  - Event, Guest, Vendor, Schedule, Venue endpoints.  
  - Express responses for success/failure cases.  
  - Event Export route with download logic.  

- **End-to-End Coverage**
  - RSVP flow (user selects RSVP → backend updates).  
  - File uploads (venue/floorplan).  

---

## 4️⃣ What we don’t plan to test (and why)

### RSVP Page
- **Reason:**  
  - Low business risk, mainly presents backend data.  
  - High maintenance cost, frequent UI changes make tests brittle.  
  - E2E tests already cover the RSVP flow end-to-end.  
  - Testing effort is better spent on critical APIs and reusable UI components.  

### FloorPlanModal
- **Reason:**  
  - Minimal business logic (just a wrapper for file upload).  
  - Core upload logic is already tested in `VenueEditModal` and through E2E tests.  
  - Low ROI, UI-only tests here would be brittle and costly to maintain.  

## 5️⃣ User Feedback and feedback gathering
  - From the Google Form was distributed to peers for user reviews in the last sprint, Results were compiled and analyzed and the following features were added to the web app:
    - Preventing invalid inputs on user input prompts
    - Uploading and downloading documents
    - Weather forecast
    - Automatic refresh
    
---

## ✅ Conclusion
- **Frontend:** Components and user flows tested with Vitest + RTL.  
- **Backend:** APIs and routes tested with Vitest + Supertest.  
- **Coverage Goal:** Aim for ≥80% across frontend + backend.  
- **Documentation:** Testing scope, exclusions, and methodology recorded here and on GitHub.  

