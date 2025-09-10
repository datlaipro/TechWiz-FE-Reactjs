import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from '@mui/material';
import axios from 'axios';

// Danh sách vai trò có thể chọn (bỏ Moderator)
const roleOptions = ['ROLE_ADMIN', 'ROLE_USER'];

function CreateUser() {
  const navigate = useNavigate();

  // State cho thông tin người dùng
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    birthDay: '',
    gender: '',
    avatar: '',
    roles: [],
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  // Xử lý thay đổi confirmPassword
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError('');
    setSuccess('');
  };

  // Xử lý thay đổi roles
  const handleRolesChange = (e) => {
    setUser((prev) => ({ ...prev, roles: e.target.value }));
    setError('');
    setSuccess('');
  };

  // Kiểm tra dữ liệu hợp lệ
  const isValid = () => {
    if (
      user.fullName.trim() === '' ||
      user.email.trim() === '' ||
      user.phoneNumber.trim() === '' ||
      user.address.trim() === '' ||
      user.birthDay === '' ||
      user.gender === '' ||
      user.roles.length === 0 ||
      user.password.trim() === ''
    ) {
      return false;
    }
    if (user.password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp.');
      return false;
    }
    return true;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid()) {
      if (!error) setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const userData = {
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      birthDay: user.birthDay,
      gender: user.gender,
      avatar: user.avatar || 'https://via.placeholder.com/40',
      roles: user.roles.join(','), // Chuyển mảng thành chuỗi
      password: user.password,
    };

    try {
      const response = await axios.post('http://localhost:6868/api/user', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Tạo người dùng thành công:', response.data);
      setSuccess('Tạo người dùng thành công!');
      setTimeout(() => navigate('/admin/user'), 2000); // Chuyển hướng sau 2 giây
    } catch (err) {
      setError('Lỗi khi tạo người dùng: ' + (err.response?.data || err.message));
      console.error('Lỗi:', err);
    }
  };

  // Style chung cho TextField và Select
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
        THÊM NGƯỜI DÙNG MỚI
      </Typography>
      <Paper
        sx={{
          p: 3,
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          {/* Hiển thị thông báo */}
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
            {/* Cột trái: fullName, email, phoneNumber, birthDay, address */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Họ và tên"
                name="fullName"
                value={user.fullName}
                onChange={handleChange}
                required
                sx={inputStyle}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                required
                sx={inputStyle}
              />
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phoneNumber"
                value={user.phoneNumber}
                onChange={handleChange}
                required
                sx={inputStyle}
              />
              <TextField
                fullWidth
                label="Ngày sinh"
                name="birthDay"
                type="date"
                value={user.birthDay}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                sx={inputStyle}
              />
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={user.address}
                onChange={handleChange}
                required
                sx={inputStyle}
              />
            </Grid>
            {/* Cột phải: gender, avatar, password, confirmPassword, roles */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ ...inputStyle, mb: 2 }} required>
                <InputLabel
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 'medium',
                    '&.Mui-focused': {
                      color: 'primary.main',
                    },
                  }}
                >
                  Giới tính
                </InputLabel>
                <Select
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                  sx={{
                    borderRadius: '12px',
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
                  <MenuItem value="MALE">Nam</MenuItem>
                  <MenuItem value="FEMALE">Nữ</MenuItem>
                  <MenuItem value="OTHER">Khác</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="URL Avatar"
                name="avatar"
                value={user.avatar}
                onChange={handleChange}
                sx={inputStyle}
              />
              <TextField
                fullWidth
                label="Mật khẩu"
                name="password"
                type="password"
                value={user.password}
                onChange={handleChange}
                required
                sx={inputStyle}
              />
              <TextField
                fullWidth
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                required
                sx={inputStyle}
              />
              <FormControl fullWidth sx={{ ...inputStyle, mb: 2 }} required>
                <InputLabel
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 'medium',
                    '&.Mui-focused': {
                      color: 'primary.main',
                    },
                  }}
                >
                  Vai trò
                </InputLabel>
                <Select
                  multiple
                  name="roles"
                  value={user.roles}
                  onChange={handleRolesChange}
                  sx={{
                    borderRadius: '12px',
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
                  {roleOptions.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role.replace('ROLE_', '')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Nút submit */}
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
              onClick={() => navigate('/admin/user')}
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

export default CreateUser;