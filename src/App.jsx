import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Frontend/landing"; // ✅ New landing page component
import SignInSignUp from "./Frontend/SignInSignUp"; // ✅ Auth form toggle componentimport { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "./index.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignInSignUp />} />
        <Route path="/signin" element={<SignInSignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
