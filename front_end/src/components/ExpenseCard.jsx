import React, { useState, useEffect } from "react";
import { getDashboardSummaryApi } from "../utils/api";  // Import the API method

const ExpenseCard = () => {
  const [summary, setSummary] = useState({
    total_budget: 0,
    total_income: 0,
    total_expense: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch summary from backend
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getDashboardSummaryApi();
        setSummary(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch summary");
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-6 shadow rounded-lg text-center">
        <h2 className="text-lg font-semibold">Total Budget</h2>
        <p className="text-xl font-bold">{summary.total_budget} ₹</p>
      </div>
      <div className="bg-white p-6 shadow rounded-lg text-center">
        <h2 className="text-lg font-semibold">Total Income</h2>
        <p className="text-xl font-bold">{summary.total_income} ₹</p>
      </div>
      <div className="bg-white p-6 shadow rounded-lg text-center">
        <h2 className="text-lg font-semibold">Total Expense</h2>
        <p className="text-xl font-bold">{summary.total_expense} ₹</p>
      </div>
    </div>
  );
};

export default ExpenseCard;
