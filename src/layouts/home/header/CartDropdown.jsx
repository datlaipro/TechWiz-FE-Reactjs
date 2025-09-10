import React from 'react';
import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../components/action/CartContext'; // Import useCart từu CartContext

const CartDropdown = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart(); // Lấy danh sách sản phẩm từ context
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0); // Tính tổng số lượng

  const handleClick = () => {
    navigate('/cart');
  };

  return (
    <IconButton onClick={handleClick}>
      <Badge badgeContent={cartItemCount} color="primary">
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
};

export default CartDropdown;

// import React from "react";
// import {
//   Menu,
//   Typography,
//   Box,
//   Button,
//   Divider,
//   List,
//   ListItem,
// } from "@mui/material";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import { useNavigate } from "react-router-dom";

// const CartDropdown = () => {
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const open = Boolean(anchorEl);
//   const navigate = useNavigate();

//   const handleOpen = (event) => setAnchorEl(event.currentTarget);
//   const handleClose = () => setAnchorEl(null);

//   const handleViewCart = () => {
//     navigate("/cart");
//     handleClose();
//   };

//   const handleCheckout = () => {
//     navigate("/checkout");
//     handleClose();
//   };

//   return (
//     <>
//       <ShoppingCartIcon style={{ cursor: "pointer" }} onClick={handleOpen} />
//       <Menu
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         PaperProps={{
//           style: { width: 300, padding: 16 },
//         }}
//       >
//         <Typography variant="h6" mb={2}>
//           Your Cart
//         </Typography>
//         <List>
//           <ListItem>
//             <Box>
//               <Typography variant="subtitle1">Secrets of the Alchemist</Typography>
//               <Typography variant="body2">High quality in good price.</Typography>
//             </Box>
//             <Typography>$870</Typography>
//           </ListItem>
//           <Divider />
//           <ListItem>
//             <Box>
//               <Typography variant="subtitle1">Quest for the Lost City</Typography>
//               <Typography variant="body2">Professional Quest for the Lost City.</Typography>
//             </Box>
//             <Typography>$600</Typography>
//           </ListItem>
//         </List>
//         <Box mt={2}>
//           <Button variant="contained" fullWidth onClick={handleViewCart}>
//             View Cart
//           </Button>
//           <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={handleCheckout}>
//             Checkout
//           </Button>
//         </Box>
//       </Menu>
//     </>
//   );
// };

// export default CartDropdown;
