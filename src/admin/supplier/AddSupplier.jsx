import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
} from '@mui/material';
import axios from 'axios';

function AddSupplier() {
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const isValid = () => {
    // Kiểm tra tất cả trường không rỗng
    if (
      supplier.name.trim() === '' ||
      supplier.address.trim() === '' ||
      supplier.phoneNumber.trim() === '' ||
      supplier.email.trim() === ''
    ) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return false;
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supplier.email)) {
      setError('Email không hợp lệ.');
      return false;
    }

    // Kiểm tra định dạng phoneNumber (chỉ 10 chữ số)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(supplier.phoneNumber)) {
      setError('Số điện thoại không hợp lệ. Phải có đúng 10 chữ số (ví dụ: 0901234567).');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid()) {
      return;
    }

    // Thêm mã quốc gia +84 để tương thích với backend
    const supplierData = {
      name: supplier.name,
      address: supplier.address,
      phoneNumber: `+84${supplier.phoneNumber}`,
      email: supplier.email,
    };

    try {
      const response = await axios.post('http://localhost:6868/api/supplier', supplierData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Thêm supplier response:', response.data); // Debug
      setSuccess('Thêm nhà cung cấp thành công!');
      setError('');
      setTimeout(() => navigate('/admin/supplier'), 1000); // Chuyển hướng sau 2 giây
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data || err.message;
      setError('Lỗi khi thêm nhà cung cấp: ' + errorMessage);
      console.error('Lỗi:', err);
    }
  };

  const inputStyle = {
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
        THÊM NHÀ CUNG CẤP MỚI
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
            <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: '8px' }}>
              {success}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên"
                name="name"
                value={supplier.name}
                onChange={handleChange}
                required
                sx={inputStyle}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={supplier.email}
                onChange={handleChange}
                required
                sx={inputStyle}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={supplier.address}
                onChange={handleChange}
                required
                sx={inputStyle}
              />
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phoneNumber"
                value={supplier.phoneNumber}
                onChange={handleChange}
                required
                placeholder="+84901234567"
                sx={inputStyle}
              />
            </Grid>
          </Grid>
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
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  bgcolor: 'primary.dark',
                },
              }}
            >
              Thêm
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/supplier')}
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

export default AddSupplier;