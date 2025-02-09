// src/pages/AddExpense.jsx
import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import api, { getExpensesApi, addExpenseApi } from "../utils/api";  // Import the getExpensesApi function

const AddExpense = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
  });
  const [error, setError] = useState("");

  // Fetch existing expenses from the backend when the component mounts
  useEffect(() => {
    getExpensesApi()
      .then((response) => {
        console.log("Fetched expenses:", response);  // Log the entire response to see if data is being returned
        setExpenses(response.data);  // Store fetched expenses in state
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);  // Log the full error for debugging
        setError("Failed to load expenses.");
      });
  }, []);
  
  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!newExpense.description || !newExpense.amount) {
      setError("Please fill in all fields.");
      return;
    }

    const expenseData = {
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
    };

    try {
      const addedExpense = await addExpenseApi(expenseData);
      setExpenses((prevExpenses) => [...prevExpenses, addedExpense]);
      setNewExpense({ description: "", amount: "" });
      setError("");
    } catch (error) {
      console.error("Error adding expense:", error);
      setError(error.message);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">Add Expense</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-semibold">Expense List</h2>
        <table className="w-full mt-2">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((tx) => (
              <tr key={tx.date + tx.description} className="border-b">
                <td className="p-2">{tx.date}</td>
                <td className="p-2">{tx.description}</td>
                <td className="p-2">₹{tx.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleAddExpense} className="bg-white p-4 shadow rounded-lg flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <TextField
          label="Description"
          variant="outlined"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          required
        />
        <TextField
          label="Amount"
          type="number"
          variant="outlined"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Add Expense
        </Button>
      </form>
    </div>
  );
};

export default AddExpense;
