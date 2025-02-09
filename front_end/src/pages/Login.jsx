import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../utils/api";  // Import the login API function

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");  // Email state
  const [password, setPassword] = useState("");  // Password state
  const [error, setError] = useState("");  // Error state
  const navigate = useNavigate();  // Navigation hook

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent form submission

    if (email && password) {
      try {
        const response = await loginApi({ email, password });  // Call the login API

        // Check if both access and refresh tokens are returned
        if (response && response.access && response.refresh) {
          // Store tokens in localStorage
          localStorage.setItem("accessToken", response.access);  // Store access token
          localStorage.setItem("refreshToken", response.refresh);  // Store refresh token

          setIsAuthenticated(true);  // Set authentication status
          navigate("/dashboard");  // Redirect to dashboard
        } else {
          setError("Invalid email or password.");  // Show error if tokens are missing
        }
      } catch (err) {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } else {
      setError("Please provide both email and password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 md:p-12 w-full max-w-2xl">
        <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>

        {/* Display error message */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"  // Email field
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Update email state
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  // Update password state
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
          >
            Login
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-6 text-center">
          <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700">Forgot Password?</Link>
        </div>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">Don't have an account?</span>
          <Link to="/signup" className="ml-2 text-sm text-indigo-600 hover:text-indigo-700 font-semibold">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;