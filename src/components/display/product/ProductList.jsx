import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, CircularProgress, Button } from "@mui/material";
import ProductCard from "./ProductCard";
import PaginationComponent from "../free/PaginationComponent";
import { useNavigate } from "react-router-dom";
function fmtRange(startDate, endDate) {
  try {
    const s = startDate ? new Date(startDate) : null;
    const e = endDate ? new Date(endDate) : null;
    if (!s) return "";
    const dOpt = { dateStyle: "medium", timeStyle: "short" };

    if (!e) return `Bắt đầu: ${s.toLocaleString("vi-VN", dOpt)}`;

    const sameDay =
      s.getFullYear() === e.getFullYear() &&
      s.getMonth() === e.getMonth() &&
      s.getDate() === e.getDate();

    return sameDay
      ? `${s.toLocaleString("vi-VN", dOpt)} – ${e.toLocaleTimeString("vi-VN", {
          timeStyle: "short",
        })}`
      : `${s.toLocaleString("vi-VN", dOpt)} → ${e.toLocaleString(
          "vi-VN",
          dOpt
        )}`;
  } catch {
    return "";
  }
}

const isEvent = (item) => !!item?.startDate;

// Mini card cho sự kiện (chỉ dùng Box/Typo để giữ nguyên imports)
const EventMiniCard = ({ event }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 280,
        border: "1px solid #eee",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {event?.image && (
        <Box
          component="img"
          src={event.image}
          alt={event.title || event.name}
          sx={{ width: "100%", height: 180, objectFit: "cover" }}
        />
      )}
      <Box sx={{ p: 1.5 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 44,
          }}
          title={event.title || event.name}
        >
          {event.title || event.name}
        </Typography>

        {(event?.startDate || event?.endDate) && (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {fmtRange(event.startDate, event.endDate)}
          </Typography>
        )}

        {event?.location && (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {event.location}
          </Typography>
        )}

        {event?.link && (
          <Box sx={{ mt: 1 }}>
            <Button
              size="small"
              variant="contained"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => navigate(event.link)}
            >
              Register
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

const ProductList = ({ filters }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(12); // Số sản phẩm mỗi trang
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:6868/api/product")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách sản phẩm");
        return res.json();
      })
      .then((data) => {
        const mappedProducts = data.map((product) => ({
          id: product.id,
          name: product.name,
          author: product.author,
          image:
            product.images?.[0]?.imagePath || "/demo/images/placeholder.png",
          discount: product.discountPercentage
            ? `${product.discountPercentage}% OFF`
            : null,
          price: product.price,
          salePrice: product.salePrice || null,
          rating: 4, // Giả lập, chờ EntityRating
          category:
            typeof product.category === "string"
              ? product.category
              : product?.category?.name || product?.categoryName || "",
          language: product.language,
          description: product.description,

          // Bổ sung field "event style" để hiển thị EventMiniCard khi có
          startDate:
            product.startDate || product.dateAdded || product.createdAt || null,
          endDate: product.endDate || null,
          location: product.location || product.department || "",
          link: `/productdetail/${product.id}`,
        }));
        setProducts(mappedProducts);
        setLoading(false);
      })
      .catch((err) => {
        setError("Lỗi khi tải sản phẩm");
        setLoading(false);
        console.error("Error:", err);
      });
  }, []);

  // Áp dụng bộ lọc (GIỮ NGUYÊN logic cũ)
  const filteredProducts = products
    .filter((product) => {
      // Tìm kiếm
      const search = (filters.searchQuery || "").toLowerCase();
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search) ||
        (product.description || "").toLowerCase().includes(search);

      // Danh mục
      const matchesCategory =
        !filters.category || product.category === filters.category;

      // Ngôn ngữ
      const matchesLanguage =
        !filters.language || product.language === filters.language;

      // Giá (chuyển $ sang VNĐ: $1 ≈ 25000 VNĐ)
      const price = product.salePrice || product.price;
      let matchesPrice = true;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split("-").map(Number);
        const minVND = min * 25000;
        const maxVND = max ? max * 25000 : Infinity;
        matchesPrice = price >= minVND && price < maxVND;
      }

      return (
        matchesSearch && matchesCategory && matchesLanguage && matchesPrice
      );
    })
    // Sắp xếp (GIỮ NGUYÊN switch cũ)
    .sort((a, b) => {
      switch (filters.sort) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case "price-desc":
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        case "rating-highest":
          return (b.rating || 0) - (a.rating || 0);
        case "rating-lowest":
          return (a.rating || 0) - (b.rating || 0);
        default:
          return 0;
      }
    });

  // Đặt lại trang khi bộ lọc thay đổi
  useEffect(() => {
    setPage(0);
  }, [filters]);

  const totalPages = Math.ceil(filteredProducts.length / size);
  const displayedProducts = filteredProducts.slice(
    page * size,
    (page + 1) * size
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography>Không tìm thấy sản phẩm</Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {displayedProducts.map((product) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={product.id}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {isEvent(product) ? (
              <EventMiniCard event={product} />
            ) : (
              <ProductCard product={product} />
            )}
          </Grid>
        ))}
      </Grid>
      <PaginationComponent
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default ProductList;
