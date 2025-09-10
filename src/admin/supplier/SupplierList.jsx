import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

function SupplierList() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Lấy danh sách nhà cung cấp từ API
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:6868/api/supplier');
      console.log('Suppliers response:', response.data); // Debug
      setSuppliers(response.data);
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message;
      setError('Lỗi khi tải danh sách nhà cung cấp: ' + errorMessage);
      console.error('Lỗi:', err);
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchSuppliers khi component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Xử lý xóa nhà cung cấp
  const handleDeleteSupplier = async (supplierId) => {
    if (!window.confirm('Bạn có chắc muốn xóa nhà cung cấp này?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:6868/api/supplier/${supplierId}`);
      setSuccess('Xóa nhà cung cấp thành công!');
      fetchSuppliers(); // Làm mới danh sách
      setError('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message;
      setError('Lỗi khi xóa nhà cung cấp: ' + errorMessage);
      console.error('Lỗi:', err);
    }
  };

  const handleEditSupplier = (supplierId) => {
    navigate(`/admin/edit-supplier/${supplierId}`);
  };

  const handleAddSupplier = () => {
    navigate('/admin/add-supplier');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: '1400px', mx: 'auto' }}>
      {/* Thông báo */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>
          {success}
        </Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#1a2820',
            letterSpacing: '0.5px',
          }}
        >
          DANH SÁCH NHÀ CUNG CẤP
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddSupplier}
          sx={{
            borderRadius: '20px',
            textTransform: 'none',
            fontWeight: 'medium',
            px: 3,
            py: 1,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              bgcolor: 'primary.dark',
            },
          }}
        >
          Thêm nhà cung cấp
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="supplier table">
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
                  <TableCell>Tên</TableCell>
                  <TableCell>Địa chỉ</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliers.length > 0 ? (
                  suppliers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((supplier) => (
                      <TableRow
                        key={supplier.id}
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
                        <TableCell>{supplier.name}</TableCell>
                        <TableCell>{supplier.address}</TableCell>
                        <TableCell>{supplier.phoneNumber}</TableCell>
                        <TableCell>{supplier.email}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              onClick={() => handleEditSupplier(supplier.id)}
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
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDeleteSupplier(supplier.id)}
                              sx={{
                                borderRadius: '20px',
                                textTransform: 'none',
                                fontWeight: 'medium',
                                px: 2,
                                py: 0.5,
                                borderColor: 'error.main',
                                color: 'error.main',
                                '&:hover': {
                                  borderColor: 'error.dark',
                                  bgcolor: 'grey.50',
                                },
                              }}
                            >
                              Xóa
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
                      Không có nhà cung cấp nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[6, 12, 24]}
            component="div"
            count={suppliers.length}
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
        </>
      )}
    </Box>
  );
}

export default SupplierList;