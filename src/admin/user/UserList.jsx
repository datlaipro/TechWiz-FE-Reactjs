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
  CircularProgress,
  Alert,
} from '@mui/material';
import axios from 'axios';

function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy token từ localStorage hoặc context
  const token = localStorage.getItem('jwtToken'); // Điều chỉnh theo cách bạn lưu token

  // Lấy danh sách người dùng từ backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:6868/api/user', {
          params: {
            page: page,
            size: rowsPerPage,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.content || response.data); // Điều chỉnh theo cấu trúc phản hồi
        setTotalUsers(response.data.totalElements || response.data.length);
        console.log('Fetched users:', response.data);
      } catch (err) {
        setError('Lỗi khi lấy danh sách người dùng: ' + (err.response?.data || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page, rowsPerPage, token]);

  // Xử lý xóa người dùng
  const handleDeleteUser = async (userId) => {
    if (window.confirm(`Bạn có chắc muốn xóa người dùng ID ${userId}?`)) {
      try {
        await axios.delete(`http://localhost:6868/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.filter((user) => user.id !== userId));
        setTotalUsers(totalUsers - 1);
      } catch (err) {
        setError('Lỗi khi xóa người dùng: ' + (err.response?.data || err.message));
      }
    }
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/edit-user/${userId}`);
  };

  const handleAddUser = () => {
    navigate('/admin/create-user');
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
          DANH SÁCH NGƯỜI DÙNG
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddUser}
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
          Thêm người dùng
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
            <Table sx={{ minWidth: 650 }} aria-label="user table">
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
                  <TableCell>Email</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Giới tính</TableCell>
                  <TableCell>Ảnh đại diện</TableCell>
                  <TableCell>Vai trò</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow
                      key={user.id}
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
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>{user.gender || 'Chưa xác định'}</TableCell>
                      <TableCell>
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt="Avatar"
                            style={{ width: 40, height: 40, borderRadius: '50%' }}
                          />
                        ) : (
                          'Chưa có'
                        )}
                      </TableCell>
                      <TableCell>{user.roles?.split(',').join(', ') || 'ROLE_USER'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => handleEditUser(user.id)}
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
                            onClick={() => handleDeleteUser(user.id)}
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
                      colSpan={8}
                      align="center"
                      sx={{
                        py: 2,
                        color: 'text.secondary',
                        fontWeight: 'medium',
                      }}
                    >
                      Không có người dùng nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[6, 12, 24]}
            component="div"
            count={totalUsers}
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

export default UserList;

