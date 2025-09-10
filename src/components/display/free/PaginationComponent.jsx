import React from 'react';
import { Pagination, Box } from '@mui/material';

const PaginationComponent = ({ page, totalPages, onPageChange }) => {
  const handleChange = (event, value) => {
    onPageChange(value - 1); // MUI Pagination bắt đầu từ 1, frontend dùng 0-based
  };

  if (totalPages <= 1) {
    return null; // Không hiển thị phân trang nếu chỉ có 1 trang
  }

  return (
    <Box display="flex" justifyContent="center" sx={{ padding: '2rem 0' }}>
      <Pagination
        count={totalPages}
        page={page + 1} // Chuyển page từ 0-based sang 1-based
        onChange={handleChange}
        color="primary"
        sx={{
          '& .MuiPaginationItem-root': {
            fontSize: '1rem',
            fontWeight: 'medium',
          },
          '& .Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          },
        }}
      />
    </Box>
  );
};

export default PaginationComponent;