import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const BuyDone = ({ open }) => {
  const navigate = useNavigate();

  const handleOk = () => {
    navigate('/');
  };

  return (
    <Modal
      open={open}
      aria-labelledby="payment-success"
      aria-describedby="payment-success-description"
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2" mb={2}>
          BẠN ĐÃ THANH TOÁN THÀNH CÔNG ĐƠN HÀNG
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleOk}>
            OK
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BuyDone;
