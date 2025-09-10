import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import axios from 'axios';

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  // Hàm định dạng ngày
  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Không xác định' : date.toLocaleDateString('vi-VN');
  };

  // Ánh xạ trạng thái
  const statusMap = {
    Pending: 'Đang chờ',
    Shipped: 'Đã giao',
    Completed: 'Hoàn thành',
    Cancelled: 'Đã hủy',
  };

  // Lấy chi tiết đơn hàng từ API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('Vui lòng đăng nhập để xem chi tiết đơn hàng');
          return;
        }

        const response = await axios.get(`http://localhost:6868/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetched order details:', response.data); // Debug dữ liệu API
        setOrder(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching order details:', err);
        if (err.response?.status === 404) {
          setError('Không tìm thấy đơn hàng');
        } else if (err.response?.status === 401) {
          setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError('Không thể tải chi tiết đơn hàng. Vui lòng thử lại.');
        }
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (error || !order) {
    return (
      <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: '1400px', mx: 'auto' }}>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
          }}
        >
          {error || 'Không tìm thấy đơn hàng'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: '1400px', mx: 'auto' }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#1a2820',
          letterSpacing: '0.5px',
        }}
      >
        CHI TIẾT ĐƠN HÀNG #{order.id}
      </Typography>
      <Paper
        sx={{
          p: 3,
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#1a2820',
            mb: 2,
          }}
        >
          Thông tin đơn hàng
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
            mb: 1,
          }}
        >
          Ngày đặt: {formatDate(order.orderDate)}
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
            mb: 1,
          }}
        >
          Trạng thái: {statusMap[order.status] || order.status}
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
            mb: 1,
          }}
        >
          Tổng tiền: {order.total.toLocaleString()} VNĐ
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
            mb: 2,
          }}
        >
          Khách hàng: ID: {order.user.id}, Tên: {order.user.fullName || 'Không xác định'}, Email: {order.user.email}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#1a2820',
            mb: 2,
            mt: 3,
          }}
        >
          Danh sách sản phẩm
        </Typography>
        <TableContainer
          sx={{
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="order items table">
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: 'grey.100',
                  '& th': {
                    fontWeight: 'bold',
                    color: 'text.primary',
                    py: 2,
                    borderBottom: '2px solid',
                    borderColor: 'grey.300',
                  },
                }}
              >
                <TableCell>Tên sản phẩm</TableCell>
                <TableCell>Số lượng</TableCell>
                <TableCell>Đơn giá (VNĐ)</TableCell>
                <TableCell>Thành tiền (VNĐ)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderDetails && order.orderDetails.length > 0 ? (
                order.orderDetails.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'grey.50',
                        transition: 'background-color 0.2s',
                      },
                      '& td': {
                        py: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'grey.200',
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {item.product?.name || 'Không xác định'}
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price.toLocaleString()}</TableCell>
                    <TableCell>{(item.quantity * item.price).toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{
                      py: 2,
                      color: 'text.secondary',
                      fontWeight: 'medium',
                    }}
                  >
                    Không có sản phẩm nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          variant="outlined"
          onClick={() => navigate('/admin/order')}
          sx={{
            mt: 3,
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 'medium',
            px: 3,
            py: 1,
            borderColor: 'grey.400',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'grey.50',
            },
          }}
        >
          Quay lại
        </Button>
      </Paper>
    </Box>
  );
}

export default OrderDetails;