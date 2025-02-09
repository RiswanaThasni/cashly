import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./expenseSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    expense: expenseReducer,
    user: userReducer,
  },
});
