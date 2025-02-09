import React from "react";
import { Link, useLocation } from "react-router-dom";  // Added useLocation for active state

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Cashly</h1>
      <div className="space-y-4">
        <Link
          to="/dashboard"
          className={`flex items-center space-x-4 p-2 rounded-lg ${location.pathname === "/dashboard" ? "bg-gray-700" : "hover:bg-gray-700"}`}
        >
          <span className="material-icons">home</span>
          <span>Home</span>
        </Link>
        <Link
          to="/add-expense"
          className={`flex items-center space-x-4 p-2 rounded-lg ${location.pathname === "/add-expense" ? "bg-gray-700" : "hover:bg-gray-700"}`}
        >
          <span className="material-icons">add_circle</span>
          <span>Add Expense</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
