import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppRoute from "./routes/AppRoute";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login state

  return (
    <Router>
      <Routes>
        {/* Public Routes: Show Login & Signup only if not authenticated */}
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
          </>
        ) : (
          // Private Routes: Show Dashboard with Sidebar & Navbar after login
          <Route
            path="*"
            element={
              <div className="flex">
                <Sidebar />
                <div className="flex-1">
                  {/* ✅ Pass setIsAuthenticated to Navbar */}
                  <Navbar setIsAuthenticated={setIsAuthenticated} />
                  <AppRoute />
                </div>
              </div>
            }
          />
        )}
        {/* Redirect all unknown routes to login page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
