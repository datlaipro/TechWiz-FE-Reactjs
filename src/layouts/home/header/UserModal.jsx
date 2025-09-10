import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Checkbox,
  Typography,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { useAuth } from "../../protected/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
 import WishlistDropdown from "./WishlistDropdown";
 import CartDropdown from "./CartDropdown";


const UserModal = () => {
  const { showLoginModal, setShowLoginModal, handleLoginSuccess } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [tabIndex, setTabIndex] = useState(0);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ fullName: "", email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    if (savedRememberMe) {
      setRememberMe(true);
      setCredentials({
        email: localStorage.getItem("email") || "",
        password: "", // Không lấy password từ localStorage
      });
    } else {
      setCredentials({ email: "", password: "" });
    }
    // Reset registerData khi modal mở
    setRegisterData({ fullName: "", email: "", password: "" });
    setError("");
    setSuccess("");
  }, [showLoginModal]);

  const handleRedirect = (role) => {
    console.log("Redirecting with role:", role); // Debug
    if (role === "ROLE_ADMIN") {
      navigate("/admin");
    } else {
      navigate(location.pathname);
    }
  };

  const handleLogin = async () => {
    if (!credentials.email.trim() || !credentials.password.trim()) {
      setError("Vui lòng điền email và mật khẩu!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:6868/api/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });
      console.log("Login response:", response.data);

      const { token } = response.data;
      if (token) {
        handleLoginSuccess(token, handleRedirect);

        if (rememberMe) {
          localStorage.setItem("email", credentials.email);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("rememberMe");
        }
      } else {
        setError("Không nhận được token từ server!");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      setError("Email hoặc mật khẩu không đúng: " + errorMessage);
    }
  };

  const handleRegister = async () => {
    if (!registerData.email.trim() || !registerData.password.trim()) {
      setError("Vui lòng điền email và mật khẩu!");
      return;
    }

    const userData = {
      fullName: registerData.fullName || null,
      email: registerData.email,
      password: registerData.password,
      phoneNumber: null,
      address: null,
      birthDay: null,
      gender: null,
      avatar: null,
      // Không gửi roles, để backend gán mặc định ROLE_USER
    };

    console.log("Sending register data:", userData); // Debug

    try {
      const response = await axios.post("http://localhost:6868/api/user", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Register response:", response.data);

      // Tự động đăng nhập sau khi đăng ký thành công
      try {
        const loginResponse = await axios.post("http://localhost:6868/api/auth/login", {
          email: registerData.email,
          password: registerData.password,
        });
        console.log("Auto-login response:", loginResponse.data);
        const { token } = loginResponse.data;
        if (token) {
          handleLoginSuccess(token, handleRedirect);
          setSuccess("Đăng ký thành công!");
          setTimeout(() => setShowLoginModal(false), 2000); // Đóng modal sau 2 giây
        } else {
          setError("Đăng ký thành công nhưng không thể đăng nhập: Không nhận được token!");
        }
      } catch (loginError) {
        console.error("Auto-login error:", loginError);
        const loginErrorMessage = loginError.response?.data?.message || loginError.response?.data || loginError.message;
        setError("Đăng ký thành công nhưng lỗi khi đăng nhập: " + loginErrorMessage);
      }
    } catch (error) {
      console.error("Register error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data || error.message;
      setError("Lỗi khi đăng ký: " + errorMessage);
    }
  };

  return (
    <Dialog open={showLoginModal} onClose={() => setShowLoginModal(false)}>
      <DialogContent>
        <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        {tabIndex === 0 && (
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              sx={{ mb: 2 }}
            />
            {error && (
              <Typography color="error" mt={1}>
                {error}
              </Typography>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              }
              label="Remember me"
              sx={{ mt: 1 }}
            />
            <Button variant="contained" fullWidth onClick={handleLogin} sx={{ mt: 2 }}>
              Login
            </Button>
          </Box>
        )}
        {tabIndex === 1 && (
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Họ và tên"
              margin="normal"
              value={registerData.fullName}
              onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              margin="normal"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              sx={{ mb: 2 }}
            />
            {error && (
              <Typography color="error" mt={1}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success.main" mt={1}>
                {success}
              </Typography>
            )}
            <Button variant="contained" fullWidth onClick={handleRegister} sx={{ mt: 2 }}>
              Visit Now
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;

