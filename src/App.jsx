import React from "react";
import HomePage from "./Pages/HomePage";
import "./index.css";
import { Route, Routes } from "react-router";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
};

export default App;
