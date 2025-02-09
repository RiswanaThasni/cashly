// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { getExpensesApi, setMonthlyBudgetApi } from "../utils/api"; // Import necessary API functions
import ExpenseCard from "../components/ExpenseCard"; // Import Summary Cards component
import Chart from "../components/Chart"; // Import Chart component (Pie chart)

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [budget, setBudget] = useState("");  // Budget input state
  const [month, setMonth] = useState(new Date().getMonth() + 1);  // Default to current month
  const [showModal, setShowModal] = useState(false);  // Modal visibility state

  // Fetch recent expenses when the component mounts
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpensesApi();
        setExpenses(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch expenses");
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Handle budget submission
  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
  
    if (!budget) {
      setError("Please enter a valid budget.");
      return;
    }
  
    const currentMonth = new Date().toISOString().slice(0, 7); // Format YYYY-MM
  
    try {
      await setBudgetApi({ amount: budget, month: currentMonth }); // Fix parameter names
      setShowModal(false);
      setError("");
      setLoading(true);
    } catch (err) {
      setError("Failed to set budget");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Set Monthly Budget Button */}
      <div className="bg-white p-6 shadow rounded-lg text-center mb-6">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded"
          onClick={() => setShowModal(true)}
        >
          Set Monthly Budget
        </button>
      </div>

      {/* Budget, Income & Expenses Cards */}
      <ExpenseCard />

      {/* Expense Usage - Pie Chart */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h2 className="text-lg font-semibold text-center mb-4">Expense Breakdown</h2>
        <Chart /> {/* Embed the Chart component */}
      </div>

      {/* Monthly Budget Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Set Your Monthly Budget</h2>
            <form onSubmit={handleBudgetSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Month</label>
                <input
                  type="number"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="border p-2 w-full"
                  placeholder="Enter Month (1-12)"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Budget</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="border p-2 w-full"
                  placeholder="Enter your budget"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Set Budget
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white py-2 px-4 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
