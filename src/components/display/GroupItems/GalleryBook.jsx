import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Button, IconButton } from "@mui/material";
import Slider from "react-slick";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";

/* ===== Utils ===== */
const truncateText = (t, n) =>
  !t || t.length <= n ? t : t.substring(0, n) + "...";

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ===== Component ===== */
const GalleryBook = () => {
  const [slides, setSlides] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("http://localhost:6868/api/events");
        if (!Array.isArray(data)) throw new Error("API did not return an array");

        const mapped = data
          // eventId có thể là số hoặc chuỗi; ép về Number để dùng làm key/link
          .filter((e) => e?.eventId != null && Number.isFinite(Number(e.eventId)))
          .map((e) => ({
            id: Number(e.eventId), // dùng cho key và link
            title: e.title || "Sự kiện",
            description: e.description || "Khám phá chi tiết sự kiện.",
            buttonText: "Xem chi tiết",
            // BE chưa chắc có ảnh -> thử vài key phổ biến, cuối cùng dùng placeholder
            image:
              e.image ||
              e.banner ||
              e.imagePath ||
              "/demo/images/placeholder.png",
            // giữ thêm vài field nếu sau này muốn hiển thị
            startDate: e.startDate || e.date || null,
            endDate: e.endDate || null,
            venue: e.venue || "",
            status: e.status || "",
          }));

        setSlides(shuffleArray(mapped).slice(0, 5));
      } catch (e) {
        console.error(e);
        setError("Failed to load slides. Please try again later.");
      }
    };
    fetchEvents();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (error) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  if (slides.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography>No slides available.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ width: "100%" }}>
        <Slider {...settings}>
          {slides.map((slide) => (
            <Box
              key={slide.id}
              sx={{
                position: "relative",
                height: { xs: 480, md: 800 },
                overflow: "hidden",
              }}
            >
              {/* ẢNH NỀN FULL-BLEED */}
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  inset: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "100vw",
                  height: "100%",
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />

              {/* NỘI DUNG OVERLAY */}
              <Grid
                container
                alignItems="center"
                sx={{
                  position: "relative",
                  zIndex: 1,
                  height: "100%",
                  px: { xs: 2, md: 6 },
                }}
              >
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      display: "inline-block",
                      background:
                        "linear-gradient(90deg, rgba(0,0,0,.45), rgba(0,0,0,0))",
                      px: { xs: 2, md: 3 },
                      py: { xs: 1, md: 2 },
                      borderRadius: "12px",
                    }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: { xs: "2.5rem", md: "4rem" },
                        mb: 2,
                        color: "#fff",
                        fontWeight: 800,
                        lineHeight: 1.1,
                        textShadow:
                          "0 4px 24px rgba(0,0,0,.55), 0 2px 8px rgba(0,0,0,.6)",
                        WebkitTextStroke: "1px rgba(0,0,0,.15)",
                      }}
                    >
                      {truncateText(slide.title, 30)}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 2, mb: 3, maxWidth: 600 }}
                  >
                    {truncateText(slide.description, 50)}
                  </Typography>

                  <Button
                    variant="contained"
                    component={Link}
                    to={`/productdetail/${slide.id}`} // giữ route FE hiện có, truyền eventId
                    size="large"
                    sx={{
                      backgroundColor: "#F86D72",
                      "&:hover": { backgroundColor: "black" },
                      borderRadius: "30px",
                      px: 4,
                      py: 2,
                    }}
                  >
                    {slide.buttonText}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

/* ===== Arrows ===== */
const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      right: { xs: 8, md: 16 },
      transform: "translateY(-50%)",
      zIndex: 50,
      color: "#fff",
      backgroundColor: "rgba(0,0,0,.35)",
      backdropFilter: "blur(2px)",
      borderRadius: "999px",
      "&:hover": { backgroundColor: "rgba(0,0,0,.55)" },
    }}
  >
    <ArrowForwardIosIcon />
  </IconButton>
);

const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      left: { xs: 8, md: 16 },
      transform: "translateY(-50%)",
      zIndex: 50,
      color: "#fff",
      backgroundColor: "rgba(0,0,0,.35)",
      backdropFilter: "blur(2px)",
      borderRadius: "999px",
      "&:hover": { backgroundColor: "rgba(0,0,0,.55)" },
    }}
  >
    <ArrowBackIosIcon />
  </IconButton>
);

export default GalleryBook;
