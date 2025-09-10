import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import AdminAppBar from './AdminAppBar';
import Slide from '@mui/material/Slide';

const drawerWidth = 240;

function LayoutAdmin() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < theme.breakpoints.values.md);

  // Theo dõi resize để điều chỉnh drawer
  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth < theme.breakpoints.values.md;
      setIsMobile(isCurrentlyMobile);
      if (isCurrentlyMobile) {
        setDrawerOpen(false);
        setMobileOpen(false);
      } else {
        setDrawerOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme.breakpoints.values.md]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const icons = [
    <DashboardOutlinedIcon />,
    <Inventory2OutlinedIcon />,
    <WarehouseOutlinedIcon />,
    <ShoppingCartOutlinedIcon />,
    <PersonOutlineOutlinedIcon />,
  ];

  const icons2 = [
    <LocalShippingOutlinedIcon />,
    <CampaignOutlinedIcon />,
    <StarOutlineOutlinedIcon />,
  ];

  // Menu cho Drawer tạm thời (mobile, 3 cột)
  const mobileMenu = (
    <Grid container spacing={2} sx={{ p: 2, bgcolor: '#263238' }}>
      {['Dashboard', 'Products', 'Ware House', 'Order', 'User', 'Supplier', 'Maketing', 'Review'].map((text, index) => {
        const paths = [
          '/admin',
          '/admin/product',
          '/admin/import-products',
          '/admin/order',
          '/admin/user',
          '/admin/supplier',
          '/admin/discount',
          '/admin/review',
        ];
        const allIcons = [...icons, ...icons2];
        return (
          <Grid item xs={4} key={text}>
            <Paper
              sx={{
                p: 1,
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                bgcolor: '#37474F',
                '&:hover': {
                  bgcolor: '#546E7A',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease',
                },
              }}
            >
              <ListItemButton
                component={Link}
                to={paths[index]}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: '#CFD8DC',
                }}
              >
                <ListItemIcon sx={{ color: '#CFD8DC', mb: 1 }}>
                  {allIcons[index % allIcons.length]}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ color: '#CFD8DC' }} />
              </ListItemButton>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );

  // Menu cho Drawer cố định (desktop, danh sách dọc)
  const desktopMenu = (
    <>
      <List>
        {['Dashboard', 'Products', 'Ware House', 'Order', 'User'].map((text, index) => {
          const paths = ['/admin', '/admin/product', '/admin/import-products', '/admin/order', '/admin/user'];
          return (
            <ListItem key={text} disablePadding>
              <Tooltip
                title={drawerOpen ? '' : text}
                placement="right"
                arrow
                sx={{
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: '#455A64',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                  },
                }}
              >
                <ListItemButton
                  component={Link}
                  to={paths[index]}
                  sx={{
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': {
                      bgcolor: '#37474F',
                      color: '#F5F5F5',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      color: '#CFD8DC',
                      '&:hover': {
                        color: '#F5F5F5',
                      },
                    }}
                  >
                    {icons[index % icons.length]}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={{
                      opacity: drawerOpen ? 1 : 0,
                      color: '#CFD8DC',
                      '&:hover': {
                        color: '#F5F5F5',
                      },
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
      <Divider sx={{ bgcolor: '#37474F' }} />
      <List>
        {['Supplier', 'Maketing', 'Review'].map((text, index) => {
          const paths2 = ['/admin/supplier', '/admin/discount', '/admin/review'];
          return (
            <ListItem key={text} disablePadding>
              <Tooltip
                title={drawerOpen ? '' : text}
                placement="right"
                arrow
                sx={{
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: '#455A64',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                  },
                }}
              >
                <ListItemButton
                  component={Link}
                  to={paths2[index]}
                  sx={{
                    justifyContent: drawerOpen ? 'initial' : 'center',
                    px: 2.5,
                    '&:hover': {
                      bgcolor: '#37474F',
                      color: '#F5F5F5',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: drawerOpen ? 3 : 'auto',
                      justifyContent: 'center',
                      color: '#CFD8DC',
                      '&:hover': {
                        color: '#F5F5F5',
                      },
                    }}
                  >
                    {icons2[index % icons2.length]}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={{
                      opacity: drawerOpen ? 1 : 0,
                      color: '#CFD8DC',
                      '&:hover': {
                        color: '#F5F5F5',
                      },
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  const drawer = (
    <div style={{ backgroundColor: '#263238', height: isMobile ? 'auto' : '100vh', overflow: 'auto' }}>
      <Toolbar
        sx={{
          display: "flex", // Kích hoạt Flexbox
          justifyContent: "center", // Căn giữa theo chiều ngang
          alignItems: "center", // Căn giữa theo chiều dọc
        }}
      >
        <IconButton
          color="inherit"
          aria-label={drawerOpen ? 'close drawer' : 'open drawer'}
          edge="start"
          onClick={drawerOpen ? handleDrawerClose : handleDrawerOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            color: '#CFD8DC',
            '&:hover': { bgcolor: '#37474F' },
          }}
        >
          {drawerOpen ? (
            <img src="/demo/images/main-logo1.png" alt="SHOP" style={{ width: '120px', height: 'auto' }} />
          ) : (
            <MenuIcon />
          )}
        </IconButton>
        <Typography sx={{ display: { xs: 'block', md: drawerOpen ? 'none' : 'none' }, color: '#CFD8DC' }}>
          BOOK SHOP
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: '#37474F' }} />
      {isMobile ? mobileMenu : desktopMenu}
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AdminAppBar
        drawerOpen={drawerOpen}
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="nav"
        sx={{
          width: { md: drawerOpen ? drawerWidth : `calc(${theme.spacing(7)} + 1px)` },
          flexShrink: { md: 0 },
          transition: 'width 0.2s ease',
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          anchor="top"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: '100%',
              height: 'auto',
              transition: 'transform 0.2s ease-in-out',
              backgroundColor: '#263238',
            },
          }}
        >
          <Slide in={mobileOpen} direction="down">
            <div>{drawer}</div>
          </Slide>
        </Drawer>
        <Drawer
          variant="permanent"
          open={drawerOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerOpen ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`,
              transition: 'width 0.2s ease',
              backgroundColor: '#263238',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 3,
          p: 3,
          pt: 8,
          width: { md: `calc(100% - ${drawerOpen ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`})` },
          transition: 'width 0.2s ease',
          bgcolor: 'white', // Nền trắng cho nội dung chính
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default LayoutAdmin;