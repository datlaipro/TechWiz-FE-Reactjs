import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { isTokenExpired } from "./jwtUtils";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, setShowLoginModal, userRole, showError } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  if (!isAuthenticated || !token || isTokenExpired(token)) {
    setShowLoginModal(true);
    return null;
  }

  if (requireAdmin && userRole !== "ROLE_ADMIN") {
    showError("Bạn cần quyền admin để truy cập trang này!");
    navigate("/");
    return null;
  }

  return children;
};

export default ProtectedRoute;