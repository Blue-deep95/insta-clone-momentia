import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice"; // your slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});