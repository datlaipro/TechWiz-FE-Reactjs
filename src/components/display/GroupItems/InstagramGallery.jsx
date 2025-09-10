import React from "react";
import { Box, Typography } from "@mui/material";
import InstagramItem from "../free/InstagramItem";
import Grid from "@mui/material/Grid";
// import Grid from "@mui/material/Grid2";

const InstagramGallery = () => {
  const instagramItems = [
    { image: "/demo/images/insta-item1.jpg", link: "#" },
    { image: "/demo/images/insta-item2.jpg", link: "#" },
    { image: "/demo/images/insta-item3.jpg", link: "#" },
    { image: "/demo/images/insta-item4.jpg", link: "#" },
    { image: "/demo/images/insta-item5.jpg", link: "#" },
    { image: "/demo/images/insta-item6.jpg", link: "#" },
  ];

  return (
    <Box id="instagram" sx={{ py: 6 , width: "80%", backgroundColor: "#fff", justifyContent: "center", margin: "auto" }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" component="h3" sx={{ fontWeight: "bold" }}> {/*// CÓ THỂ ĐỂ CHỮ KHÔNG VIẾT HOA*/}
          Instagram
        </Typography>
      </Box>
      <Grid container spacing={3} >
        {instagramItems.map((item, index) => (
          <Grid item xs={12} sm={4} md={4} lg={2} key={index}>
            <InstagramItem image={item.image} link={item.link}
            // sx={{ minWidth: 250, minHeight: 250 }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InstagramGallery;
