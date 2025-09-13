import React from "react";
import { Box, Typography } from "@mui/material";
import InstagramItem from "../free/InstagramItem";
import Grid from "@mui/material/Grid";
// import Grid from "@mui/material/Grid2";

const InstagramGallery = () => {
  const instagramItems = [
    { image: "https://cdn2.tuoitre.vn/thumb_w/640/471584752817336320/2025/4/23/truong-dai-hoc-sai-gon-17454525370672073466598.jpg", link: "#" },
    { image: "https://cdn2.tuoitre.vn/thumb_w/640/471584752817336320/2025/4/23/truong-dai-hoc-sai-gon-17454525370672073466598.jpg", link: "#" },
    { image: "https://cdn2.tuoitre.vn/thumb_w/640/471584752817336320/2025/4/23/truong-dai-hoc-sai-gon-17454525370672073466598.jpg", link: "#" },
    { image: "https://cdn2.tuoitre.vn/thumb_w/640/471584752817336320/2025/4/23/truong-dai-hoc-sai-gon-17454525370672073466598.jpg", link: "#" },
    { image: "https://cdn2.tuoitre.vn/thumb_w/640/471584752817336320/2025/4/23/truong-dai-hoc-sai-gon-17454525370672073466598.jpg", link: "#" },
    { image: "https://cdn2.tuoitre.vn/thumb_w/640/471584752817336320/2025/4/23/truong-dai-hoc-sai-gon-17454525370672073466598.jpg", link: "#" },
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
