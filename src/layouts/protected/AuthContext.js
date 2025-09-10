// Context được sử dụng để quản lý trạng thái xác thực (authentication state)
import React, { createContext, useState, useCallback } from "react";
import { getRolesFromToken, getEmailFromToken, isTokenExpired } from "./jwtUtils";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("jwtToken");
    return token && !isTokenExpired(token);
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userRole, setUserRole] = useState(() => {
    const token = localStorage.getItem("jwtToken");
    return token ? getRolesFromToken(token) : null;
  });
  const [userEmail, setUserEmail] = useState(() => {
    const token = localStorage.getItem("jwtToken");
    return token ? getEmailFromToken(token) : null;
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleLoginSuccess = useCallback((token, onRedirect) => {
    console.log("handleLoginSuccess called with token:", token);
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
    setShowLoginModal(false);

    const role = getRolesFromToken(token);
    const email = getEmailFromToken(token);
    setUserRole(role);
    setUserEmail(email);

    if (onRedirect) {
      onRedirect(role);
    }
  }, []);

  const handleLogout = useCallback(() => {
    console.log("handleLogout called");
    setIsAuthenticated(false);
    setShowLoginModal(false);
    setUserRole(null);
    setUserEmail(null);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("rememberMe");
  }, []);

  const showError = useCallback((message, severity = "error") => {
    console.log("showError called with message:", message);
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar({ ...snackbar, open: false });
  }, [snackbar]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        showLoginModal,
        setShowLoginModal,
        userRole,
        userEmail,
        handleLoginSuccess,
        handleLogout,
        showError,
        snackbar,
        closeSnackbar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);