
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { useAuth } from '../../layouts/protected/AuthContext';

function AdminAppBar({ drawerOpen, drawerWidth, handleDrawerToggle }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMyAccount = () => {
    navigate('/admin/user');
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    handleLogout();
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: { xs: theme.zIndex.drawer - 1, md: theme.zIndex.drawer - 1 },
        width: { md: `calc(100% - ${drawerOpen ? drawerWidth : 0}px)` },
        ml: { md: drawerOpen ? `${drawerWidth}px` : 0 },
        transition: 'width 0.2s ease, margin 0.2s ease',
        backgroundColor: '#e9eced', // Xanh sáng
        color: '#3e5b61', // Xanh xám yoois
        // mb: 5, // Thêm khoảng cách 15px (2 * 8px = 16px)
        boxShadow: '1px 1px 3px rgba(19, 37, 39, 0.34)', // Bóng đổ tối thiểu
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 , display: { md: 'none' }, '&:hover': { bgcolor: '#2E7D32' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                ml: { xs: 0, md: '50px' },
                display: { xs: 'none', md: 'block' },
                transition: 'width 0.2s ease, margin 0.2s ease',
              }}
            >
              ADMIN
            </Typography>
          </Box>
          <IconButton
            color="inherit"
            aria-label="account menu"
            onClick={handleMenuOpen}
            sx={{ '&:hover': { bgcolor: '#7d9499' }, mr: 4 }}
          >
            <AccountCircleIcon />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          sx={{
            '& .MuiPaper-root': {
              mt:5,
              backgroundColor: '#e9eced', // Khớp với AppBar
              color: '#3e5b61',
              border: '1px solid #e9eced',
            },
          }}
        >
          <MenuItem
            onClick={handleMyAccount}
            sx={{ '&:hover': { bgcolor: '#7d9499' } }}
          >
            My Account
          </MenuItem>
          <MenuItem
            onClick={handleLogoutClick}
            sx={{ '&:hover': { bgcolor: '#7d9499' } }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

AdminAppBar.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  drawerWidth: PropTypes.number.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default AdminAppBar;