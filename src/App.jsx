
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LandingPage from "./pages/landing"; // ✅ New landing page component
import Home from "./pages/HomePage"; // ✅ Home page component
import Error from "./pages/Error"; // ✅ Error page component
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "./index.css"


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
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/error" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
