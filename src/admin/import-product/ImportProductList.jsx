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
  Collapse,
  IconButton,
  TablePagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

// Cấu hình axios với base URL
const api = axios.create({
  baseURL: 'http://localhost:6868',
  headers: { 'Content-Type': 'application/json' },
});

function ImportProductList() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [importProducts, setImportProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy dữ liệu từ backend khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy danh sách phiếu nhập hàng
        const importResponse = await api.get('/api/import-products');
        setImportProducts(importResponse.data);

        // Lấy danh sách sản phẩm
        const productResponse = await api.get('/api/product');
        setProducts(productResponse.data);

        // Lấy danh sách nhà cung cấp
        const supplierResponse = await api.get('/api/supplier');
        setSuppliers(supplierResponse.data);

        setError(null);
      } catch (err) {
        setError('Lỗi khi lấy dữ liệu: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditImport = (importId) => {
    navigate(`/admin/edit-import-product/${importId}`);
  };

  const handleDeleteImport = async (importId) => {
    if (window.confirm('Bạn có chắc muốn xóa phiếu nhập này?')) {
      try {
        await api.delete(`/api/import-products/${importId}`);
        setImportProducts(importProducts.filter((ip) => ip.id !== importId));
        setError(null);
      } catch (err) {
        setError('Lỗi khi xóa phiếu nhập: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleAddImport = () => {
    navigate('/admin/create-import-product');
  };

  const handleRowClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : 'Không xác định';
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    return supplier ? supplier.name : 'Không xác định';
  };

  const getTotalQuantity = (details) => {
    return details.reduce((total, item) => total + item.quantity, 0);
  };

  const formatDate = (isoDate) => {
    return isoDate ? new Date(isoDate).toISOString().split('T')[0] : 'Không xác định';
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, px: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: '1400px', mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          flexWrap: 'wrap',
          gap: 2,
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
          DANH SÁCH PHIẾU NHẬP HÀNG
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddImport}
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
          Thêm phiếu nhập
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="import product table">
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
              <TableCell>ID phiếu nhập</TableCell>
              <TableCell>Ngày nhập</TableCell>
              <TableCell>Tổng số lượng</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {importProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((importProduct) => (
                <React.Fragment key={importProduct.id}>
                  <TableRow
                    onClick={() => handleRowClick(importProduct.id)}
                    sx={{
                      cursor: 'pointer',
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
                    <TableCell>{importProduct.id}</TableCell>
                    <TableCell>{formatDate(importProduct.importDate)}</TableCell>
                    <TableCell>{getTotalQuantity(importProduct.details)}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditImport(importProduct.id);
                        }}
                        sx={{
                          color: 'warning.main',
                          '&:hover': { bgcolor: 'warning.light', transform: 'scale(1.1)' },
                          transition: 'all 0.2s',
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImport(importProduct.id);
                        }}
                        sx={{
                          color: 'error.main',
                          '&:hover': { bgcolor: 'error.light', transform: 'scale(1.1)' },
                          transition: 'all 0.2s',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                      <Collapse in={expandedId === importProduct.id} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{
                              fontWeight: 'medium',
                              color: '#1a2820',
                            }}
                          >
                            Chi tiết phiếu nhập hàng
                          </Typography>
                          <Table
                            size="small"
                            sx={{
                              borderRadius: '8px',
                              border: '1px solid',
                              borderColor: 'grey.200',
                            }}
                          >
                            <TableHead>
                              <TableRow
                                sx={{
                                  backgroundColor: 'grey.100',
                                  '& th': {
                                    fontWeight: 'bold',
                                    color: 'text.primary',
                                    py: 1.5,
                                    borderBottom: '1px solid',
                                    borderColor: 'grey.300',
                                  },
                                }}
                              >
                                <TableCell>ID sản phẩm</TableCell>
                                <TableCell>Tên sản phẩm</TableCell>
                                <TableCell>Giá nhập</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Nhà cung cấp</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {importProduct.details.map((item, index) => (
                                <TableRow
                                  key={index}
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'grey.50',
                                      transition: 'background-color 0.2s',
                                    },
                                    '& td': {
                                      py: 1,
                                      borderBottom: '1px solid',
                                      borderColor: 'grey.200',
                                    },
                                  }}
                                >
                                  <TableCell>{item.product.id}</TableCell>
                                  <TableCell sx={{ fontWeight: 'medium' }}>
                                    {item.product.name}
                                  </TableCell>
                                  <TableCell>{item.importPrice.toLocaleString()} VNĐ</TableCell>
                                  <TableCell>{item.quantity}</TableCell>
                                  <TableCell>{item.supplier.name}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[6, 12, 24]}
        component="div"
        count={importProducts.length}
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

export default ImportProductList;