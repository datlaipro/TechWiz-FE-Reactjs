import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogContent,
  ImageList,
  ImageListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

// Hàm giới hạn số ký tự
const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch dữ liệu sản phẩm
  useEffect(() => {
    fetch(`http://localhost:6868/api/product/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Không tìm thấy sản phẩm');
        setLoading(false);
        console.error('Error:', err);
      });
  }, [id]);

  // Xử lý nhấp vào ảnh để xem lớn
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Đóng dialog ảnh
  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: '1200px', mx: 'auto' }}>
        <Typography variant="h6" color="text.secondary">
          Đang tải...
        </Typography>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: '1200px', mx: 'auto' }}>
        <Typography variant="h6" color="error.main">
          {error || 'Không tìm thấy sản phẩm'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2, px: { xs: 2, sm: 4 }, maxWidth: '1200px', mx: 'auto' }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: 'text.primary',
          letterSpacing: '0.5px',
        }}
      >
        CHI TIẾT SẢN PHẨM #{id}
        {/* CHI TIẾT SẢN PHẨM #{truncateText(product.name, 60)} */}
      </Typography>
      <Paper
        sx={{
          p: 4,
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Grid container spacing={3}>
          {/* Thông tin sản phẩm (chiếm ~70%) */}
          <Grid item xs={12} md={8}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 2,
              }}
            >
              Thông tin sản phẩm
            </Typography>
            <TableContainer
              sx={{
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Table>
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
                    <TableCell>Thuộc tính</TableCell>
                    <TableCell>Giá trị</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    { label: 'Tên', value: truncateText(product.name, 60) },
                    { label: 'Giá', value: `${product.price.toLocaleString()} VNĐ` },
                    { label: 'Số lượng', value: product.quantity },
                    {
                      label: 'Ngày thêm',
                      value: new Date(product.dateAdded).toLocaleDateString(),
                    },
                    { label: 'Tác giả', value: product.author },
                    { label: 'Thể loại', value: product.category },
                    { label: 'Mô tả', value: truncateText(product.description, 70) },
                    { label: 'Nội dung', value: truncateText(product.content, 70) },
                    { label: 'Ngôn ngữ', value: product.language },
                    {
                      label: 'Trạng thái',
                      value: product.status ? 'Còn bán' : 'Ngừng bán',
                    },
                  ].map((row, index) => (
                    <TableRow
                      key={index}
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
                      <TableCell sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                        {row.label}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: row.label === 'Trạng thái' && !product.status ? 'error.main' : 'text.secondary',
                          fontWeight: 'medium',
                        }}
                      >
                        {row.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Thư viện ảnh (chiếm ~30%) */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 2,
              }}
            >
              Thư viện ảnh
            </Typography>
            <Box sx={{ mt: 2 }}>
              {product.images && product.images.length > 0 ? (
                <ImageList
                  sx={{
                    width: '100%',
                    maxHeight: 450,
                    borderRadius: '8px',
                    overflowY: product.images.length > 6 ? 'auto' : 'hidden',
                       // Nếu ảnh >6 haowcj vượt 450px thì cuộn
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                  }}
                  variant="standard"
                  cols={2}
                  gap={8}
                >
                  {product.images.slice(0, 8).map((image, index) => (
                    // Nếu ảnh >6 haowcj vượt 450px thì cuộn
                    <ImageListItem
                      key={image.imagePath}
                      sx={{
                        '&:hover': {
                          opacity: 0.9,
                          transition: 'opacity 0.2s',
                        },
                      }}
                    >
                      <img
                        src={image.imagePath}
                        alt={`Image ${index + 1}`}
                        loading="lazy"
                        style={{
                          cursor: 'pointer',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          width: '100%',
                          height: '140px',
                        }}
                        onClick={() => handleImageClick({ imagePath: image.imagePath })}
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <Typography color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  Không có ảnh
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Dialog để xem ảnh lớn */}
        <Dialog
          open={!!selectedImage}
          onClose={handleCloseDialog}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              maxWidth: '90vw',
            },
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            {selectedImage && (
              <img
                src={selectedImage.imagePath}
                alt="product"
                style={{
                  width: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/admin/product')}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 'medium',
              px: 4,
              py: 1,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                bgcolor: 'primary.dark',
              },
            }}
          >
            Quay lại
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default ProductView;