import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LandingPage from "@/pages/LandingPage"; // ✅ New landing page component
import Home from "@/pages/HomePage"; // ✅ Home page component
import Error from "@/pages/ErrorPage"; // ✅ Error page component
import About from "@/pages/AboutPage"; // ✅ About page component
import EventsPage from "@/pages/EventsPage"; // ✅ Events page component
import EventDetails from "@/pages/EventDetails"; // ✅ Event details page
import '@/App.css'
import "@/index.css"


function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  if (isLoading) return null; // Optionally show a loading spinner
  return isAuthenticated ? children : <Navigate to="/error" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* Protected Routes */}
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />

        <Route path="/events" element={
          <PrivateRoute>
            <EventsPage />
          </PrivateRoute>
        } />
        <Route path="/events/:id" element={
          <PrivateRoute>
            <EventDetails />
          </PrivateRoute>
        } />

        {/* Public Routes */}
        <Route path="/error" element={<Error />} />
        <Route path="/about" element={<About />} />
        
      </Routes>
    </Router>
  );
}

export default App;