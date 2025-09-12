// Context được sử dụng để quản lý trạng thái xác thực (authentication state)
import React, { createContext, useState, useCallback } from "react";
import { getRolesFromToken, getEmailFromToken, isTokenExpired } from "./jwtUtils";

export const AuthContext = createContext();

const STORAGE_KEY = "authState_v1";

// Helpers đọc dữ liệu đã lưu
function readSavedAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function getSavedToken(saved) {
  return saved?.token || null;
}
function getSavedEmail(saved) {
  return saved?.user?.email || saved?.email || null;
}
function getSavedRoles(saved) {
  return saved?.user?.roles || saved?.roles || null;
}

export const AuthProvider = ({ children }) => {
  // ===== Khởi tạo từ localStorage (ưu tiên authState_v1, fallback jwtToken) =====
  const initFromStorage = () => {
    const saved = readSavedAuth();
    let token = getSavedToken(saved) || localStorage.getItem("jwtToken"); // legacy fallback
    if (token && isTokenExpired(token)) {
      // token hết hạn → xoá
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
      token = null;
    }
    const email =
      getSavedEmail(saved) ||
      (token ? getEmailFromToken(token) : null);

    // roles: ưu tiên từ saved, nếu không có thì decode từ token
    let roles =
      getSavedRoles(saved) ||
      (token ? getRolesFromToken(token) : null);

    return {
      token,
      email,
      roles, // có thể là "ROLE_USER,ROLE_ADMIN"
      isAuthed: Boolean(token),
    };
  };

  const { token: initToken, email: initEmail, roles: initRoles, isAuthed } =
    initFromStorage();

  const [isAuthenticated, setIsAuthenticated] = useState(isAuthed);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userRole, setUserRole] = useState(initRoles); // giữ dạng string "ROLE_USER,ROLE_ADMIN"
  const [userEmail, setUserEmail] = useState(initEmail);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // ===== Actions =====
  const handleLoginSuccess = useCallback((token, onRedirect) => {
    if (!token) return;

    // Decode từ token
    const rolesStr = getRolesFromToken(token) || "";
    const email = getEmailFromToken(token) || getSavedEmail(readSavedAuth()) || null;

    // Lưu đúng cấu trúc vào authState_v1
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token,
        user: { email, roles: rolesStr },
        isLoggedIn: true,
        savedAt: Date.now(),
      })
    );

    // (tuỳ) giữ lại legacy key nếu app khác đang dùng
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("isAuthenticated", "true");

    // Cập nhật state
    setIsAuthenticated(true);
    setShowLoginModal(false);
    setUserRole(rolesStr);
    setUserEmail(email);

    // Điều hướng theo role (truyền đúng rolesString để component nhận biết)
    if (onRedirect) onRedirect(rolesStr);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setShowLoginModal(false);
    setUserRole(null);
    setUserEmail(null);

    // Dọn dẹp cả key mới lẫn legacy
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("STORAGE_KEY"); // nếu lỡ lưu nhầm key trước đó
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("rememberMe");
  }, []);

  const showError = useCallback((message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        showLoginModal,
        setShowLoginModal,
        userRole,   // ví dụ: "ROLE_USER,ROLE_ORGANIZER"
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
