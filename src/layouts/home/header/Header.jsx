import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Box,
  useMediaQuery,
  Drawer,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import UserItems from "./UserItems";
import { AuthContext } from "../../protected/AuthContext";

const Logo = styled("img")({
  height: "50px",
});

const CustomButton = styled(Button)(({ uppercase }) => ({
  textTransform: uppercase ? "uppercase" : "none",
  margin: "0 10px",
  fontSize: "18px",
  color: "#272727",
  "&:hover": {
    color: "#F86D72",
  },
}));

const Header = () => {
  const { isAuthenticated, setIsAuthenticated, setShowLoginModal } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width:800px)");
  const [isScrolled, setIsScrolled] = useState(false);

  // Theo dõi vị trí cuộn
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0); // Nếu cuộn xuống, đặt trạng thái là true
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: isScrolled ? "rgba(247, 249, 249, 0.8)" : "#fff", // Độ trong suốt khi cuộn
          boxShadow: isScrolled ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none", // Thêm bóng khi cuộn
          transition: "background-color 0.3s ease, box-shadow 0.3s ease", // Hiệu ứng chuyển đổi
          padding: "5px 0",
          color: "#272727",

        }}
      >
        <Toolbar>
          <Logo src="/demo/images/main-logo.png" alt="Logo" />
          {!isMobile && (
            <Box sx={{ flexGrow: 1, textAlign: "center" }}>
              <CustomButton component={Link} to="/" uppercase>
                Home
              </CustomButton>
              <CustomButton component={Link} to="/about" uppercase>
                About
              </CustomButton>
              <CustomButton component={Link} to="/shop" uppercase>
                Shop
              </CustomButton>
              <CustomButton component={Link} to="/blog" uppercase>
                Blogs
              </CustomButton>
              <CustomButton component={Link} to="/contact" uppercase>
                Contact
              </CustomButton>
            </Box>
          )}
          {!isMobile && <UserItems />}
          {isMobile && (
            <>
              <IconButton onClick={toggleDrawer(true)}>
                <MenuIcon sx={{ marginLeft: "20px" }} />
              </IconButton>
              <Box
                sx={{
                  position: "absolute",
                  right: 30,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <UserItems />
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="top" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: "100%", p: 2 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <IconButton sx={{ mb: 2 }}>
            <CloseIcon />
          </IconButton>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 2,
              justifyItems: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <CustomButton
              component={Link}
              to="/"
              sx={{
                backgroundColor: "blue",
                borderRadius: "8px",
                color: "red",
                width: "150px",
                py: 2,
              }}
            >
              Home
            </CustomButton>
            <CustomButton
              component={Link}
              to="/about"
              sx={{
                backgroundColor: "blue",
                borderRadius: "8px",
                color: "red",
                width: "150px",
                py: 2,
              }}
            >
              About
            </CustomButton>
            <CustomButton
              component={Link}
              to="/shop"
              sx={{
                backgroundColor: "blue",
                borderRadius: "8px",
                color: "red",
                width: "150px",
                py: 2,
              }}
            >
              Shop
            </CustomButton>
            <CustomButton
              component={Link}
              to="/blog"
              sx={{
                backgroundColor: "blue",
                borderRadius: "8px",
                color: "red",
                width: "150px",
                py: 2,
              }}
            >
              Blogs
            </CustomButton>
            <CustomButton
              component={Link}
              to="/contact"
              sx={{
                backgroundColor: "blue",
                borderRadius: "8px",
                color: "red",
                width: "150px",
                py: 2,
              }}
            >
              Contact
            </CustomButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;

// import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   Button,
//   Container,
//   Box,
//   useMediaQuery,
//   Drawer,
//   IconButton,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import CloseIcon from "@mui/icons-material/Close";
// import { styled } from "@mui/material/styles";
// import UserItems from "./UserItems";
// import { AuthContext } from "../../protected/AuthContext";

// const Logo = styled("img")({
//   height: "50px",
// });

// const CustomButton = styled(Button)(({ uppercase }) => ({
//   textTransform: uppercase ? "uppercase" : "none",
//   margin: "0 10px",
//   fontSize: "18px",
//   color: "#272727",
//   "&:hover": {
//     color: "#F86D72",
//   },
// }));

// const Header = () => {
//   const { isAuthenticated, setIsAuthenticated, setShowLoginModal } = useContext(AuthContext);
//   const [drawerOpen, setDrawerOpen] = React.useState(false);
//   const isMobile = useMediaQuery("(max-width:800px)");

//   const toggleDrawer = (open) => () => {
//     setDrawerOpen(open);
//   };

//   return (
//     <>
//       <AppBar position="static" sx={{ backgroundColor: "#fff", boxShadow: "none", padding: '5px 0', color: "#272727" }}>
//         <Toolbar>
//           <Logo src="/demo/images/main-logo.png" alt="Logo" />
//           {!isMobile && (
//             <Box sx={{ flexGrow: 1, textAlign: "center" }}>
//               <CustomButton component={Link} to="/" uppercase>Home</CustomButton>
//               <CustomButton component={Link} to="/about" uppercase>About</CustomButton>
//               <CustomButton component={Link} to="/shop" uppercase>Shop</CustomButton>
//               <CustomButton component={Link} to="/blog" uppercase>Blogs</CustomButton>
//               <CustomButton component={Link} to="/contact" uppercase>Contact</CustomButton>
//             </Box>
//           )}
//           {!isMobile && (
//             <UserItems />
//           )}
//           {isMobile && (
//             <>
//               <IconButton onClick={toggleDrawer(true)}>
//                 <MenuIcon sx={{ marginLeft: '20px' }} />
//               </IconButton>
//               <Box sx={{ position: 'absolute', right: 30, display: 'flex', alignItems: 'center' }}>
//                 <UserItems />
//               </Box>
//             </>
//           )}
//         </Toolbar>
//       </AppBar>
//       <Drawer anchor="top" open={drawerOpen} onClose={toggleDrawer(false)}>
//         <Box
//           sx={{ width: '100%', p: 2 }}
//           role="presentation"
//           onClick={toggleDrawer(false)}
//           onKeyDown={toggleDrawer(false)}
//         >
//           <IconButton sx={{ mb: 2 }}>
//             <CloseIcon />
//           </IconButton>
//           <Box sx={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(2, 1fr)',
//             gap: 2,
//             justifyItems: 'center',
//             alignItems: 'center',
//             mt: 2,
//           }}>
//             <CustomButton component={Link} to="/" sx={{ backgroundColor: 'blue', borderRadius: '8px', color: 'red', width: '150px', py: 2 }}>Home</CustomButton>
//             <CustomButton component={Link} to="/about" sx={{ backgroundColor: 'blue', borderRadius: '8px', color: 'red', width: '150px', py: 2 }}>About</CustomButton>
//             <CustomButton component={Link} to="/shop" sx={{ backgroundColor: 'blue', borderRadius: '8px', color: 'red', width: '150px', py: 2 }}>Shop</CustomButton>
//             <CustomButton component={Link} to="/blog" sx={{ backgroundColor: 'blue', borderRadius: '8px', color: 'red', width: '150px', py: 2 }}>Blogs</CustomButton>
//             <CustomButton component={Link} to="/contact" sx={{ backgroundColor: 'blue', borderRadius: '8px', color: 'red', width: '150px', py: 2 }}>Contact</CustomButton>
//           </Box>
//         </Box>
//       </Drawer>
//     </>
//   );
// };

// export default Header;