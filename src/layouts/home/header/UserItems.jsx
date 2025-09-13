import React, { useState, useEffect } from "react";
import { Box, Menu, MenuItem, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UserModal from "./UserModal";
// import WishlistDropdown from "./WishlistDropdown";
// import CartDropdown from "./CartDropdown";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "authState_v1";

const UserItems = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialTabIndex, setInitialTabIndex] = useState(0);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleMenuItemClick = (tabIndex) => {
    setInitialTabIndex(tabIndex);
    setModalOpen(true);
    handleMenuClose();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY); // 👈 xóa cache khi logout
    handleMenuClose();
  };

  
useEffect(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const saved = JSON.parse(raw);
    // coi như đã đăng nhập khi có token
    const hasToken = !!saved?.token;
    const name =
      saved?.user?.fullName ||
      saved?.user?.email ||
      saved?.email ||
      "User";

    if (hasToken) {
      setIsLoggedIn(true);
      setUser(name);
    }
  } catch (e) {
    console.warn("Cannot parse saved auth:", e);
  }
}, []);

useEffect(() => {
  const openLogin = () => setModalOpen(true);
  window.addEventListener("OPEN_LOGIN_MODAL", openLogin);
  return () => window.removeEventListener("OPEN_LOGIN_MODAL", openLogin);
}, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 2,
      }}
    >
      <SearchIcon style={{ cursor: "pointer" }} />

      <IconButton
        onClick={handleMenuOpen}
        aria-controls={Boolean(anchorEl) ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={Boolean(anchorEl) ? "true" : undefined}
      >
        <AccountCircleIcon />
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {isLoggedIn ? (
          <>
            <MenuItem
              disabled
              sx={{ pointerEvents: "none", opacity: 1, fontWeight: "bold" }}
            >
              Hello, {user || user || "User"}!
            </MenuItem>
            <MenuItem onClick={() => navigate("/my-account")}>
              My Account
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleMenuItemClick(0)}>Login</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(1)}>Register</MenuItem>
          </>
        )}
      </Menu>

      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTabIndex={initialTabIndex}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      />

      {/* <WishlistDropdown /> */}
      {/* <CartDropdown /> */}
    </Box>
  );
};

export default UserItems;
