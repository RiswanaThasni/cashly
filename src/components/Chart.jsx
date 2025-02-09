import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("User not authenticated");

        const response = await axios.get("http://192.168.232.41:8000/api/auth/expense-summary/", {
          headers: { Authorization: `Bearer ${token}` }, // Fix the authorization header
        });

        const { total_expense, total_income } = response.data;

        setChartData({
          labels: ["Total Expense", "Total Income"],
          datasets: [
            {
              data: [total_expense, total_income],
              backgroundColor: ["#FF6384", "#36A2EB"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB"],
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '300px', maxHeight: '300px', margin: 'auto' }}>
      {/* Apply max-width and max-height to limit the chart's overall size */}
      <Pie
        data={chartData}
        width={250}  // Adjust width of the pie chart
        height={250} // Adjust height of the pie chart
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.label + ": ₹" + tooltipItem.raw;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Chart;
