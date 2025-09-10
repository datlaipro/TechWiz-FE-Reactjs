import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

function EditOrder() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Danh sách trạng thái
  const statuses = ['Pending', 'Shipped', 'Completed', 'Cancelled'];

  // Ánh xạ trạng thái tiếng Việt
  const statusMap = {
    Pending: 'Đang chờ',
    Shipped: 'Đã giao',
    Completed: 'Hoàn thành',
    Cancelled: 'Đã hủy',
  };

  // Hàm định dạng ngày
  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Không xác định' : date.toLocaleDateString('vi-VN');
  };

  // Lấy chi tiết đơn hàng từ API
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('Vui lòng đăng nhập để chỉnh sửa đơn hàng');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:6868/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetched order:', response.data); // Debug dữ liệu API
        setOrder(response.data);
        setLoading(false);
        setError('');
      } catch (err) {
        console.error('Error fetching order:', err);
        if (err.response?.status === 404) {
          setError('Không tìm thấy đơn hàng');
        } else if (err.response?.status === 401) {
          setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError('Không thể tải đơn hàng. Vui lòng thử lại.');
        }
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  // Xử lý thay đổi trạng thái
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  // Kiểm tra dữ liệu hợp lệ
  const isValid = () => {
    return order && order.status;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) {
      setError('Vui lòng chọn trạng thái');
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Vui lòng đăng nhập để chỉnh sửa đơn hàng');
        return;
      }

      // Chỉ gửi trường status
      const updatedData = {
        status: order.status,
      };

      await axios.put(`http://localhost:6868/api/orders/${orderId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Updated order status:', updatedData); // Debug dữ liệu gửi đi
      navigate('/admin/order');
    } catch (err) {
      console.error('Error updating order:', err);
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      } else if (err.response?.status === 404) {
        setError('Không tìm thấy đơn hàng');
      } else {
        setError('Không thể cập nhật đơn hàng. Vui lòng thử lại.');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: '1400px', mx: 'auto' }}>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
          }}
        >
          Đang tải...
        </Typography>
      </Box>
    );
  }

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
        CHỈNH SỬA ĐƠN HÀNG #{order.id}
      </Typography>
      <Paper
        sx={{
          p: 3,
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: '8px',
              }}
            >
              {error}
            </Alert>
          )}

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
          <Grid container spacing={2}>
            {/* Cột trái */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày đặt"
                name="orderDate"
                value={formatDate(order.orderDate)}
                disabled
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'background.paper',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                    fontWeight: 'medium',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'primary.main',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Tổng tiền (VNĐ)"
                name="total"
                value={order.total.toLocaleString()}
                disabled
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'background.paper',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                    fontWeight: 'medium',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'primary.main',
                  },
                }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 'medium',
                    '&.Mui-focused': {
                      color: 'primary.main',
                    },
                  }}
                >
                  Trạng thái
                </InputLabel>
                <Select
                  name="status"
                  value={order.status}
                  onChange={handleChange}
                  required
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: 'background.paper',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                    },
                  }}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {statusMap[status] || status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Cột phải */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Khách hàng"
                name="user.fullName"
                value={order.user.fullName || 'Không xác định'}
                disabled
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'background.paper',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                    fontWeight: 'medium',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'primary.main',
                  },
                }}
              />
              <TextField
                fullWidth
                label="Email"
                name="user.email"
                value={order.user.email}
                disabled
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'background.paper',
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                      boxShadow: '0 0 8px rgba(25, 118, 210, 0.3)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'text.secondary',
                    fontWeight: 'medium',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'primary.main',
                  },
                }}
              />
            </Grid>
          </Grid>

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

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 'medium',
                px: 3,
                py: 1,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                  bgcolor: 'primary.dark',
                },
              }}
            >
              Lưu
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/order')}
              sx={{
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
              Hủy
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default EditOrder;