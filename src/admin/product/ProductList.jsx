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
  IconButton,
  TextField,
  TablePagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6); // Tối đa 6 hàng mỗi trang

  // Fetch danh sách sản phẩm
  useEffect(() => {
    fetch('http://localhost:6868/api/product')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  // Xử lý tìm kiếm theo tên
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setPage(0); // Reset về trang đầu khi tìm kiếm
  }, [searchTerm, products]);

  // Xử lý thay đổi ô tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Xóa sản phẩm
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      fetch(`http://localhost:6868/api/product/${id}`, { method: 'DELETE' })
        .then(() => {
          const updatedProducts = products.filter((product) => product.id !== id);
          setProducts(updatedProducts);
          setFilteredProducts(updatedProducts.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          ));
        })
        .catch((err) => console.error('Error deleting product:', err));
    }
  };

  // Xem chi tiết sản phẩm
  const handleView = (id) => {
    navigate(`/admin/productview/${id}`);
  };

  // Sửa sản phẩm
  const handleEdit = (id) => {
    navigate(`/admin/editproduct/${id}`);
  };

  // Thêm sản phẩm
  const handleAdd = () => {
    navigate('/admin/addproduct');
  };

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số hàng mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ mt: 2, px: { xs: 2, sm: 4 }, maxWidth: '1400px', mx: 'auto' }}>
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
          DANH SÁCH SẢN PHẨM
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
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
          Thêm sản phẩm
        </Button>
      </Box>

      {/* Ô tìm kiếm */}
      <TextField
        fullWidth
        label="Tìm kiếm theo tên sản phẩm"
        value={searchTerm}
        onChange={handleSearchChange}
        margin="normal"
        variant="outlined"
        sx={{
          mb: 3,
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

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="product table">
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
              <TableCell>Tên</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Tác giả</TableCell>
              <TableCell>Thể loại</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ảnh</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow
                  key={product.id}
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
                  <TableCell>{product.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{product.name}</TableCell>
                  <TableCell>{product.price.toLocaleString()} VNĐ</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.author}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell
                    sx={{
                      color: product.status ? 'success.main' : 'error.main',
                      fontWeight: 'medium',
                    }}
                  >
                    {product.status ? 'Còn bán' : 'Ngừng bán'}
                  </TableCell>
                  <TableCell>
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].imagePath}
                        alt="product"
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: 'cover',
                          borderRadius: '8px',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Không có ảnh
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleView(product.id)}
                      sx={{
                        color: 'info.main',
                        '&:hover': { bgcolor: 'info.light', transform: 'scale(1.1)' },
                        transition: 'all 0.2s',
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleEdit(product.id)}
                      sx={{
                        color: 'warning.main',
                        '&:hover': { bgcolor: 'warning.light', transform: 'scale(1.1)' },
                        transition: 'all 0.2s',
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(product.id)}
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
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <TablePagination
        rowsPerPageOptions={[6, 12, 24]}
        component="div"
        count={filteredProducts.length}
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

export default ProductList;