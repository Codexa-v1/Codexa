# 📦 Third-Party Code Documentation

This project makes use of third-party services to handle **authentication** and **external data integration**. These integrations are critical for security, scalability, and enhancing user experience.

---

## 🔒 Auth0 (Authentication & Authorization)

We are using **Auth0** to manage authentication and authorization across the app. Auth0 provides secure login, token-based authentication, and role-based access control.

### How Auth0 Is Used
- **Frontend (SPA)**  
  - Library: `@auth0/auth0-react`  
  - Handles login/logout, redirects, and token retrieval.  
  - Injects `access_token` for API requests.  

- **Backend (API)**  
  - Validates Auth0-issued **JWT tokens**.  
  - Audience & issuer verification ensures tokens are only accepted from our tenant.  

### Configuration
- **Allowed URLs:**  
  - Configured in Auth0 for callback, logout, and web origins (both `localhost` for dev and Azure production domains).  

- **Environment Variables:**  
  - Frontend:  
    - `VITE_AUTH0_DOMAIN`  
    - `VITE_AUTH0_CLIENT_ID`  
    - `VITE_AUTH0_AUDIENCE`  
    → Injected at build time using **GitHub Secrets**.  

  - Backend:  
    - `AUTH0_DOMAIN`  
    - `AUTH0_AUDIENCE`  
    → Stored securely in **Azure App Service Configuration**.  

### Security Notes
- Secrets are **never committed** to the repo.  
- SPA config (domain, clientId, audience) is safe to expose publicly.  
- API secrets remain on the **server side**.  

📖 Official Docs: [Auth0 React SDK](https://auth0.com/docs/libraries/auth0-react)

---

## 🌤 OpenWeather API (Hourly Forecast 4 Days)

We integrated the **OpenWeather Hourly Forecast (4-day)** API to enhance event planning by showing relevant weather data when scheduling events.

### How OpenWeather Is Used
- **Frontend Integration:**  
  - When creating or viewing events, users can see an hourly weather forecast for the chosen event date.  
  - Forecast data helps users plan better (e.g., outdoor vs indoor events).  

- **Data Fetched:**  
  - Temperature, precipitation, and weather conditions.  
  - 4-day outlook, updated hourly.  

### Benefits
- Improves **user experience** by giving contextual event planning info.  
- Encourages better decisions (e.g., venue choice if rain is forecast).  

📖 Official Docs: [OpenWeather API](https://openweathermap.org/api/hourly-forecast)

---

## 🔗 Inter-Group API Integration

In line with project requirements, our backend was designed to communicate with APIs developed by other student teams. To ensure interoperability, we exchanged API documentation with multiple groups and aimed to achieve cross-team functionality.

### 🤝 Collaborating Teams
We worked with two other groups during the integration phase:
- **Bronze Fury**
- **LSDFTH**

### 🧠 Integration with LSDFTH
Among the two collaborations, only the **LSDFTH** team provided sufficient technical documentation and clarification for successful integration.  
Their API offered **storage functionality**, enabling the uploading and retrieval of **images and PDF files** and generating **downloadable links** so users could share their event media externally.  

Although the API worked as intended, one limitation was identified, it only supported uploading **a single PDF per event**, restricting flexibility for multiple document storage.  
Despite this, the API proved **stable** and was successfully **integrated into our production environment**.
📖 Official Docs: [LSDFTH API documentation](https://sdp-project-zilb.onrender.com/public-resources/api-docs)

### 🚫 Collaboration with Bronze Fury
The **Bronze Fury** group did not provide finalized API endpoints or adequate technical feedback within the required timeframe.  
As a result, their API could not be integrated into our system.  
The main barriers were **communication delays** and **incomplete endpoint documentation**, which prevented successful integration within the sprint schedule.

✅ **Summary:**  
This inter-group collaboration exercise emphasized the importance of clear API documentation, consistent communication, and version control coordination.  
Future cross-team projects would benefit from standardized specifications such as **OpenAPI/Swagger**, earlier testing, and shared staging environments.

---