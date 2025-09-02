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

## Why These Services?

- **Auth0:** Simplifies secure authentication without having to build/maintain our own identity management system.  
- **OpenWeather API:** Adds real-world, dynamic data to our app, making it more useful and engaging for end-users.  
