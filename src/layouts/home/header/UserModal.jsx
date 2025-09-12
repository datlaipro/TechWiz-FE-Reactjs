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
const STORAGE_KEY = "authState_v1"; // 👈 dùng chung toàn app

const UserModal = ({
  initialTabIndex = 0,
  open,
  onClose,
  setIsLoggedIn,
  setUser,
}) => {
  const { handleLoginSuccess } = useAuth(); // ❗ chỉ dùng callback từ context
  const navigate = useNavigate();
  const location = useLocation();

  const [tabIndex, setTabIndex] = useState(initialTabIndex);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mỗi lần modal mở, đồng bộ tab & reset form
  useEffect(() => {
    if (!open) return;
    setTabIndex(initialTabIndex ?? 0);

    const savedRememberMe = localStorage.getItem("rememberMe") === "true";
    if (savedRememberMe) {
      setRememberMe(true);
      setCredentials({
        email: localStorage.getItem("email") || "",
        password: "",
      });
    } else {
      setRememberMe(false);
      setCredentials({ email: "", password: "" });
    }

    setRegisterData({ fullName: "", email: "", password: "" });
    setError("");
    setSuccess("");
  }, [open, initialTabIndex]);

  // Clear message khi đổi tab
  const handleTabChange = (_e, newIndex) => {
    setTabIndex(newIndex);
    setError("");
    setSuccess("");
  };

  const handleRedirect = (role) => {
    if (role === "ROLE_ADMIN" || role === "ROLE_ORGANIZER") {
      navigate("/admin");
    } else {
      // Ở user, thường chỉ cần đóng modal là đủ để UI cập nhật theo state đăng nhập
      // Nếu muốn reload trang hiện tại: navigate(0)
      // Ở đây mình chỉ đóng modal:
      // no-op
      setIsLoggedIn(true);
    }
  };

  const normErr = (e) => {
    const msg =
      e?.response?.data?.message ??
      e?.response?.data ??
      e?.message ??
      "Unknown error";
    return typeof msg === "string" ? msg : JSON.stringify(msg);
  };

  const handleLogin = async () => {
    if (!credentials.email.trim() || !credentials.password.trim()) {
      setError("Vui lòng điền email và mật khẩu!");
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:6868/api/auth/login",
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      const { token, roles, exp } = data || {};

      if (!token) {
        setError("Không nhận được token từ server!");
        return;
      }

      // Context sẽ lưu token và gọi lại handleRedirect(role)
      await handleLoginSuccess(token, handleRedirect);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          token,
          user: { email: credentials.email, roles },
          isLoggedIn: true,
          exp,
          savedAt: Date.now(),
        })
      );
      if (rememberMe) {
        localStorage.setItem("email", credentials.email);
        localStorage.setItem("rememberMe", "true");
        setIsLoggedIn?.(true);
        setUser?.(credentials.email);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("rememberMe");
      }

      // Đóng modal do props điều khiển
      onClose?.();
    } catch (e) {
      setError("Email hoặc mật khẩu không đúng: " + normErr(e));
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
    };

    try {
      await axios.post("http://localhost:6868/api/user/register", userData, {

        headers: { "Content-Type": "application/json" },
      });

      // Auto-login
      try {
        const { data } = await axios.post(
          "http://localhost:6868/api/auth/login",
          {
            email: registerData.email,
            password: registerData.password,
          }
        );
        const { token } = data || {};
        if (!token) {
          setError("Đăng ký thành công nhưng không nhận được token!");
          return;
        }

        await handleLoginSuccess(token, handleRedirect);
        setSuccess("Đăng ký & đăng nhập thành công!");
        onClose?.(); // đóng ngay sau khi thành công
      } catch (le) {
        setError("Đăng ký thành công nhưng lỗi khi đăng nhập: " + normErr(le));
      }
    } catch (e) {
      setError("Lỗi khi đăng ký: " + normErr(e));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
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
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              sx={{ mb: 2 }}
            />

            {!!error && (
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

            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              sx={{ mt: 2 }}
            >
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
              onChange={(e) =>
                setRegisterData({ ...registerData, fullName: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              margin="normal"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              sx={{ mb: 2 }}
            />

            {!!error && (
              <Typography color="error" mt={1}>
                {error}
              </Typography>
            )}
            {!!success && (
              <Typography color="success.main" mt={1}>
                {success}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleRegister}
              sx={{ mt: 2 }}
            >
              Register
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
