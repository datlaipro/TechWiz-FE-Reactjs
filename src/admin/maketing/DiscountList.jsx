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
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';

function DiscountList() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const discountResponse = await axios.get('http://localhost:6868/api/discounts');
        const validDiscounts = discountResponse.data
          .filter(
            (discount) => discount && discount.id && !isNaN(discount.id) && discount.id > 0
          )
          .map((discount) => ({
            ...discount,
            discountProducts: Array.isArray(discount.discountProducts)
              ? discount.discountProducts.map((dp) => ({
                  productId: dp.productId,
                  name: dp.name || 'Không xác định',
                  price: dp.price || 0,
                  salePrice: dp.salePrice,
                  quantity: dp.quantity,
                }))
              : [],
          }));
        console.log('Discounts data:', validDiscounts);
        setDiscounts(validDiscounts);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách mã giảm giá');
        setLoading(false);
        console.error('Error fetching discounts:', err);
      }
    };
    fetchData();
  }, []);

  const handleEditDiscount = async (discountId) => {
    if (!discountId || isNaN(discountId) || discountId <= 0) {
      setError('ID mã giảm giá không hợp lệ');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:6868/api/discounts/${discountId}`);
      if (response.data) {
        navigate(`/admin/edit-discount/${discountId}`);
      } else {
        setError(`Mã giảm giá #${discountId} không tồn tại`);
      }
    } catch (err) {
      setError(`Mã giảm giá #${discountId} không tồn tại`);
      console.error('Error checking discount:', err);
    }
  };

  const handleDeleteDiscount = async () => {
    console.log(`Attempting to delete discount ID: ${deleteId}`);
    try {
      await axios.delete(`http://localhost:6868/api/discounts/${deleteId}`);
      console.log(`Successfully deleted discount ID: ${deleteId}`);
      setDiscounts((prev) => prev.filter((d) => d.id !== deleteId));
      setOpenDialog(false);
      setDeleteId(null);
    } catch (err) {
      setError(err.message || 'Không thể xóa mã giảm giá');
      console.error('Lỗi khi xóa mã giảm giá:', err);
    }
  };

  const handleAddDiscount = () => {
    navigate('/admin/add-discount');
  };

  const handleRowClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  if (loading) {
    return (
      <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: '1400px', mx: 'auto' }}>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            fontWeight: 'medium',
            textAlign: 'center',
          }}
        >
          Đang tải...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: '1400px', mx: 'auto' }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: '8px',
            mb: 2,
          }}
        >
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
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
          Thử lại
        </Button>
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
          DANH SÁCH MÃ GIẢM GIÁ
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddDiscount}
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
          Thêm mã giảm giá
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
        <Table sx={{ minWidth: 650 }} aria-label="discount table">
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
              <TableCell>ID mã giảm giá</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discounts.length > 0 ? (
              discounts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((discount) => (
                  <React.Fragment key={discount.id}>
                    <TableRow
                      onClick={() => handleRowClick(discount.id)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: expandedId === discount.id ? 'grey.50' : 'inherit',
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
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {discount.id}
                          <IconButton
                            size="small"
                            sx={{
                              borderRadius: '8px',
                              '&:hover': {
                                bgcolor: 'grey.200',
                              },
                            }}
                          >
                            {expandedId === discount.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>{discount.dateStart || '-'}</TableCell>
                      <TableCell>{discount.dateEnd || '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditDiscount(discount.id);
                            }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDialog(discount.id);
                            }}
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
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                        <Collapse in={expandedId === discount.id} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1, backgroundColor: 'grey.50', p: 2, borderRadius: '8px' }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 'medium',
                                color: 'text.primary',
                                mb: 2,
                              }}
                            >
                              Chi tiết sản phẩm
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow
                                  sx={{
                                    backgroundColor: 'grey.100',
                                    '& th': {
                                      fontWeight: 'medium',
                                      color: 'text.primary',
                                      py: 1,
                                      borderBottom: '1px solid',
                                      borderColor: 'grey.300',
                                    },
                                  }}
                                >
                                  <TableCell>ID sản phẩm</TableCell>
                                  <TableCell>Tên sản phẩm</TableCell>
                                  <TableCell>Giá gốc (VNĐ)</TableCell>
                                  <TableCell>Giá khuyến mại (VNĐ)</TableCell>
                                  <TableCell>Số lượng khuyến mại</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {discount.discountProducts && discount.discountProducts.length > 0 ? (
                                  discount.discountProducts.map((dp, index) => (
                                    <TableRow
                                      key={dp.productId || index}
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
                                      <TableCell>{dp.productId || '-'}</TableCell>
                                      <TableCell>{dp.name || 'Không xác định'}</TableCell>
                                      <TableCell>
                                        {dp.price ? dp.price.toLocaleString() : '-'}
                                      </TableCell>
                                      <TableCell>
                                        {dp.salePrice ? dp.salePrice.toLocaleString() : '-'}
                                      </TableCell>
                                      <TableCell>{dp.quantity || '-'}</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell
                                      colSpan={5}
                                      sx={{
                                        py: 1,
                                        color: 'text.secondary',
                                        fontWeight: 'medium',
                                        textAlign: 'center',
                                      }}
                                    >
                                      Không có sản phẩm
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  sx={{
                    py: 2,
                    color: 'text.secondary',
                    fontWeight: 'medium',
                    textAlign: 'center',
                  }}
                >
                  Không có mã giảm giá
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={discounts.length}
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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: '12px',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            color: '#1a2820',
          }}
        >
          Xác nhận xóa
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: 'text.secondary',
            }}
          >
            Bạn có chắc muốn xóa mã giảm giá này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.50',
              },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteDiscount}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              color: 'error.main',
              '&:hover': {
                bgcolor: 'grey.50',
                color: 'error.dark',
              },
            }}
            autoFocus
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DiscountList;