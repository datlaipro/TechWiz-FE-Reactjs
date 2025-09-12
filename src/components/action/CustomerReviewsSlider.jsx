import React from "react";
import Slider from "react-slick";
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";

const testimonials = [
  { text: "Tech Festival đúng là bùng nổ! Mình được chạm tay vào rất nhiều demo AI/IoT và networking được với các anh chị doanh nghiệp.",
    name: "Minh – CS’26", event: "Tech Festival 2025" },
  { text: "Orientation Day tổ chức cực kì chu đáo. Các mentor dẫn tour khuôn viên, giải đáp mọi thắc mắc về môn học và CLB.",
    name: "Lan – Khoa Dược", event: "Freshers Orientation Day" },
  { text: "Giải chạy gây quỹ làm mình bất ngờ vì quy mô và sự cổ vũ dọc đường chạy. Vừa vui vừa ý nghĩa!",
    name: "Khoa – Kinh tế", event: "Charity Marathon" },
  { text: "Winter Hackathon rất ‘cháy’. BTC hỗ trợ xuyên đêm, mentor nhiệt tình và demo cuối cùng quá đã.",
    name: "Huy – IT Club", event: "Winter Hackathon 2025" },
];

function EventReviewCard({ review }) {
  return (
    <Box
      sx={{
        mx: "auto",
        p: { xs: 4, md: 6 },
        borderRadius: 5,
        bgcolor: "background.paper",
        boxShadow: "0 10px 30px rgba(0,0,0,.08)",
        maxWidth: { md: 1100, lg: 1200 }, // ➜ rộng hơn
      }}
    >
      <Stack spacing={2.5}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Chip
            icon={<VerifiedRounded />}
            label="Verified attendee"
            size="medium"  // ➜ chip to hơn
            color="success"
            sx={{ fontWeight: 600 }}
          />
          <Chip
            icon={<CalendarMonthRounded />}
            label={review.event}
            size="medium"
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: 22, sm: 24, md: 28 }, // ➜ chữ quote to hơn
            lineHeight: 1.7,
          }}
        >
          “{review.text}”
        </Typography>

        <Typography
          variant="h6"
          sx={{ opacity: 0.85, fontSize: { xs: 16, md: 18 } }}
        >
          {review.name}
        </Typography>
      </Stack>
    </Box>
  );
}

const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      right: { xs: 6, md: 24 },
      transform: "translateY(-50%)",
      zIndex: 2,
      bgcolor: "background.paper",
      boxShadow: 2,
      width: 56, height: 56,        // ➜ nút lớn hơn
      "& svg": { fontSize: 28 },
      "&:hover": { bgcolor: "background.paper" },
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
      left: { xs: 6, md: 24 },
      transform: "translateY(-50%)",
      zIndex: 2,
      bgcolor: "background.paper",
      boxShadow: 2,
      width: 56, height: 56,
      "& svg": { fontSize: 28 },
      "&:hover": { bgcolor: "background.paper" },
    }}
  >
    <ArrowBackIosIcon />
  </IconButton>
);

export default function StudentVoicesSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 450,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    adaptiveHeight: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Box
      sx={{
        position: "relative",
        backgroundImage:
          "url('/demo/images/bg-campus.jpg'), radial-gradient(80% 60% at 50% 0%, rgba(120,167,255,.18) 0%, rgba(248,109,114,.12) 60%, transparent 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        py: { xs: 10, md: 16 },           // ➜ cao hơn
        minHeight: { md: 600 },           // ➜ tổng thể lớn hơn
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(255,255,255,.9) 0%, rgba(255,255,255,.82) 40%, rgba(255,255,255,.9) 100%)",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h4"
          sx={{ fontSize: { xs: 32, md: 40 }, textAlign: "center", mb: 5 }} // ➜ tiêu đề to hơn
        >
          Student voices
        </Typography>

        <Slider {...settings}>
          {testimonials.map((t, i) => (
            <EventReviewCard key={i} review={t} />
          ))}
        </Slider>
      </Container>
    </Box>
  );
}
