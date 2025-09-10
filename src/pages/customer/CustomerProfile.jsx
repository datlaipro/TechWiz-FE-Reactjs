import React from "react";
import {
  Avatar,
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";
import PaginationComponent from '../../components/display/free/PaginationComponent';
import InstagramGallery from "../../components/display/GroupItems/InstagramGallery";
import BreadcrumbsComponent from '../../components/display/free/BreadcrumbsComponent';

const customer = {
  name: "Nguyen Van A",
  age: 30,
  phone: "0123-456-789",
  email: "nguyenvana@example.com",
  address: "123 Đường ABC, Quận 1, TP.HCM",
  avatar: "https://via.placeholder.com/150",
};

const orders = [
  {
    id: "#12345",
    date: "2025-02-10",
    total: 2400,
    products: [
      {
        name: "The Emerald Crown",
        image: "/demo/images/product-item3.png",
        price: 2000,
        quantity: 1,
      },
      {
        name: "The Last Enchantment",
        image: "/demo/images/product-item1.png",
        price: 400,
        quantity: 1,
      },
    ],
  },
  {
    id: "#67890",
    date: "2025-02-05",
    total: 1500,
    products: [
      {
        name: "The Ruby Ring",
        image: "/demo/images/product-item3.png",
        price: 1500,
        quantity: 1,
      },
    ],
  },
];

const CustomerProfile = () => {
  return (
    <>
      <BreadcrumbsComponent
        title="Customer Profile"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Customer" },
        ]}
        sx={{
          mb: 3,
          '& .MuiBreadcrumbs-li': {
            color: 'text.secondary',
          },
        }}
      />
      <Container maxWidth="lg">
        {/* Thông tin customer */}
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'center', sm: 'center' }}
          gap={3}
          mt={5}
          px={{ xs: 2, sm: 4 }}
          maxWidth="1400px"
          mx="auto"
        >
          <Avatar
            src={customer.avatar}
            sx={{
              width: 100,
              height: 100,
              border: '2px solid',
              borderColor: 'grey.200',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: '#1a2820',
                letterSpacing: '0.5px',
                mb: 1,
              }}
            >
              {customer.name}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', mb: 0.5 }}
            >
              Birthday: {customer.age}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', mb: 0.5 }}
            >
              Phone Number: {customer.phone}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', mb: 0.5 }}
            >
              Email: {customer.email}
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary' }}
            >
              Address: {customer.address}
            </Typography>
          </Box>
        </Box>

        {/* Danh sách đơn hàng */}
        <Box px={{ xs: 2, sm: 4 }} maxWidth="1400px" mx="auto">
          <Typography
            variant="h5"
            mt={5}
            mb={2}
            sx={{
              fontWeight: 'bold',
              color: '#1a2820',
              letterSpacing: '0.5px',
            }}
          >
            Đơn hàng đã mua
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'grey.200',
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
                  <TableCell>Mã đơn</TableCell>
                  <TableCell>Ngày mua</TableCell>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
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
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      {order.products.map((product, index) => (
                        <Stack
                          direction="row"
                          spacing={2}
                          key={index}
                          alignItems="center"
                          mt={1}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            width={50}
                            style={{
                              borderRadius: 8,
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            }}
                          />
                          <Box>
                            <Typography variant="body1">
                              {product.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: 'text.secondary' }}
                            >
                              {product.quantity} x ${product.price}
                            </Typography>
                          </Box>
                        </Stack>
                      ))}
                    </TableCell>
                    <TableCell>${order.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
      <PaginationComponent
        sx={{
          mt: 4,
          mb: 4,
          display: 'flex',
          justifyContent: 'center',
          '& .MuiPaginationItem-root': {
            borderRadius: '8px',
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'grey.50',
            },
          },
        }}
      />
      <InstagramGallery sx={{ mt: 5 }} />
    </>
  );
};

export default CustomerProfile;