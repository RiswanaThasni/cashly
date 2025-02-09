import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Transaction from "../pages/Transaction";
import Report from "../pages/Report";
import Profile from "../pages/Profile";
import Login from "../pages/Login";  // Correct import path for Login
import ForgotPassword from "../pages/ForgotPassword";
import AddExpense from "../pages/AddExpense";  // Correct import path for AddExpense
import Signup from "../pages/Signup";
import Notifications from "../pages/Notifications";

const AppRoute = ({ setIsAuthenticated }) => {
  return (
    <Routes>
      <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/transaction" element={<Transaction />} />
      <Route path="/reports" element={<Report />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/add-expense" element={<AddExpense />} />
      <Route  path="/notifications" element={<Notifications/>}/>
    </Routes>
  );
};

export default AppRoute;
