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



// import React, { useEffect, useMemo } from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuth } from "./AuthContext";
// import { isTokenExpired } from "./jwtUtils";

// const STORAGE_KEY = "authState_v1";
// const hasAnyRole = (rolesStr, required = []) => {
//   const set = new Set(String(rolesStr || "").split(",").map(s => s.trim()));
//   return required.some(r => set.has(r));
// };

// export default function ProtectedRoute({ requireAdmin = false }) {
//   const { isAuthenticated, setShowLoginModal, userRole, showError } = useAuth();
//   const location = useLocation();

//   const { token, rolesStr } = useMemo(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       const saved = raw ? JSON.parse(raw) : null;
//       return {
//         token: saved?.accessToken || saved?.token || localStorage.getItem("jwtToken") || null,
//         rolesStr: userRole ?? saved?.user?.roles ?? saved?.roles ?? "",
//       };
//     } catch {
//       return { token: localStorage.getItem("jwtToken") || null, rolesStr: userRole ?? "" };
//     }
//   }, [userRole]);

//   const authed = Boolean(isAuthenticated && token && !isTokenExpired(token));
//   const roleOk = !requireAdmin || hasAnyRole(rolesStr, ["ROLE_ADMIN", "ROLE_ORGANIZER"]);

//   // Gợi ý mở modal login khi chưa hợp lệ
//   useEffect(() => {
//     if (!authed) {
//       if (token && isTokenExpired(token)) {
//         showError?.("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
//       }
//       setShowLoginModal?.(true);
//     }
//   }, [authed, token, showError, setShowLoginModal]);

//   if (!authed) {
//     return <Navigate to="/my-account" replace state={{ from: location }} />;
//   }
//   if (!roleOk) {
//     showError?.("Bạn cần quyền Admin hoặc Organizer để truy cập trang này!");
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />; // 👈 layout route: render các route con bên trong
// }
