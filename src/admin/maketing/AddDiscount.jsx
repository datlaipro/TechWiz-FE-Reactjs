import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Grid,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';

function AddDiscount() {
  const navigate = useNavigate();
  const [discount, setDiscount] = useState({
    dateStart: '',
    dateEnd: '',
    discountProducts: [],
  });
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:6868/api/product');
        const productList = response.data.map((p) => ({
          id: p.id,
          name: p.name,
          stock: p.quantity,
          originalPrice: p.price,
        }));
        if (productList.length === 0) {
          setError('Không có sản phẩm để tạo chương trình khuyến mại');
        }
        setProducts(productList);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách sản phẩm');
        console.error('Lỗi khi lấy sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDiscount((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleProductChange = (event, newValues) => {
    const updatedProducts = newValues.map((newValue) => {
      const existingProduct = discount.discountProducts.find((p) => p.id === newValue.id);
      return existingProduct || { ...newValue, salePrice: '', quantity: '' };
    });
    setDiscount((prev) => ({ ...prev, discountProducts: updatedProducts }));
    setError('');
  };

  const handleProductDetailChange = (id, field, value) => {
    setDiscount((prev) => {
      const newProducts = prev.discountProducts.map((product) => {
        if (product.id === id) {
          if (field === 'quantity') {
            const quantity = parseInt(value) || 0;
            if (quantity > product.stock) {
              setError(`Số lượng không được vượt quá tồn kho (${product.stock})`);
              return { ...product, quantity: product.stock.toString() };
            }
          }
          if (field === 'salePrice') {
            const salePrice = parseFloat(value) || 0;
            if (salePrice > product.originalPrice) {
              setError(
                `Giá khuyến mại không được vượt quá giá gốc (${product.originalPrice.toLocaleString()} VNĐ)`
              );
              return { ...product, salePrice: product.originalPrice.toString() };
            }
          }
          return { ...product, [field]: value };
        }
        return product;
      });
      return { ...prev, discountProducts: newProducts };
    });
  };

  const handleRemoveProduct = (id) => {
    setDiscount((prev) => ({
      ...prev,
      discountProducts: prev.discountProducts.filter((p) => p.id !== id),
    }));
    setError('');
  };

  const isDateValid = () => {
    if (!discount.dateStart || !discount.dateEnd) return false;
    const start = new Date(discount.dateStart);
    const end = new Date(discount.dateEnd);
    return end >= start;
  };

  const isProductsValid = () => {
    return (
      discount.discountProducts.length > 0 &&
      discount.discountProducts.every(
        (p) => p.salePrice !== '' && p.quantity !== '' && parseInt(p.quantity) > 0
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isDateValid()) {
      setError('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu');
      return;
    }

    if (!isProductsValid()) {
      setError('Vui lòng chọn ít nhất một sản phẩm và điền đầy đủ giá, số lượng khuyến mại');
      return;
    }

    const discountData = {
      dateCreate: new Date().toISOString().split('T')[0],
      dateStart: discount.dateStart,
      dateEnd: discount.dateEnd,
      discountProducts: discount.discountProducts.map((p) => ({
        productId: p.id,
        salePrice: parseFloat(p.salePrice),
        quantity: parseInt(p.quantity),
      })),
    };

    try {
      await axios.post('http://localhost:6868/api/discounts', discountData);
      navigate('/admin/discount');
    } catch (err) {
      setError(err.message || 'Lỗi khi tạo mã giảm giá');
      console.error('Lỗi khi tạo mã giảm giá:', err);
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
            textAlign: 'center',
          }}
        >
          Đang tải...
        </Typography>
      </Box>
    );
  }

  if (error && products.length === 0) {
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
          onClick={() => navigate('/admin/discount')}
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
          Quay lại
        </Button>
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
        THÊM CHƯƠNG TRÌNH KHUYẾN MẠI
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
                borderRadius: '8px',
                mb: 2,
              }}
            >
              {error}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày bắt đầu"
                name="dateStart"
                type="date"
                value={discount.dateStart}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                required
                sx={{
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày kết thúc"
                name="dateEnd"
                type="date"
                value={discount.dateEnd}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                required
                sx={{
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

          <Autocomplete
            multiple
            options={products}
            getOptionLabel={(option) => `${option.id} - ${option.name}`}
            filterOptions={(options, { inputValue }) => {
              const input = inputValue.toLowerCase();
              return options.filter(
                (option) =>
                  option.name.toLowerCase().includes(input) ||
                  option.id.toString().includes(input)
              );
            }}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                sx={{
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'grey.50',
                    transition: 'background-color 0.2s',
                  },
                }}
              >
                {option.id} - {option.name} (Tồn kho: {option.stock}, Giá gốc:{' '}
                {option.originalPrice.toLocaleString()} VNĐ)
              </Box>
            )}
            onChange={handleProductChange}
            value={discount.discountProducts}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn sản phẩm"
                placeholder="Gõ ID hoặc tên sản phẩm"
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
            )}
            fullWidth
            PaperComponent={({ children }) => (
              <Paper
                sx={{
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
              >
                {children}
              </Paper>
            )}
          />

          {discount.discountProducts.length > 0 && (
            <TableContainer
              sx={{
                mt: 3,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'grey.200',
                overflow: 'hidden',
              }}
            >
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: 'grey.100',
                      '& th': {
                        fontWeight: 'bold',
                        color: 'text.primary',
                        py: 1.5,
                        borderBottom: '2px solid',
                        borderColor: 'grey.300',
                      },
                    }}
                  >
                    <TableCell>ID</TableCell>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Tồn kho</TableCell>
                    <TableCell>Giá gốc (VNĐ)</TableCell>
                    <TableCell>Giá khuyến mại (VNĐ)</TableCell>
                    <TableCell>Số lượng khuyến mại</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {discount.discountProducts.map((product) => (
                    <TableRow
                      key={product.id}
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
                      <TableCell>{product.id}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.originalPrice.toLocaleString()}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={product.salePrice}
                          onChange={(e) =>
                            handleProductDetailChange(product.id, 'salePrice', e.target.value)
                          }
                          size="small"
                          required
                          inputProps={{ min: 0, max: product.originalPrice }}
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
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={product.quantity}
                          onChange={(e) =>
                            handleProductDetailChange(product.id, 'quantity', e.target.value)
                          }
                          size="small"
                          required
                          inputProps={{ min: 0, max: product.stock }}
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
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveProduct(product.id)}
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={discount.discountProducts.length === 0}
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
                '&.Mui-disabled': {
                  bgcolor: 'grey.300',
                  color: 'grey.600',
                },
              }}
            >
              Lưu
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/discount')}
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

export default AddDiscount;