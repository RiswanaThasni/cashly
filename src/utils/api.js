import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.232.41:8000',  // Use the backend's IP address
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example login function
export const loginApi = async (data) => {
  try {
    const response = await api.post('/api/auth/login/',data); // Send data to the backend
    return response.data;  // Return the response (token, user info, etc.)
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Something went wrong');
  }
};


export const signupApi = async (userData) => {
  try {
    const response = await api.post("/api/auth/register/", userData);  // Send user data to the backend

    return response.data;  // Return the response (e.g., token, user info, etc.)
  } catch (error) {
    throw new Error(error.response?.data?.message || "Signup failed");  // Handle error properly
  }
};


// export const addExpenseApi = async (expenseData) => {
//   try {
//     const response = await api.post("/api/auth/expenses/add/", expenseData);
//     return response.data; // Expected to return the newly created expense object
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Failed to add expense");
//   }
// };
export const addExpenseApi = async (expenseData) => {
  try {
    const token = localStorage.getItem("accessToken");  // Get token from localStorage

    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await api.post(
      "/api/auth/expenses/add/",  // Endpoint to add expense
      expenseData,  // The expense data object
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Attach the token to the Authorization header
        },
      }
    );

    return response.data; // Expected to return the newly created expense object
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add expense");
  }
};

export const getExpensesApi = () => {
  const token = localStorage.getItem("accessToken");  // Retrieve the token from localStorage

  if (!token) {
    throw new Error("No authentication token found.");
  }

  return api.get('/api/auth/expenses/view/', {
    headers: {
      Authorization: `Bearer ${token}`,  // Send token in Authorization header
    },
  });
};

// api.js
export const getExpensesApii = async () => {
  try {
    const token = localStorage.getItem("accessToken");  // Retrieve the token from localStorage

    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await api.get('/api/auth/expenses/view/', {
      headers: {
        Authorization: `Bearer ${token}`,  // Send token in Authorization header
      },
    });

    return response.data;  // Return the expenses data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch expenses");
  }
};


// export const fetchProfileApi = async () => {
//   try {
//     const token = localStorage.getItem("token");  // Get token from localStorage

//     if (!token) {
//       throw new Error("No token found");
//     }

//     const response = await api.get("/api/auth/profile/", {
//       headers: {
//         Authorization: `Bearer ${token}`,  // Attach token to Authorization header
//       },
//     });
    
//     return response.data;  // Return profile data
//   } catch (error) {
//     throw new Error(error.response?.data?.message || "Failed to fetch profile");
//   }
// };
export const fetchProfileApi = async () => {
  try {
    const token = localStorage.getItem("accessToken");  // Use the correct token name if it's `accessToken`
    
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await api.get("/api/auth/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,  // Attach token to Authorization header
      },
    });

    return response.data;  // Return profile data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
};




export const logoutApi = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");  // Get stored access token
    const refreshToken = localStorage.getItem("refreshToken"); // Get stored refresh token

    if (!accessToken || !refreshToken) {
      throw new Error("Authentication tokens are missing.");
    }

    // Send both access token and refresh token to the backend
    const response = await api.post("/api/auth/logout/", { refresh: refreshToken }, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Send access token in headers
      },
    });

    return response.data; // Successful logout response
  } catch (error) {
    throw new Error(error.response?.data?.message || "Logout failed.");
  }
};


// api.js
export const getDashboardSummaryApi = async () => {
  try {
    const token = localStorage.getItem("accessToken");  // Retrieve the token from localStorage
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await api.get('/api/auth/dashboard-summary/', {
      headers: {
        Authorization: `Bearer ${token}`,  // Attach the token to Authorization header
      },
    });

    return response.data;  // Return the summary data
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch dashboard summary");
  }
};


// Fetch Expense Summary API (For Pie Chart in Dashboard)
export const getExpenseSummaryApi = async () => {
  try {
    const response = await api.get("/api/auth/expense-summary/", { headers: getAuthHeaders() });
    return response.data; // Should return { total_expense, total_income }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch expense summary");
  }
};


// api.js
// api.js
// api.js
export const setMonthlyBudgetApi = async (data) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("No authentication token found.");
    }

    const response = await api.post("/api/auth/set-monthly-budget/", data, {
      headers: {
        Authorization: `Bearer ${token}`,  // Attach token to Authorization header
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to set budget");
  }
};



export default api;