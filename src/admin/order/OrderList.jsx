import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  TablePagination,
} from '@mui/material';
import axios from 'axios';

function OrderList() {
  const { userId } = useParams(); // Lấy userId từ URL nếu có
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [error, setError] = useState(null);

  // Hàm lấy danh sách đơn hàng từ API, bọc trong useCallback
  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('Vui lòng đăng nhập để xem đơn hàng');
        return;
      }

      const url = userId
        ? `http://localhost:6868/api/orders/user/${userId}`
        : 'http://localhost:6868/api/orders';

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Đảm bảo dữ liệu trả về là mảng
      const fetchedOrders = Array.isArray(response.data) ? response.data : [];
      console.log('Fetched orders:', fetchedOrders); // Debug dữ liệu API
      setOrders(fetchedOrders);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
      }
    }
  }, [userId]);

  // Gọi API khi component mount hoặc khi userId thay đổi
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewDetails = (orderId) => {
    navigate(`/admin/order/${orderId}`);
  };

  const handleEdit = (orderId) => {
    navigate(`/admin/edit-order/${orderId}`);
  };

  // Lọc đơn hàng theo userId nếu cần (đã xử lý trong API)
  const filteredOrders = orders;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
        {userId ? `ĐƠN HÀNG CỦA NGƯỜI DÙNG #${userId}` : 'DANH SÁCH ĐƠN HÀNG'}
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="order table">
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
              <TableCell>Mã đơn hàng</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Tổng tiền (VNĐ)</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow
                    key={order.id}
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
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell>{order.total.toLocaleString()}</TableCell>
                    <TableCell>{statusMap[order.status] || order.status}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleViewDetails(order.id)}
                          sx={{
                            borderRadius: '20px',
                            textTransform: 'none',
                            fontWeight: 'medium',
                            px: 2,
                            py: 0.5,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              bgcolor: 'primary.dark',
                            },
                          }}
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          onClick={() => handleEdit(order.id)}
                          sx={{
                            borderRadius: '20px',
                            textTransform: 'none',
                            fontWeight: 'medium',
                            px: 2,
                            py: 0.5,
                            borderColor: 'secondary.main',
                            color: 'secondary.main',
                            '&:hover': {
                              borderColor: 'secondary.dark',
                              bgcolor: 'grey.50',
                            },
                          }}
                        >
                          Sửa
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{
                    py: 2,
                    color: 'text.secondary',
                    fontWeight: 'medium',
                  }}
                >
                  Không có đơn hàng nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[6, 12, 24]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số hàng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} của ${count}`}
        sx={{
          mt: 2,
          '& .MuiTablePagination-toolbar': {
            backgroundColor: 'grey.50',
            borderRadius: '8px',
            py: 1,
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            color: 'text.secondary',
            fontWeight: 'medium',
          },
          '& .MuiTablePagination-actions button': {
            borderRadius: '8px',
            '&:hover': {
              bgcolor: 'grey.200',
            },
          },
        }}
      />
    </Box>
  );
}

export default OrderList;