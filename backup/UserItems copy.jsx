  // CHƯA LƯU TRẠNG THÁI ĐĂNG NHẬP VÀO localStorage hoặc context

import React, { useState } from "react";
import { Box, Menu, MenuItem, IconButton, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UserModal from "../src/layouts/home/header/UserModal";
import WishlistDropdown from "../src/layouts/home/header/WishlistDropdown";
import CartDropdown from "../src/layouts/home/header/CartDropdown";

const UserItems = () => {
  // Giả lập trạng thái đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ username: "john_doe", password: "123456" }); // Dữ liệu user giả định
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialTabIndex, setInitialTabIndex] = useState(0);

  // CHƯA LƯU TRẠNG THÁI ĐĂNG NHẬP VÀO localStorage hoặc context

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
      <IconButton onClick={handleMenuOpen}>
        <AccountCircleIcon style={{ cursor: "pointer" }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {!isLoggedIn ? (
          <>
            <MenuItem onClick={() => handleMenuItemClick(0)}>Login</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(1)}>Register</MenuItem>
          </>
        ) : (
          <>
            <Typography sx={{ px: 2, py: 1, fontWeight: "bold" }}>Hello, {user.username}!</Typography>
            <MenuItem onClick={() => console.log("Navigate to My Account")}>My Account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </>
        )}
      </Menu>

      {/* User Modal */}
      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTabIndex={initialTabIndex}
        setIsLoggedIn={setIsLoggedIn} // Truyền hàm đăng nhập
        setUser={setUser} // Cập nhật user sau khi đăng nhập
      />

      {/* Wishlist Dropdown */}
      <WishlistDropdown />

      {/* Cart Dropdown */}
      <CartDropdown />
    </Box>
  );
};

export default UserItems;
