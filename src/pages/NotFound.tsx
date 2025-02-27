
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <main className="app-content flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-app-primary mb-4">404</h1>
          <p className="text-xl mb-8">Page not found</p>
          <button
            onClick={() => navigate("/")}
            className="btn-primary max-w-xs"
          >
            Go Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
