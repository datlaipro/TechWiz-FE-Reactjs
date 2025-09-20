import React, { useState, useEffect } from "react";
import ProductSlider from "../product/ProductSlider";
import { Box, Container, Typography, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BestSellingItems = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // vẫn đặt tên products để tương thích ProductSlider
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:6868/api/events");

        // Map ProductDTO -> Event item cho ProductSlider (event-mode khi có startDate)
        const mappedEvents = data.map((p) => ({
          id: p.id,
          // ---- fields dùng cho Event UI ----
          title: p.title, // tiêu đề sự kiện
          image: p.mainImageUrl,
          startDate: p.startDate || p.dateAdded || p.createdAt || null,
          endDate: p.endDate || null,
          location: p.location || p.department || "",
          link: `/eventdetail/${p.eventId}`, // đổi theo route chi tiết thực tế nếu cần

          // ---- giữ thêm các field cũ để tương thích (nếu slider fallback) ----
          name: p.name,
          author: p.author,
          price: p.price,
          salePrice: p.salePrice || p.price,
          rating: 5,
          discount: p.discountPercentage
            ? `${p.discountPercentage}% off`
            : null,
        }));

        setProducts(mappedEvents.slice(0, 8)); // lấy tối đa 8 item
      } catch (err) {
        setError("Không tải được dữ liệu. Vui lòng thử lại sau.");
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography>Chưa có sự kiện.</Typography>
      </Box>
    );
  }

  return (
    <Box
      component="section"
      id="best-selling-items"
      sx={{ py: 4, maxWidth: "100%" }}
    >
      <Container maxWidth="100%">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            px: { xs: "24px", sm: "48px", lg: "150px" }, // giống phong cách trước
          }}
        >
          <Typography
            variant="h5"
            component="h3"
            sx={{ fontSize: "2.5rem", fontWeight: 700 }}
          >
            Sự kiện nổi bật
          </Typography>

          {/* Giữ dạng href để không thêm import mới */}
          <Button
            
            href="/events"
            variant="contained"
            sx={{
              backgroundColor: "#F86D72",
              color: "#FFFFFF",
              fontSize: "0.875rem",
              borderRadius: "30px",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { backgroundColor: "#D85A60" },
            }}
          >
            Xem tất cả
          </Button>
        </Box>

        {/* ProductSlider sẽ tự hiển thị Event Card khi phần tử có startDate */}
        <ProductSlider
          products={products}
          imgH={{ xs: 180, sm: 200, md: 220, lg: 240 }}
        />
      </Container>
    </Box>
  );
};

export default BestSellingItems;
