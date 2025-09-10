import React from "react";
import { Box, Container, Typography, Card, CardMedia, Link } from "@mui/material";
import Grid from "@mui/material/Grid2";

const CategoriesSection = () => {
  const categories = [
    { title: "Romance", image: "/demo/images/category1.jpg", link: "/shop" },
    { title: "Language", image: "/demo/images/category2.jpg", link: "/shop" },
    { title: "Literature", image: "/demo/images/category3.jpg", link: "/shop" },
  ];

  return (
<Box id="categories" sx={{ py: 4, pt: 0, width: "100%" }}>
  <Container
    maxWidth="xl" // Đảm bảo Container dùng chung cho cả Box và Grid
    sx={{
      padding: "0 24px", // Padding cho toàn bộ nội dung
    }}
  >
    {/* Section Title */}
    <Box
      mb={4}
      sx={{
        overflow: "hidden",
        width: "100%", // Đảm bảo tiêu đề rộng bằng Grid
      }}
    >
      <Typography
        variant="h4"
        component="h3"
        sx={{
            fontSize: "39px",
        //   fontWeight: "bold",
        //   display: "flex",
        //   alignItems: "center",
        //   textAlign: "center", // Canh giữa tiêu đề
        // ml: 15, // Canh lề trái
        }}
      >
        Categories
      </Typography>
    </Box>

    {/* Category Cards */}
    <Grid container spacing={8} sx={{ justifyContent: "center", alignItems: "center" }}>
      {categories.map((category, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card
            sx={{
              mb: 4,
              border: "none",
              borderRadius: 3,
              position: "relative",
              boxShadow: "none",
            }}
          >
            <Link href={category.link} underline="none">
              <CardMedia
                component="img"
                src={category.image}
                alt={category.title}
                sx={{
                  borderRadius: 3,
                  width: "100%",
                  height: "230px", // Chiều cao cố định
                  objectFit: "cover", // Ảnh tự động thu nhỏ mà không bị cắt
                  maxWidth: "450px", // Đảm bảo chiều rộng không vượt quá 450px
                  margin: "0 auto", // Căn giữa hình ảnh
                }}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  position: "absolute", // Định vị tuyệt đối
                  bottom: 0,
                  bgcolor: "#F86D72",
                  color: "white",
                  m: 3, // Margin xung quanh chữ
                  py: 1, // Padding theo chiều dọc
                  px: 2, // Padding theo chiều ngang
                  borderRadius: 2,
                }}
              >
                <Link href={category.link} color="inherit" underline="none">
                  {category.title}
                </Link>
              </Typography>
            </Link>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
</Box>

  );
};

export default CategoriesSection;
