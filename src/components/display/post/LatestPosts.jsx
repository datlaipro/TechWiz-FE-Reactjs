import React from "react";
import { Box, Typography, Button } from "@mui/material";
import PostCard from "./PostCard";
import Grid from "@mui/material/Grid";
// import Grid from "@mui/material/Grid2";
const LatestPosts = () => {
  const posts = [
    {
      image: "/demo/images/post-item1.jpg",
      category: "Books",
      title: "10 Must-Read Books of the Year: Our Top Picks!",
      description:
        "Dive into the world of cutting-edge technology with our latest blog post, where we highlight five essential gadgets.",
      postLink: "/singlepost",
      categoryLink: "blog.html",
    },
    {
      image: "/demo/images/post-item2.jpg",
      category: "Books",
      title: "The Fascinating Realm of Science Fiction",
      description:
        "Explore the intersection of technology and sustainability in our latest blog post. Learn about the innovative...",
      postLink: "/singlepost",
      categoryLink: "blog.html",
    },
    {
      image: "/demo/images/post-item3.jpg",
      category: "Books",
      title: "Finding Love in the Pages of a Book",
      description:
        "Stay ahead of the curve with our insightful look into the rapidly evolving landscape of wearable technology.",
      postLink: "/singlepost",
      categoryLink: "blog.html",
    },
    {
      image: "/demo/images/post-item4.jpg",
      category: "Books",
      title: "Reading for Mental Health: How Books Can Heal",
      description:
        "In today's remote work environment, productivity is key. Discover the top apps and tools that can help you stay productive.",
      postLink: "/singlepost",
      categoryLink: "blog.html",
    },
  ];

  return (
    <Box
      id="latest-posts"
      sx={{
        py: 6,
      }}
    >
      <Grid 
        container 
        spacing={4}
        justifyContent="center"
        sx={{
          width: "100%",
          maxWidth: "xl",
          margin: "0 auto", // Căn giữa Grid
        }}
      >
<Grid 
  item 
  xs={12} 
  sx={{ 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    mb: 3,
    mx: {
      xs: 3, // Margin nhỏ cho màn hình nhỏ
      sm: 2, // Margin trung bình cho màn hình trung bình
      md: 1, // Margin nhỏ cho màn hình lớn
      lg: 0, // Margin rất nhỏ cho màn hình rất lớn
    },
  }}
>
  <Typography 
    variant="h4" 
    component="h3"
    sx={{
      ml: {
        xs: 3, // Margin trái cho màn hình nhỏ
        sm: 2, // Margin trái trung bình cho màn hình trung bình
        md: 1, // Margin trái nhỏ cho màn hình lớn
        lg: 0, // Margin trái rất nhỏ cho màn hình rất lớn
      },
    }}
  >
    Latest Posts
  </Typography>
  <Button 
    href="/shop" 
    variant="contained" 
    sx={{ 
      backgroundColor: '#F86D72', 
      color: '#FFFFFF', 
      fontSize: '0.875rem', 
      mr: {
        xs: 3, // Margin phải cho màn hình nhỏ
        sm: 2, // Margin phải trung bình cho màn hình trung bình
        md: 1, // Margin phải nhỏ cho màn hình lớn
        lg: 0, // Margin phải rất nhỏ cho màn hình rất lớn
      },
      borderRadius: "30px", /* Bo tròn 4 góc */
      fontWeight: '500', 
      textTransform: 'none', 
      textAlign: 'center', /* Căn giữa chữ */
      '&:hover': { 
        backgroundColor: '#D85A60' 
      },
    }}
  >
    View All
  </Button>
</Grid>

        {posts.map((post, index) => (
          <Grid spacing={4} item xs={12} sm={6} md={6} lg={3} key={index}
          sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <Box 
            sx={{ 
                width: 350, 
                // height: 410, 
                maxHeight: 480,
                overflow: "hidden",
                display: "flex", 
                flexDirection: "column", 
                // flexShrink: 0, // Không cho phép thu nhỏ Trong trường hợp có boxShadow sẽ lộ là vỡ khung
                // flexGrow: 0, // Không cho phép mở rộng Trong trường hợp có boxShadow sẽ lộ là vỡ khung
               }}>
            <PostCard {...post} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LatestPosts;

