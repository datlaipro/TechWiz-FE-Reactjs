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

import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import PeopleAltRounded from "@mui/icons-material/PeopleAltRounded";

const FallbackImg = "https://picsum.photos/seed/event/1280/720";

function fmtDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("vi-VN");
  } catch {
    return d;
  }
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:6868/api/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy sự kiện");
        return res.json();
      })
      .then((data) => {
        // ==== Map field từ BE (không tạo thêm trường mới) ====
        const startDate = data.startDate || data.date || null;
        const endDate = data.endDate || null;
        const timeRaw = data.time ? String(data.time) : null; // "06:00:00"
        const timeText =
          timeRaw && timeRaw.includes(":") ? timeRaw.slice(0, 5) : timeRaw;

        const eventDateText =
          startDate && endDate && startDate !== endDate
            ? `${fmtDate(startDate)} – ${fmtDate(endDate)}`
            : fmtDate(startDate);

        setEvent({
          id: data.eventId ?? data.id ?? id,
          title: data.title ?? data.name ?? "Sự kiện",
          description: data.description ?? "",
          category: data.category,
          startDate,
          endDate,
          time: timeText, // hiển thị HH:mm
          venueName: data.venue ?? "",
          venueAddress: data.venueAddress ?? "",
          organizerId: data.organizerId,
          status: data.status,
          totalSeats: data.totalSeats,
          mainImageUrl: data.mainImageUrl || FallbackImg,
          // các giá trị tiện dùng cho InfoProduct
          eventDateText,
          startTime: timeText || null,
          endTime: null,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Lỗi khi tải sự kiện");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error || !event) {
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography color="error">{error || "Không tìm thấy sự kiện"}</Typography>
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
    startDate,
    endDate,
    time,
    totalSeats,
    mainImageUrl,
    // các field khác vẫn giữ trong object event để truyền cho InfoProduct
  } = event;

  return (
    <>
      <BreadcrumbsComponent
        title="Detail"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "EventDetail" },
          { label: title },
        ]}
      />

      <Box sx={{ maxWidth: 1300, mx: "auto", px: { xs: 1.5, md: 2 }, py: { xs: 2, md: 3 } }}>
        <Grid
          container
          spacing={0}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            bgcolor: "#1f2427",
            alignItems: "stretch",
          }}
        >
          {/* LEFT: để trống/CTA nhẹ nếu muốn, nội dung chi tiết sẽ ở InfoProduct bên dưới */}
          <Grid item xs={12} md={5} order={{ xs: 2, md: 1 }}>
            <Box sx={{ p: { xs: 2, md: 3 }, color: "#e6f3e6", minHeight: 200 }}>
              <Typography sx={{ opacity: 0.8 }}>
                Chi tiết sự kiện ở bên dưới.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
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
            </Box>
          </Grid>

          {/* RIGHT: Poster + overlay 5 thông tin bắt buộc */}
          <Grid item xs={12} md={7} order={{ xs: 1, md: 2 }} sx={{ position: "relative", bgcolor: "#0c0f12" }}>
            <Box
              component="img"
              src={mainImageUrl || FallbackImg}
              alt={title}
              onError={(e) => (e.currentTarget.src = FallbackImg)}
              sx={{
                width: "100%",
                height: "100%",
                minHeight: { xs: 260, sm: 340, md: 460 },
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* Gradient để chữ đọc rõ */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)",
              }}
            />

            {/* Overlay thông tin */}
            <Box
              sx={{
                position: "absolute",
                left: { xs: 12, md: 18 },
                right: { xs: 12, md: 18 },
                bottom: { xs: 12, md: 18 },
                color: "white",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 18, md: 22 },
                  fontWeight: 800,
                  mb: 1,
                  textShadow: "0 2px 10px rgba(0,0,0,.6)",
                }}
              >
                {title}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  icon={<CalendarMonthRounded />}
                  label={
                    startDate && endDate
                      ? `${fmtDate(startDate)} – ${fmtDate(endDate)}`
                      : fmtDate(startDate) || "Ngày: TBA"
                  }
                  sx={{ bgcolor: "rgba(255,255,255,.15)", color: "white" }}
                />
                <Chip
                  icon={<AccessTimeRounded />}
                  label={time ? `Giờ: ${time}` : "Giờ: TBA"}
                  sx={{ bgcolor: "rgba(255,255,255,.15)", color: "white" }}
                />
                {typeof totalSeats === "number" && (
                  <Chip
                    icon={<PeopleAltRounded />}
                    label={`Chỗ ngồi: ${totalSeats}`}
                    sx={{ bgcolor: "rgba(255,255,255,.15)", color: "white" }}
                  />
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Toàn bộ thông tin còn lại chuyển xuống InfoProduct qua prop `event` */}
      <InfoProduct event={event} />
      <LatestPosts />
      <InstagramGallery />
    </>
  );
};

export default ProductDetail;
