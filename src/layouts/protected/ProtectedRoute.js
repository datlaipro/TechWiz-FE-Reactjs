import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { isTokenExpired } from "./jwtUtils";

const STORAGE_KEY = "authState_v1";

// Helper: kiểm tra xem chuỗi roles có chứa 1 trong các role yêu cầu không
const hasAnyRole = (rolesStr, required = []) => {
  const set = new Set((rolesStr || "").split(",").map(s => s.trim()));
  return required.some(r => set.has(r));
};

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, setShowLoginModal, userRole, showError } = useAuth();
  const navigate = useNavigate();

  // Lấy token & roles (ưu tiên authState_v1, fallback jwtToken legacy)
  const { token, rolesStr } = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      return {
        token: saved?.token || localStorage.getItem("jwtToken") || null,
        rolesStr: userRole ?? saved?.user?.roles ?? saved?.roles ?? "",
      };
    } catch {
      return { token: localStorage.getItem("jwtToken") || null, rolesStr: userRole ?? "" };
    }
  }, [userRole]);

  // Chưa đăng nhập / token thiếu / token hết hạn → mở modal đăng nhập
  useEffect(() => {
    if (!isAuthenticated || !token || isTokenExpired(token)) {
      if (token && isTokenExpired(token)) {
        showError?.("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }
      setShowLoginModal?.(true);
    }
  }, [isAuthenticated, token, setShowLoginModal, showError]);

  // Yêu cầu ADMIN hoặc ORGANIZER
  useEffect(() => {
    if (
      requireAdmin &&
      isAuthenticated &&
      token &&
      !isTokenExpired(token) &&
      !hasAnyRole(rolesStr, ["ROLE_ADMIN", "ROLE_ORGANIZER"])
    ) {
      showError?.("Bạn cần quyền Admin hoặc Organizer để truy cập trang này!");
      navigate("/");
    }
  }, [requireAdmin, isAuthenticated, token, rolesStr, navigate, showError]);

  // Chặn render nếu không đạt điều kiện
  if (!isAuthenticated || !token || isTokenExpired(token)) return null;
  if (requireAdmin && !hasAnyRole(rolesStr, ["ROLE_ADMIN", "ROLE_ORGANIZER"])) return null;

  return children;
};

export default ProtectedRoute;



