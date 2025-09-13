import React from "react";
import { Box, Container, Grid, Typography, Link } from "@mui/material";
import FooterColumn from "./FooterColumn";
import SocialLinks from "./SocialLinks";

const Footer = () => {
  return (
    // <Box id="footer" sx={{ py: 6, backgroundColor: "#f9f9f9" }}>
    <Box id="footer" sx={{ py: 2, backgroundColor: "#fff" }}>
      {/* <Container sx={{ width: { xs: '90%', md: '90%', lg: '95%' }, margin: 'auto' }}>  SỬ DỤNG KHỐI CONTAINER NÀY LÀ THỪA */}
        <Grid container spacing={6} sx={{ width: { xs: '90%', md: '85%', lg: '85%' }, margin: 'auto' }}>
          <Grid item xs={12} sm={6} md={4}>
            {/* <Box> */}
            <Box sx={{ textAlign: 'left' }}> {/* Căn lề trái */}
              <img
                src="https://pub-3d10e52fdf5d49fba5f48198b8864aa8.r2.dev/post/TECHWIZ%20LOGO.png"
                alt="logo"
                style={{ width: "150px", marginBottom: "16px" }}
              />
              <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
              Event information system applying AI and Blockchain technology. Ensuring perfect operation.
              </Typography>
              <SocialLinks />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FooterColumn
              title="Quick Links"
              items={[
                { label: "Home", link: "#" },
                { label: "About", link: "#" },
                { label: "Event", link: "#" },
                { label: "Blogs", link: "#" },
                { label: "Contact", link: "#" },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FooterColumn
              title="Help & Info"
              items={[
                { label: "Track Your Event", link: "#" },
                { label: "Policies", link: "#" },
                { label: "Responsibilities", link: "#" },
                { label: "Contact Us", link: "#" },
                { label: "FAQs", link: "#" },
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FooterColumn sx={{ textAlign: 'right' }}
              title="Contact Us"
              items={
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Do you have any queries or suggestions?{" "}
                    <Link href="mailto:info@event.com" underline="none" color="textPrimary">
                      info@event.com
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                    If you need support? Just give us a call.{" "}
                    <Link href="tel:+5511122233344" underline="none" color="textPrimary">
                      +88 111 222 333 44
                    </Link>
                  </Typography>
                </Box>
              }
            />
          </Grid>
        </Grid>
    </Box>
  );
};

export default Footer;
