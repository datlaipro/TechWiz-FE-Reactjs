import React from "react";
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
  Paper,
  Stack,
} from "@mui/material";
import BreadcrumbsComponent from "../../components/display/free/BreadcrumbsComponent";
import InstagramGallery from "../../components/display/GroupItems/InstagramGallery";
import { useNavigate } from "react-router-dom";
import BuyDone from "./BuyDone";
import { useCart } from "../../components/action/CartContext";
import axios from "axios";

const CheckOut = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleToCart = () => {
    navigate("/cart");
  };

  const handleOpen = async () => {
    try {
      // Lấy token từ localStorage với key đúng
      const token = localStorage.getItem("jwtToken");
      console.log("Token retrieved:", token); // Debug
      if (!token) {
        setError("Please log in to place an order");
        return;
      }

      // Chuẩn bị dữ liệu cho API
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.salePrice || item.price,
        })),
      };

      // Gửi yêu cầu với token trong header
      const response = await axios.post("http://localhost:6868/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setOpen(true);
        clearCart();
      }
    } catch (err) {
      setError(err.response?.data || "Failed to place order. Please try again.");
      console.error("Checkout error:", err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  // Tính tổng tiền
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <>
      <BreadcrumbsComponent
        title="Checkout"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <Box sx={{ p: 6, width: "80%", margin: "auto", justifyContent: "center" }}>
        <Typography variant="h3" gutterBottom textAlign="center">
          Checkout
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        {/* Bảng sản phẩm */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Typography variant="h6">
                    <Box component="span" className="order-label">
                      Payment for order number:
                    </Box>{" "}
                    <Box component="span" className="order-number" sx={{ color: "error.main" }}>
                      #KKK67890
                    </Box>
                  </Typography>
                </TableCell>
              </TableRow>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
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
                      <Typography variant="h5">{item.quantity}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h5" color="error.main">
                        {(item.salePrice || item.price) * item.quantity} VNĐ
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Tổng tiền */}
        <TableContainer component={Paper} sx={{ mb: 4 }}>
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
                    {calculateSubtotal().toLocaleString()} VNĐ
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
                    {calculateSubtotal().toLocaleString()} VNĐ
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* Thông tin khách hàng và QR Code thanh toán */}
        <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
          <Paper sx={{ p: 4, flex: 1 }}>
            <Typography variant="h4" gutterBottom marginBottom={5}>
              Customer Information
            </Typography>
            <Stack spacing={2}>
              <Typography variant="h5">
                <strong>Full Name:</strong> Lee Jung Joe
              </Typography>
              <Typography variant="h5">
                <strong>Address:</strong> 123 Main St, Springfield
              </Typography>
              <Typography variant="h5">
                <strong>Phone Number:</strong> (123) 456-7890
              </Typography>
            </Stack>
          </Paper>
          <Paper sx={{ p: 4, flex: 1, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              Payment QR Code
            </Typography>
            <img
              src="/demo/images/qrcode.jpg"
              alt="QR Code"
              width={200}
              style={{ borderRadius: 8 }}
            />
            <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
              Scan the QR code to complete your payment.
            </Typography>
          </Paper>
        </Stack>

        {/* Thông tin thanh toán */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#183e3e",
              fontWeight: "bold",
              p: 2,
              fontSize: "20px",
              borderRadius: 20,
              color: "white",
              "&:hover": { backgroundColor: "#F86D72" },
            }}
            onClick={handleToCart}
          >
            Back to Cart
          </Button>
          <Button
            variant="contained"
            disabled={cartItems.length === 0}
            sx={{
              backgroundColor: cartItems.length === 0 ? "grey.500" : "#F86D72",
              fontWeight: "bold",
              p: 2,
              fontSize: "20px",
              borderRadius: 20,
              color: "white",
              "&:hover": { backgroundColor: cartItems.length === 0 ? "grey.500" : "#183e3e" },
            }}
            onClick={handleOpen}
          >
            Place Order
          </Button>
        </Stack>
      </Box>
      <InstagramGallery />
      <BuyDone open={open} handleClose={handleClose} />
    </>
  );
};

export default CheckOut;