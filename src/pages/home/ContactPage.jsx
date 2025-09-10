import React from "react";
import { Box, Grid, Typography, TextField, Button, Link } from "@mui/material";
import LatestPosts from "../../components/display/post/LatestPosts";
import InstagramGallery from "../../components/display/GroupItems/InstagramGallery";
import BreadcrumbsComponent from '../../components/display/free/BreadcrumbsComponent';

const ContactUs = () => {
  return (
    <Box py={6} px={3} sx={{ width: "80%", margin: "auto", justifyContent: "center" }}>
      <Grid container spacing={4}>
        {/* Contact Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Contact Info
          </Typography>
          <Typography mb={3} variant="h6">
            Tortor dignissim convallis aenean et tortor at risus viverra adipiscing.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Office</Typography>
              <Typography>36 Le Lai, Quan 1, HCM</Typography>
              <Typography sx={{color: '#677d72' }}>
                <Link href="#" sx={{ color: 'inherit', textDecoration: 'none' }}>+123 987 321</Link>
              </Typography>
              <Typography sx={{color: '#677d72' }}>
                <Link href="#" sx={{ color: 'inherit', textDecoration: 'none' }}>+123 123 654</Link>
              </Typography>
              <Typography sx={{color: '#677d72' }}>
                <Link href="#" sx={{ color: 'inherit', textDecoration: 'none' }}>info@bookly.com</Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Management</Typography>
              <Typography>730 Giang Vo, Ba Dinh, HN</Typography>
              <Typography sx={{color: '#677d72' }}>
                <Link href="#" sx={{ color: 'inherit', textDecoration: 'none' }}>+123 987 321</Link>
              </Typography>
              <Typography sx={{color: '#677d72' }}>
                <Link href="#" sx={{ color: 'inherit', textDecoration: 'none' }}>+123 123 654</Link>
              </Typography>
              <Typography sx={{color: '#677d72' }}>
                <Link href="#" sx={{ color: 'inherit', textDecoration: 'none' }}>admin@bookly.com</Link>
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Any Questions?
          </Typography>
          <Typography mb={3}>Use the form below to get in touch with us.</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Your Name" required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Your Email" required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Phone Number" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Subject" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={4} label="Message" required />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              {/* <Button variant="contained" color="primary" fullWidth>
                Submit
              </Button> */}
              <Button
              variant="contained"
                sx={{
                  backgroundColor: "#F86D72",
                  fontWeight: 'bold', p: 2,
                  fontSize: '20px',
                  borderRadius: 20,
                  padding: "10px 50px",
                  color: "white", '&:hover': { backgroundColor: "#193710" }
                }}
              >
                Submit
              </Button>

            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

const OurStores = () => {
  const stores = [
    { country: "VietNam", address: "09 Le Van Huu, Hai Ba Trung, HN", phone: "+123 666 777 88" },
    { country: "USA", address: "730 Glenstone Ave 65802, US", phone: "+123 666 777 88" },
    { country: "France", address: "13 Rue Montmartre 75001, Paris, France", phone: "+123 222 333 44" },
    { country: "China", address: "22 Juan Street, Beijing, China", phone: "+123 222 333 44" },
  ];
  return (
    <Box py={6} px={3} sx={{ width: "80%", margin: "auto", justifyContent: "center" }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box component="img" src="/demo/images/single-image2.jpg" width="100%" borderRadius={2} />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            Our Stores
          </Typography>
          <Typography mb={3}>You can also directly buy products from our stores.</Typography>
          <Grid container spacing={3}>
            {stores.map((store, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Typography variant="h6">{store.country}</Typography>
                <Typography>{store.address}</Typography>
                <Typography sx={{ color: '#677d72' }}>
                  <Link href="#" sx={{ color: 'inherit', textDecoration: 'none' }}>{store.phone}</Link>
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

const ContactPage = () => {
  return (
    <>
      <BreadcrumbsComponent
        title="Contact"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
          { label: "Contact" },
        ]}
      />
      <ContactUs />
      <OurStores />
      <LatestPosts />
      <InstagramGallery />
    </>
  );
};

export default ContactPage;
