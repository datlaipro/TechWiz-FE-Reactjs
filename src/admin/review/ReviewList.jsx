import React, { useState } from 'react';
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
  Rating,
  Alert,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// Dữ liệu mẫu
const users = [
  { id: 1, name: 'Lee Jung Joe' },
  { id: 2, name: 'Park Ji Sung' },
];

const products = [
  { id: 1, name: 'Life Skills for Tweens' },
  { id: 2, name: '101 Things Every Kid Needs To Know' },
  { id: 3, name: 'Life Skills for Teens' },
];

const orders = [
  {
    id: 1,
    userId: 1,
    products: [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 },
    ],
  },
  {
    id: 2,
    userId: 2,
    products: [{ productId: 3, quantity: 1 }],
  },
];

const reviews = [
  {
    id: 1,
    comment: 'Very good book!',
    dateReview: '2025-03-15',
    rating: 4,
    orderId: 1,
    userId: 1,
  },
  {
    id: 2,
    comment: 'Super fast delivery, good quality.',
    dateReview: '2025-03-20',
    rating: 5,
    orderId: 2,
    userId: 2,
  },
  {
    id: 3,
    comment: 'Everything is good, wish you sell a lot!',
    dateReview: '2025-03-21',
    rating: 5,
    orderId: 1,
    userId: 1,
  },
  {
    id: 4,
    comment: 'Sản phẩm tạm được, cần cải thiện.',
    dateReview: '2025-03-22',
    rating: 3,
    orderId: 2,
    userId: 2,
  },
  {
    id: 5,
    comment: 'I will support many more times!',
    dateReview: '2025-03-23',
    rating: 5,
    orderId: 1,
    userId: 1,
  },
  {
    id: 6,
    comment: 'You should also try, I have no regrets.',
    dateReview: '2025-03-24',
    rating: 2,
    orderId: 2,
    userId: 2,
  },
  {
    id: 7,
    comment: 'I bought the most satisfactory book.',
    dateReview: '2025-03-25',
    rating: 4,
    orderId: 1,
    userId: 1,
  },
  {
    id: 8,
    comment: 'This shops service is great',
    dateReview: '2025-03-26',
    rating: 4,
    orderId: 2,
    userId: 2,
  },
  {
    id: 9,
    comment: 'Super fast delivery, good quality.',
    dateReview: '2025-03-27',
    rating: 5,
    orderId: 1,
    userId: 1,
  },
  {
    id: 10,
    comment: 'Everything is good, wish you sell a lot.',
    dateReview: '2025-03-28',
    rating: 3,
    orderId: 2,
    userId: 2,
  },
];

function ReviewList() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleEditReview = (reviewId) => {
    navigate(`/admin/edit-review/${reviewId}`);
  };

  const handleDeleteReview = () => {
    console.log(`Xóa review với ID: ${deleteId}`);
    // Cập nhật danh sách reviews
    reviews = reviews.filter((r) => r.id !== deleteId);
    setOpenDialog(false);
    setDeleteId(null);
    setPage(0); // Reset về trang 1
  };

  const handleAddReview = () => {
    navigate('/admin/add-review');
  };

  const handleRowClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Không xác định';
  };

  const getOrderProducts = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return [];
    return order.products.map((item) => ({
      productId: item.productId,
      name: products.find((p) => p.id === item.productId)?.name || 'Không xác định',
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setExpandedId(null); // Thu gọn tất cả khi chuyển trang
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setExpandedId(null);
  };

  const handleOpenDialog = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null);
  };

  if (reviews.length === 0) {
    return (
      <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: '1400px', mx: 'auto' }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#1a2820',
            letterSpacing: '0.5px',
            mb: 3,
          }}
        >
          DANH SÁCH ĐÁNH GIÁ
        </Typography>
        <Alert
          severity="info"
          sx={{
            borderRadius: '8px',
            mb: 2,
          }}
        >
          Không có đánh giá nào để hiển thị
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddReview}
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
          Thêm Review
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: '1400px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#1a2820',
            letterSpacing: '0.5px',
          }}
        >
          DANH SÁCH ĐÁNH GIÁ
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddReview}
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
          Thêm Review
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
        <Table sx={{ minWidth: 650 }} aria-label="review table">
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
              <TableCell>ID</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.length > 0 ? (
              reviews
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((review) => (
                  <React.Fragment key={review.id}>
                    <TableRow
                      onClick={() => handleRowClick(review.id)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: expandedId === review.id ? 'grey.50' : 'inherit',
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
                          {review.id}
                          <IconButton
                            size="small"
                            sx={{
                              borderRadius: '8px',
                              '&:hover': {
                                bgcolor: 'grey.200',
                              },
                            }}
                          >
                            {expandedId === review.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>{review.orderId}</TableCell>
                      <TableCell>{getUserName(review.userId)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditReview(review.id);
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
                              handleOpenDialog(review.id);
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
                        <Collapse in={expandedId === review.id} timeout="auto" unmountOnExit>
                          <Box
                            sx={{
                              margin: 1,
                              p: 2,
                              backgroundColor: 'grey.50',
                              borderRadius: '8px',
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 'medium',
                                color: 'text.primary',
                                mb: 2,
                              }}
                            >
                              Chi tiết đánh giá
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
                                  <TableCell>Điểm đánh giá</TableCell>
                                  <TableCell>Nội dung đánh giá</TableCell>
                                  <TableCell>Ngày đánh giá</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {getOrderProducts(review.orderId).map((item) => (
                                  <TableRow
                                    key={item.productId}
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
                                    <TableCell>{item.productId}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>
                                      <Rating
                                        value={review.rating}
                                        readOnly
                                        precision={1}
                                        sx={{ color: 'yelow' }}
                                      />
                                    </TableCell>
                                    <TableCell>{review.comment}</TableCell>
                                    <TableCell>
                                      {new Date(review.dateReview).toLocaleDateString('vi-VN') || '-'}
                                    </TableCell>
                                  </TableRow>
                                ))}
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
                  Không có đánh giá
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={reviews.length}
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
            Bạn có chắc muốn xóa đánh giá này? Hành động này không thể hoàn tác.
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
            onClick={handleDeleteReview}
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

export default ReviewList;