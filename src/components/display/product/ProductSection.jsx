import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import ProductGroup from "./ProductGroup";

const ProductSection = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:6868/api/product");
        const products = response.data;

        // Map ProductDTO -> EventCard data để phù hợp giao diện "event"
        const mappedEvents = products.map((product) => ({
          id: product.id,
          image:
            product.images?.[0]?.imagePath || "/demo/images/placeholder.png",
          title: product.name,
          // Chuyển "dateAdded" -> startDate (không có endDate)
          startDate: product.dateAdded || product.createdAt || null,
          endDate: null,
              link: `/productdetail/${product.id}`,
          // Nếu backend có field location/department thì dùng, không có thì để trống
          location: product.location || product.department || "",
          // Link đến trang chi tiết sản phẩm/sự kiện
          // Giữ lại để lọc/nhóm như logic cũ
          language: product.language,
          // (các field dưới đây không dùng cho event UI nhưng giữ nếu cần)
          author: product.author,
          rating: 5,
          price: product.salePrice || product.price,
          originalPrice: product.salePrice ? product.price : null,
          dateAdded: product.dateAdded,
        }));

        // Tạo các nhóm GIỮ NGUYÊN LOGIC (lọc theo language + lấy 3 item)
        const newGroups = [
          {
            title: "Vietnamese",
            products: mappedEvents
              .filter((p) => p.language === "Tiếng Việt")
              .slice(0, 3),
          },
          // {
          //   title: "Latest items",
          //   products: mappedEvents
          //     .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
          //     .slice(0, 3),
          // },
          {
            title: "Russian",
            products: mappedEvents
              .filter((p) => p.language === "Tiếng Nga")
              .slice(0, 3),
          },
          {
            title: "French",
            products: mappedEvents
              .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
              .slice(0, 3),
          },
          // {
          //   title: "On sale",
          //   products: mappedEvents
          //     .filter((p) => p.originalPrice)
          //     .slice(0, 3),
          // },
          {
            title: "English",
            products: mappedEvents
              .filter((p) => p.language === "Tiếng Anh")
              .slice(0, 3),
          },
        ];

        setGroups(newGroups);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
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

  if (groups.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography>No events available.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "90%",
        overflow: "hidden",
        py: 4,
        px: 3,
        mx: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          maxWidth: "100%",
          mx: "auto",
          display: "flex",
          justifyContent: "center",
          "& .MuiGrid-item": {
            flexBasis: "calc(25% - 16px)",
          },
          "@media (max-width: 1200px)": {
            "& .MuiGrid-item": {
              flexBasis: "calc(33.33% - 16px)",
            },
          },
          "@media (max-width: 900px)": {
            "& .MuiGrid-item": {
              flexBasis: "calc(50% - 16px)",
            },
          },
          "@media (max-width: 600px)": {
            "& .MuiGrid-item": {
              flexBasis: "100%",
            },
          },
        }}
      >
        {groups.map((group, index) => (
          <Grid item key={index}>
            {/* ProductGroup (phiên bản giao diện EVENT) */}
            <ProductGroup title={group.title} products={group.products} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductSection;
