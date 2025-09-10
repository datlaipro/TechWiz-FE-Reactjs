import React from "react";
import { Box, Container, Typography, Grid, Link } from "@mui/material";

const FooterBottom = () => {
  return (
    <Box
      id="footer-bottom"
      sx={{
        // py: 2,
        paddingBottom:3,
        borderTop: "1px solid #e0e0e0",
        backgroundColor: "#fff",
        width: '100%' // Đảm bảo Box chiếm 100% chiều rộng
      }}
    >
      {/* <Container sx={{ width: { xs: '90%', md: '80%' }, margin: 'auto' }}> */}
        <Grid
        sx={{ width: { xs: '90%', md: '85%' }, margin: 'auto' }}
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        //   sx={{ textAlign: 'left' }}
        >
          {/* Shipping and Payment Section */}
          <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Box
              display="flex"
              flexWrap="wrap"
              gap={4}
              sx={{
                alignItems: "center",
              }}
            >
              {/* Shipping Info */}
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body1" color="textSecondary">We ship with:</Typography>
                <Box display="flex" gap={1}>
                  <img
                    src="/demo/images/dhl.png"
                    alt="dhl"
                    style={{ height: "24px" }}
                  />
                  <img
                    src="/demo/images/shippingcard.png"
                    alt="shipping"
                    style={{ height: "24px" }}
                  />
                </Box>
              </Box>

              {/* Payment Methods */}
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body1" color="textSecondary">Payment options:</Typography>
                <Box display="flex" gap={1}>
                  <img
                    src="/demo/images/visa.jpg"
                    alt="visa"
                    style={{ height: "24px" }}
                  />
                  <img
                    src="/demo/images/mastercard.jpg"
                    alt="mastercard"
                    style={{ height: "24px" }}
                  />
                  <img
                    src="/demo/images/paypal.jpg"
                    alt="paypal"
                    style={{ height: "24px" }}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Copyright Section */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography
              variant="body2"
              textAlign={{ xs: "center", md: "right" }}
              color="textSecondary"
            >
              © Copyright 2024 Book Shop. Product demo by{" "}
              <Link
                href="#"
                target="_blank"
                underline="hover"
              >
                Group 1 - T2406E
              </Link>
            </Typography>
          </Grid>
        </Grid>
      {/* </Container> */}
    </Box>
  );
};

export default FooterBottom;
