// import { useCart } from '../../components/action/CartContext'; // Import useCart từ CartContext
import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Paper,
  Input,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../components/action/CartContext';  // Import useCart từ CartContext
import InstagramGallery from '../../components/display/GroupItems/InstagramGallery';
import LatestPosts from '../../components/display/post/LatestPosts';
import BreadcrumbsComponent from '../../components/display/free/BreadcrumbsComponent';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, notification, closeNotification } = useCart();

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const handleQuantityChange = (id, value) => {
    const quantity = parseInt(value);
    if (isNaN(quantity) || quantity < 1) {
      updateQuantity(id, 1);
    } else {
      updateQuantity(id, quantity);
    }
  };

  return (
    <>
      <BreadcrumbsComponent
        title="Cart"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Cart' },
        ]}
      />
      <Box sx={{ p: 6, width: '80%', margin: 'auto', justifyContent: 'center' }}>
        <Typography variant="h3" gutterBottom textAlign="center">
          Shopping Cart
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h5" sx={{ ml: 3 }}>
                    Product
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h5">Quantity</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h5">Subtotal</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h5">Action</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="h6">Your cart is empty</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <img
                          src={item.image}
                          alt={item.name}
                          width={80}
                          style={{ borderRadius: 8 }}
                        />
                        <Typography variant="h5">{item.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <IconButton
                          color="default"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Remove />
                        </IconButton>
                        <Input
                          value={item.quantity}
                          inputProps={{
                            min: 1,
                            style: { textAlign: 'center', width: 40, color: 'text.primary' },
                          }}
                          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        />
                        <IconButton
                          color="default"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Add />
                        </IconButton>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h6" color="error.main">
                        {(item.salePrice || item.price) * item.quantity} VNĐ
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="inherit"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ ml: 7 }}>
            Cart Totals
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5" sx={{ ml: 5 }}>
                      Subtotal :
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" color="error.main" sx={{ mr: 5 }}>
                      {calculateSubtotal()} VNĐ
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5" sx={{ ml: 5 }}>
                      Total :
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" color="error.main" sx={{ mr: 5 }}>
                      {calculateSubtotal()} VNĐ
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
          <Button
            variant="contained"
            sx={{
              p: 2,
              backgroundColor: '#183e3e',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '20px',
              borderRadius: 20,
              '&:hover': {
                backgroundColor: '#F86D72',
              },
            }}
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
          <Button
            variant="contained"
            disabled={cartItems.length === 0}
            sx={{
              p: 2,
              backgroundColor: cartItems.length === 0 ? 'grey.500' : '#F86D72',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '20px',
              borderRadius: 20,
              '&:hover': {
                backgroundColor: cartItems.length === 0 ? 'grey.500' : '#183e3e',
              },
            }}
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </Button>
        </Stack>

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
      </Box>
      <LatestPosts />
      <InstagramGallery />
    </>
  );
};

export default Cart;