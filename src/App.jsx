import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Frontend/landing"; // ✅ New landing page component
import SignInSignUp from "./Frontend/SignUpSignIn"; // ✅ Auth form toggle component
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "./index.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInSignUp />} />
        <Route path="/signup" element={<SignInSignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
