import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutApi } from "../utils/api"; // Import logout API function

const Navbar = ({ setIsAuthenticated }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi(); // Call backend logout API

      // Remove authentication tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setIsAuthenticated(false); // Update authentication state
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">Hello User</div>
      <div className="flex space-x-4">
        <button className="text-gray-700" onClick={() => setShowNotifications(!showNotifications)}>
          <span className="material-icons">notifications</span>
        </button>

        <button className="text-gray-700" onClick={() => setShowProfile(!showProfile)}>
          <span className="material-icons">account_circle</span>
        </button>

        {showProfile && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg">
            <div className="p-2">
              <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-200">
                View Profile
              </Link>
              <button onClick={handleLogout} className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-200">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
