import React from "react";
import { useNavigate } from "react-router-dom";

const Error = ({ message }) => {
  const navigate = useNavigate();
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-3xl font-bold text-red-700 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-700 mb-8">
        {message || "You do not have permission to access this page. Please sign in or check your account permissions."}
      </p>
      <button
        className="bg-green-800 text-white px-6 py-2 rounded hover:bg-green-700"
        onClick={() => navigate("/")}
      >
        Go to Landing Page
      </button>
    </section>
  );
};

export default Error;
