import React, { useState } from "react";
import {
  Modal,
  Box,
  Tab,
  Tabs,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const UserModal = ({ open, onClose, initialTabIndex = 0, onLoginSuccess  }) => {
  const [tabIndex, setTabIndex] = useState(initialTabIndex || 0);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleTabChange = (event, newValue) => setTabIndex(newValue);

  const handleLogin = () => {
    if (credentials.username === "admin" && credentials.password === "123456") {
      setIsAuthenticated(true);
      onClose(); // Đóng modal sau khi đăng nhập
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Tabs value={tabIndex} onChange={handleTabChange} centered variant="fullWidth">
          <Tab label="Sign In" />
          <Tab label="Register" />
        </Tabs>

        {/* Sign In */}
        {tabIndex === 0 && (
          <Box>
            <Typography variant="h6" mb={2}>Sign In</Typography>
            <TextField
              label="Username"
              fullWidth
              variant="outlined"
              margin="normal"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            {error && <Typography color="error" mt={1}>{error}</Typography>}
            <FormControlLabel control={<Checkbox />} label="Remember me" sx={{ mt: 1 }} />
            <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
              Login
            </Button>
          </Box>
        )}

        {/* Register */}
        {tabIndex === 1 && (
          <Box>
            <Typography variant="h6" mb={2}>Register</Typography>
            <TextField label="Email address" fullWidth variant="outlined" margin="normal" />
            <TextField label="Password" type="password" fullWidth variant="outlined" margin="normal" />
            <FormControlLabel control={<Checkbox />} label="I agree to the Privacy Policy" sx={{ mt: 1 }} />
            <Button variant="contained" fullWidth sx={{ mt: 2 }}>Register</Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default UserModal;
