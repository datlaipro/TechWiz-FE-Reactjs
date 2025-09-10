import React from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
import PostCard from '../../components/display/post/PostCard';
import BreadcrumbsComponent from '../../components/display/free/BreadcrumbsComponent';
import PaginationComponent from '../../components/display/free/PaginationComponent';
import CategoriesSection from "../../components/display/info/CategoriesSection";
import InstagramGallery from "../../components/display/GroupItems/InstagramGallery";
import CustomerReviewsSlider from "../../components/action/CustomerReviewsSlider";




const BlogPage = () => {
  // const navigate = useNavigate(); // Khởi tạo điều hướng

  const posts = [
    {
      image: "/demo/images/post-item1.jpg",
      category: "Books",
      title: "10 Must-Read Books of the Year: Our Top Picks!",
      description:
        "Dive into the world of cutting-edge technology with our latest blog post, where we highlight five essential gadgets.",
      postLink: "/singlepost", // Đường dẫn đến bài viết mẫu, sử dụng useNavigate() bên PostCard để điều hướng
      // Thực tế nếu cho đường dẫn ntn thì không cần sử dụng useNavigate() bên PostCard vẫn chạy đc
      categoryLink: "/blog",
    },
    {
      image: "/demo/images/post-item2.jpg",
      category: "Books",
      title: "The Fascinating Realm of Science Fiction",
      description:
        "Explore the intersection of technology and sustainability in our latest blog technology technology technology post.",
      postLink: "/singlepost",
      categoryLink: "/blog",
    },
    {
      image: "/demo/images/post-item3.jpg",
      category: "Books",
      title: "Finding Love in the Pages of a Book",
      description:
        "Stay ahead of the curve with our insightful look into the rapidly evolving landscape of wearable technology.",
      postLink: "/singlepost",
      categoryLink: "/blog",
    },
    {
      image: "/demo/images/post-item4.jpg",
      category: "Books",
      title: "Reading for Mental Health: How Books Can Heal and Inspire",
      description:
        "In today's remote work environment, productivity is key. Discover the top apps and tools that can help you stay productive.",
      postLink: "/singlepost",
      categoryLink: "/blog",
    },
    {
      image: "/demo/images/post-item1.jpg",
      category: "Books",
      title: "10 Must-Read Books of the Year: Our Top Picks!",
      description:
        "Dive into the world of cutting-edge technology with our latest blog post, where we highlight five essential gadgets.",
      postLink: "/singlepost", // Đường dẫn đến bài viết mẫu, sử dụng useNavigate() bên PostCard để điều hướng
      // Thực tế nếu cho đường dẫn ntn thì không cần sử dụng useNavigate() bên PostCard vẫn chạy đc
      categoryLink: "/blog",
    },
    {
      image: "/demo/images/post-item2.jpg",
      category: "Books",
      title: "The Fascinating Realm of Science Fiction",
      description:
        "Explore the intersection of technology and sustainability in our latest blog technology technology technology post.",
      postLink: "/singlepost",
      categoryLink: "/blog",
    },
    {
      image: "/demo/images/post-item3.jpg",
      category: "Books",
      title: "Finding Love in the Pages of a Book",
      description:
        "Stay ahead of the curve with our insightful look into the rapidly evolving landscape of wearable technology.",
      postLink: "/singlepost",
      categoryLink: "/blog",
    },
    {
      image: "/demo/images/post-item4.jpg",
      category: "Books",
      title: "Reading for Mental Health: How Books Can Heal and Inspire",
      description:
        "In today's remote work environment, productivity is key. Discover the top apps and tools that can help you stay productive.",
      postLink: "/singlepost",
      categoryLink: "/blog",
    },
  ];

  return (
    <>
      <BreadcrumbsComponent
        title="Blogs"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog" } // Không có href → là trang hiện tại
        ]}
      />

      <Box id="latest-posts" sx={{ py: 6 }}>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ width: "100%", maxWidth: "xl", margin: "0 auto" }}
        >
          {posts.map((post, index) => (
            <Grid
              item
              xs={12} sm={6} md={6} lg={3}
              key={index}
              sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <Box
                sx={{
                  width: 350,
                  maxHeight: 480,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer" // Thêm hiệu ứng khi hover
                }}
                // onClick={() => navigate(post.postLink)} // Xử lý điều hướng
              >
                {/* <PostCard {...post} /> */}
                {/* Đây là 2 cách đổ dữ liệu, 1 cách đổ tương đối, 1 cách cụ thể */}
                <PostCard
                  image={post.image}
                  category={post.category}
                  title={post.title}
                  description={post.description}
                  postLink={post.postLink} // Truyền đường dẫn vào PostCard
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <PaginationComponent />
      // Chuyển trang, truyền page và totalPages vào PaginationComponent
      // Do trang này dữ liệu mẫu, chưa làm động nên phần này sẽ Lỗi
      <InstagramGallery />
      <CustomerReviewsSlider />
      <CategoriesSection />
    </>
  );
};

export default BlogPage;
