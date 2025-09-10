// Component này sẽ chứa logic điều hướng sử dụng useNavigate và useLocation
// và được đặt bên trong BrowserRouter.
// Component này được thiết kế để xử lý logic điều hướng (navigation)
// dựa trên trạng thái xác thực và vai trò người dùng.
// Nó được tạo ra để giải quyết vấn đề không thể sử dụng hook useNavigate và useLocation trực tiếp trong AuthContext
//  (vì useNavigate yêu cầu nằm trong BrowserRouter)
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AuthNavigation = () => {
  const { handleLoginSuccess, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hàm xử lý điều hướng dựa trên vai trò
  const handleRedirect = (role) => {
    if (role === "ROLE_ADMIN") {
      navigate("/admin");
    } else if (role === "ROLE_USER") {
      navigate(location.pathname); // Ở lại trang hiện tại
    }
  };

  // Gắn hàm điều hướng vào handleLoginSuccess
  useEffect(() => {
    // Không cần gọi trực tiếp, chỉ cần đảm bảo handleLoginSuccess nhận được hàm redirect
  }, []);

  // Điều hướng khi logout hoặc hết hạn token
  useEffect(() => {
    if (!userRole && !localStorage.getItem("jwtToken")) {
      navigate("/");
    }
  }, [userRole, navigate]);

  return null; // Component này không render gì cả
};

export default AuthNavigation;