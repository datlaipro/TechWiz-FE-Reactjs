import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

function AddProduct() {
  const navigate = useNavigate();

  // State cho thông tin sản phẩm
  const [product, setProduct] = useState({
    name: '',
    price: '',
    quantity: '',
    author: '',
    category: '',
    description: '',
    content: '',
    language: '',
    status: true,
  });
  const [images, setImages] = useState([]); // Danh sách ảnh
  const [newImagePaths, setNewImagePaths] = useState(''); // Nhiều đường dẫn ảnh
  const [error, setError] = useState('');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // State cho modal xác nhận

  // Danh sách giá trị cho category và language
  const categories = ['Tiểu Thuyết', 'Trinh Thám', 'Ngoại Ngữ', 'Tình Cảm', 'Văn Học'];
  const languages = ['Tiếng Anh', 'Tiếng Việt', 'Tiếng Trung', 'Tiếng Nga', 'Tiếng Pháp'];

  // Xử lý thay đổi thông tin sản phẩm
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  // Xử lý thêm ảnh
  const handleAddImages = () => {
    if (!newImagePaths) {
      setError('Vui lòng nhập ít nhất một đường dẫn ảnh');
      return;
    }
    const paths = newImagePaths.split(',').map((path) => path.trim()).filter((path) => path);
    if (paths.length === 0) {
      setError('Vui lòng nhập đường dẫn ảnh hợp lệ');
      return;
    }
    setImages((prev) => [...prev, ...paths.map((path) => ({ imagePath: path }))]);
    setNewImagePaths('');
    setError('');
  };

  // Xử lý xóa ảnh
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Kiểm tra dữ liệu hợp lệ
  const isValid = () => {
    return (
      product.name &&
      product.price &&
      product.quantity &&
      product.author &&
      product.category &&
      product.description &&
      product.content &&
      product.language &&
      parseFloat(product.price) > 0 &&
      parseInt(product.quantity) >= 0
    );
  };

  // Mở modal xác nhận
  const handleOpenConfirmDialog = (e) => {
    e.preventDefault();
    if (!isValid()) {
      setError('Vui lòng điền đầy đủ thông tin sản phẩm');
      return;
    }
    setOpenConfirmDialog(true);
  };

  // Đóng modal xác nhận
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    const productData = {
      name: product.name,
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity),
      dateAdded: new Date().toISOString(),
      author: product.author,
      category: product.category,
      description: product.description,
      content: product.content,
      language: product.language,
      status: product.status,
    };

    try {
      // Thêm sản phẩm
      const productResponse = await fetch('http://localhost:6868/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const savedProduct = await productResponse.json();

      // Thêm ảnh
      for (const image of images) {
        const imageData = {
          imagePath: image.imagePath,
          product: { id: savedProduct.id },
        };
        await fetch('http://localhost:6868/api/product/images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(imageData),
        });
      }

      setOpenConfirmDialog(false);
      navigate('/admin/product');
    } catch (err) {
      setError('Lỗi khi thêm sản phẩm');
      console.error('Error:', err);
      setOpenConfirmDialog(false);
    }
  };

  return (
    <Box sx={{ mt: 2, px: { xs: 2, sm: 4 }, maxWidth: '1200px', mx: 'auto' }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#1a2820',
          letterSpacing: '0.5px',
        }}
      >
        THÊM SẢN PHẨM MỚI
      </Typography>
      <Paper
        sx={{
          p: 4,
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box component="form" onSubmit={handleOpenConfirmDialog}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '8px',
                bgcolor: 'error.light',
                color: 'error.main',
                '& .MuiAlert-icon': {
                  color: 'error.main',
                },
              }}
            >
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Cột trái */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên sản phẩm"
                name="name"
                value={product.name}
                onChange={handleChange}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
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
                label="Giá (VNĐ)"
                name="price"
                type="number"
                value={product.price}
                onChange={handleChange}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
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
                label="Số lượng"
                name="quantity"
                type="number"
                value={product.quantity}
                onChange={handleChange}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
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
                label="Tác giả"
                name="author"
                value={product.author}
                onChange={handleChange}
                margin="normal"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
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
              <FormControl fullWidth margin="normal" required>
                <InputLabel
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 'medium',
                    '&.Mui-focused': {
                      color: 'primary.main',
                    },
                  }}
                >
                  Thể loại
                </InputLabel>
                <Select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  sx={{
                    borderRadius: '8px',
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
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Cột phải */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                value={product.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
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
                label="Nội dung"
                name="content"
                value={product.content}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
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
              <FormControl fullWidth margin="normal" required>
                <InputLabel
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 'medium',
                    '&.Mui-focused': {
                      color: 'primary.main',
                    },
                  }}
                >
                  Ngôn ngữ
                </InputLabel>
                <Select
                  name="language"
                  value={product.language}
                  onChange={handleChange}
                  sx={{
                    borderRadius: '8px',
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
                  {languages.map((language) => (
                    <MenuItem key={language} value={language}>
                      {language}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    name="status"
                    checked={product.status}
                    onChange={handleChange}
                    sx={{
                      color: 'primary.main',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label="Còn bán"
                sx={{
                  mt: 2,
                  color: 'text.secondary',
                  fontWeight: 'medium',
                }}
              />
            </Grid>
          </Grid>

          {/* Quản lý ảnh */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                color: '#1a2820',
                mb: 2,
              }}
            >
              THÊM ẢNH SẢN PHẨM
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                label="Nhấn nút Add sau khi thêm link ảnh"
                value={newImagePaths}
                onChange={(e) => setNewImagePaths(e.target.value)}
                helperText="Nhập nhiều đường dẫn bằng cách Add mỗi khi thêm link ảnh mới"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
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
                  '& .MuiFormHelperText-root': {
                    color: 'text.secondary',
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleAddImages}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 'medium',
                  px: 3,
                  py: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Add
              </Button>
            </Box>
            {images.length > 0 && (
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
                      <TableCell>Ảnh</TableCell>
                      <TableCell>Đường dẫn ảnh</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {images.map((image, index) => (
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
                        <TableCell>
                          <img
                            src={image.imagePath}
                            alt="preview"
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: 'cover',
                              borderRadius: '8px',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            }}
                          />
                        </TableCell>
                        <TableCell>{image.imagePath}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleRemoveImage(index)}
                            sx={{
                              borderRadius: '8px',
                              textTransform: 'none',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                              '&:hover': {
                                bgcolor: 'error.dark',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                              },
                            }}
                          >
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
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
              Thêm
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/product')}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 'medium',
                px: 4,
                py: 1,
                borderColor: 'grey.400',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'grey.100',
                  borderColor: 'grey.500',
                },
              }}
            >
              Hủy
            </Button>
          </Box>
        </Box>

        {/* Modal xác nhận */}
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
          PaperProps={{
            sx: {
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
              borderBottom: '1px solid',
              borderColor: 'grey.200',
              py: 2,
            }}
          >
            Xác nhận thêm sản phẩm
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <DialogContentText sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
              Bạn có chắc muốn thêm sản phẩm này?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button
              onClick={handleCloseConfirmDialog}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 'medium',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  bgcolor: 'primary.dark',
                },
              }}
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

export default AddProduct;