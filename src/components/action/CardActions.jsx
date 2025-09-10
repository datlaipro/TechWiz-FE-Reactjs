// import { useCart } from './CartContext'; // Import useCart trong CartContext

import React from 'react';
import { IconButton, Box, Snackbar, Alert } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useCart } from './CartContext'; // Import useCart trong CartContext

const CardActions = ({ sx, className, product }) => {
  const { addToCart, notification, closeNotification } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <>
      <Box
        className={className}
        sx={{
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
          ...sx,
        }}
      >
        {/* Nút giỏ hàng */}
        <IconButton
          color="primary"
          sx={{
            bgcolor: '#455a64',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(248, 109, 114, 1)',
            },
          }}
          onClick={handleAddToCart}
        >
          <ShoppingCartIcon />
        </IconButton>

        {/* Nút XEM NHANH */}
        <IconButton
          color="secondary"
          sx={{
            bgcolor: '#455a64',
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(248, 109, 114, 1)',
            },
          }}
        >
          <VisibilityIcon />
        </IconButton>
      </Box>

      {/* Snackbar hiển thị thông báo */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CardActions;

// PHIÊN BẢN CŨ

// import React from 'react';
// import { IconButton, Box } from '@mui/material';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import FavoriteIcon from '@mui/icons-material/Favorite';

// const CardActions = () => {
//   return (
//     <Box
//       sx={{
//         position: 'absolute',
//         top: 8, // Khoảng cách với mép trên
//         left: 0,
//         right: 0,
//         display: 'flex',
//         gap: 1, // Khoảng cách giữa các nút
//         justifyContent: 'center',
//         zIndex: 2,
//       }}
//     >
//       {/* Nút thêm vào giỏ hàng */}
//       <IconButton
//         color="primary"
//         sx={{
//           bgcolor: 'rgba(0,0,0,0.7)',
//           color: 'white',
//           '&:hover': {
//             bgcolor: 'rgba(0,0,0,0.9)',
//           },
//         }}
//       >
//         <ShoppingCartIcon />
//       </IconButton>

//       {/* Nút thêm vào danh sách yêu thích */}
//       <IconButton
//         color="secondary"
//         sx={{
//           bgcolor: 'rgba(0,0,0,0.7)',
//           color: 'white',
//           '&:hover': {
//             bgcolor: 'rgba(0,0,0,0.9)',
//           },
//         }}
//       >
//         <FavoriteIcon />
//       </IconButton>
//     </Box>
//   );
// };

// export default CardActions;

