import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(ShopContext);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
