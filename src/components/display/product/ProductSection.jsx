import React, { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import axios from "axios";
import ProductGroup from "./ProductGroup";

const ProductSection = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState(null);

  // mapper: BE -> FE (không thêm field mới, chỉ dùng các field đang có ở FE)
  const toEventCard = (e) => ({
    // FE đang dùng id
    id: e?.eventId ?? e?.id,
    // FE đang dùng image (BE không có -> placeholder)
    image: e?.mainImageUrl || e?.banner || e?.imagePath || "/demo/images/placeholder.png",
    // FE dùng title
    title: e?.title || "",
    // FE dùng startDate / endDate
    startDate: e?.startDate || e?.date || null,
    endDate: e?.endDate || null,
    // FE dùng link
    link: `/eventdetail/${e?.eventId ?? e?.id}`,
    // FE dùng location
    location: e?.venue || "",
    // Các field FE cũ (không cần từ BE) giữ nguyên nhưng để trống nếu không có
    language: "",     // trước đây dùng để lọc nhóm, giờ không dựa vào trường này nữa
    author: "",
    rating: undefined,
    price: undefined,
    originalPrice: undefined,
    dateAdded: undefined,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:6868/api/events");
        if (!Array.isArray(data)) throw new Error("API did not return an array");

        // ===== Nhóm trực tiếp trên dữ liệu BE rồi mới map sang FE để KHÔNG cần thêm field mới =====
        const isApproved = (x) => (x?.status || "").toUpperCase() === "APPROVED";
        const isCategory = (x, cat) => (x?.category || "").toLowerCase() === cat;
        const ts = (d) => {
          const t = d ? new Date(d).getTime() : NaN;
          return Number.isFinite(t) ? t : 0;
        };

        // 1) Technical (dựa trên category từ BE)
        const technical = data
          .filter((x) => isCategory(x, "technical"))
          .map(toEventCard)
          .slice(0, 3);

        // 2) Được duyệt (APPROVED) — theo status của BE
        const approved = data
          .filter(isApproved)
          .map(toEventCard)
          .slice(0, 3);

        // 3) Sắp diễn ra (sort theo startDate asc / date asc)
        const upcoming = [...data]
          .sort(
            (a, b) =>
              ts(a?.startDate || a?.date) - ts(b?.startDate || b?.date)
          )
          .map(toEventCard)
          .slice(0, 3);

        // 4) Mới nhất (sort theo startDate desc / date desc)
        const latest = [...data]
          .sort(
            (a, b) =>
              ts(b?.startDate || b?.date) - ts(a?.startDate || a?.date)
          )
          .map(toEventCard)
          .slice(0, 3);

        const newGroups = [
          { title: "Technical", products: technical },
          { title: "Approved", products: approved },
          { title: "Upcoming", products: upcoming },
          { title: "Latest", products: latest },
        ];

        setGroups(newGroups);
      } catch (err) {
        console.error(err);
        setError("Failed to load products. Please try again later.");
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
            <ProductGroup title={group.title} products={group.products} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductSection;
