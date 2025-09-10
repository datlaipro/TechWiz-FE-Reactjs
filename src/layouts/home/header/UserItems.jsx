import React, { useState } from "react";
import { Box, Menu, MenuItem, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UserModal from "./UserModal";
import WishlistDropdown from "./WishlistDropdown";
import CartDropdown from "./CartDropdown";

const UserItems = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ username: "john_doe", password: "123456" });
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
    handleMenuClose();
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
      {/* Search Icon */}
      <SearchIcon style={{ cursor: "pointer" }} />

      {/* User Menu */}
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
          [
            <MenuItem
              key="hello"
              disabled
              sx={{ pointerEvents: "none", opacity: 1, fontWeight: "bold" }}
            >
              Hello, {user?.username || "User"}!
            </MenuItem>,
            <MenuItem key="account" onClick={() => console.log("Navigate to My Account")}>
              My Account
            </MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>
              Logout
            </MenuItem>,
          ]
        ) : (
          [
            <MenuItem key="login" onClick={() => handleMenuItemClick(0)}>
              Login
            </MenuItem>,
            <MenuItem key="register" onClick={() => handleMenuItemClick(1)}>
              Register
            </MenuItem>,
          ]
        )}
      </Menu>

      {/* User Modal */}
      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTabIndex={initialTabIndex}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      />

      {/* Wishlist & Cart */}
      <WishlistDropdown />
      <CartDropdown />
    </Box>
  );
};

export default UserItems;
