import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import BreadcrumbsComponent from "../free/BreadcrumbsComponent";
import LatestPosts from "../post/LatestPosts";
import InstagramGallery from "../GroupItems/InstagramGallery";
import InfoProduct from "./InfoProduct";

import StarIcon from "@mui/icons-material/Star";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import PlaceRounded from "@mui/icons-material/PlaceRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:6868/api/product/${id}/detail`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
        return res.json();
      })
      .then((data) => {
        setProduct({
          id: data.id,
          title: data.name,
          price: data.salePrice || data.price,
          oldPrice: data.salePrice ? data.price : null,
          description: data.description,
          stock: data.quantity,
          rating: Math.round(data.rating || 0),
          images:
            Array.isArray(data.images) && data.images.length > 0
              ? data.images
              : ["/demo/images/placeholder.png"],
          startTime: data.startTime,
          endTime: data.endTime,
          eventDateText: data.eventDateText,
          venueName: data.venueName,
          venueAddress: data.venueAddress,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Lỗi khi tải sản phẩm");
        setLoading(false);
      });
  }, [id]);

  const truncate = (t, n) =>
    t && t.length > n ? t.substring(0, n) + "..." : t || "";
  const fmtVND = (n) =>
    typeof n === "number" ? new Intl.NumberFormat("vi-VN").format(n) + " đ" : n;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error || !product) {
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography color="error">
          {error || "Không tìm thấy sản phẩm"}
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2, borderRadius: 1.5, textTransform: "none" }}
          onClick={() => navigate("/")}
        >
          Về trang chủ
        </Button>
      </Box>
    );
  }

  const {
    title,
    price,
    oldPrice,
    rating,
    images,
    startTime,
    endTime,
    eventDateText,
    venueName,
    venueAddress,
    stock,
    description,
  } = product;

  const poster = images[0];

  return (
    <>
      <BreadcrumbsComponent
        title="Detail"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "ProductDetail" },
          { label: truncate(title, 20) },
        ]}
      />

      <Box
        sx={{
          // width: "100%",
          maxWidth: 1300,
          mx: "auto",
          px: { xs: 1.5, md: 2 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            bgcolor: "#1f2427",
            alignItems: "stretch", // <- kéo giãn 2 cột bằng nhau
            minHeight: { xs: 320, sm: 380, md: 460, lg: 520 }, // <- tăng chiều cao chung
          }}
        >
          {/* LEFT – panel thông tin */}
          {/* LEFT – panel thông tin */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                p: { xs: 2, md: 3 },
                color: "#e6f3e6",

                height: "100%",
                zIndex: 2, // tránh bị phần khác đè
                display: "flex",
                flexDirection: "column",
                gap: 0.75,
              }}
            >
              {/* ====== LEFT CONTENT (luôn hiển thị, có fallback) ====== */}
              <Typography
                sx={{
                  fontSize: { xs: 18, md: 20 },
                  fontWeight: 800,
                  color: "white",
                  mb: 0.5,
                }}
              >
                {title}
              </Typography>

              {(() => {
                const timeLine =
                  (startTime && endTime ? `${startTime} - ${endTime}` : "") +
                  (eventDateText
                    ? `${startTime || endTime ? ", " : ""}${eventDateText}`
                    : "");
                return (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonthRounded
                      fontSize="small"
                      sx={{ opacity: 0.9 }}
                    />
                    <Typography sx={{ fontSize: 14, opacity: 0.95 }}>
                      {timeLine || "Đang cập nhật thời gian"}
                    </Typography>
                  </Stack>
                );
              })()}

              <Stack direction="row" spacing={1} alignItems="flex-start">
                <PlaceRounded
                  fontSize="small"
                  sx={{ mt: "1px", opacity: 0.9 }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                    {venueName || "Đang cập nhật địa điểm"}
                  </Typography>
                  <Typography sx={{ fontSize: 13, opacity: 0.8 }}>
                    {venueAddress || ""}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeRounded fontSize="small" sx={{ opacity: 0.9 }} />
                <Typography sx={{ fontSize: 14, opacity: 0.95 }}>
                  {startTime && endTime
                    ? `Thời lượng: ${startTime} – ${endTime}`
                    : "Thời lượng: đang cập nhật"}
                </Typography>
              </Stack>

              {(() => {
                const safeRating = Number.isFinite(rating)
                  ? Math.max(0, Math.round(rating))
                  : 0;
                return (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {Array.from({ length: Math.min(5, safeRating) }, (_, i) => (
                      <StarIcon
                        key={i}
                        sx={{ color: "#f5d142", fontSize: 18 }}
                      />
                    ))}
                    {/* Nếu muốn luôn hiện chip tồn kho, bỏ điều kiện */}
                    <Chip
                      label={`Còn: ${stock ?? 0}`}
                      size="small"
                      sx={{
                        ml: 1,
                        bgcolor: "rgba(255,255,255,.08)",
                        color: "white",
                        height: 22,
                      }}
                    />
                  </Stack>
                );
              })()}

              <Box
                sx={{ height: 1, bgcolor: "rgba(255,255,255,.08)", my: 1 }}
              />

              {/* Giá + NÚT HÀNH ĐỘNG (đặt cao, luôn thấy) */}
              {/* <Typography sx={{ opacity: 0.85, fontSize: 13 }}>
                Giá từ
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography
                  sx={{ fontWeight: 900, color: "white", fontSize: 24 }}
                >
                  {fmtVND(price)}
                </Typography>
                {oldPrice && (
                  <Typography
                    component="del"
                    sx={{ color: "rgba(255,255,255,.55)", fontSize: 14 }}
                  >
                    {fmtVND(oldPrice)}
                  </Typography>
                )}
              </Stack> */}

              <Stack direction="row" spacing={1.2} sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#22c55e",
                    color: "#0b2e13",
                    fontWeight: 800,
                    px: 2.6,
                    py: 1.1,
                    borderRadius: 1.5,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#16a34a" },
                  }}
                >
                  Register
                </Button>

                {/* <Button
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(255,255,255,.7)",
                    color: "white",
                    fontWeight: 700,
                    px: 2.2,
                    py: 1.05,
                    borderRadius: 1.5,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "white",
                      bgcolor: "rgba(255,255,255,.06)",
                    },
                  }}
                >
                  Register
                </Button> */}
              </Stack>

              {/* mô tả đặt sau nút, tránh che */}
              {description && (
                <Typography
                  sx={{ mt: 1, color: "rgba(255,255,255,.9)", fontSize: 13.5 }}
                >
                  {description}
                </Typography>
              )}
            </Box>
          </Grid>

          {/* RIGHT – poster khống chế chiều cao */}
          {/* RIGHT – poster full-bleed, ăn hết phần đen */}
          <Grid
            item
            xs={12}
            md={7}
            sx={{ bgcolor: "#0c0f12", display: "flex" }}
          >
            <Box
              sx={{
                position: "relative",
                flex: 1 /* fill full height of column */,
              }}
            >
              <Box
                component="img"
                src={poster}
                alt={title}
                sx={{
                  position: "absolute",
                  inset: 0, // top/right/bottom/left = 0
                  width: "100%",
                  height: "100%", // cao bằng cột phải
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Giữ các khối phong cách cũ */}
      <InfoProduct />
      <LatestPosts />
      <InstagramGallery />
    </>
  );
};

export default ProductDetail;
