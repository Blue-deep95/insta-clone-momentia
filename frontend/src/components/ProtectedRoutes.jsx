import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoutes({ children}) {

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);

  // If user not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }


  return children;
}

// Unauthorized Page
export const Unauthorized = () => {
  return (
    <h2 className="text-danger mt-5 text-center">
      You are not authorized to access this page
    </h2>
  );
};