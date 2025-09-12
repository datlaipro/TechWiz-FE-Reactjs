import React from "react";
import { Box, Grid, Typography, Button, Stack } from "@mui/material";
import LatestPosts from "../../components/display/post/LatestPosts";
import InstagramGallery from "../../components/display/GroupItems/InstagramGallery";
import BreadcrumbsComponent from "../../components/display/free/BreadcrumbsComponent";

const About = () => {
  const stats = [
    { label: "Sự kiện/năm", value: "250+" },
    { label: "Câu lạc bộ", value: "40+" },
    { label: "Địa điểm trong campus", value: "15" },
    { label: "Người tham gia", value: "10K+" },
  ];

  return (
    <>
      <BreadcrumbsComponent
        title="Giới thiệu"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Giới thiệu" },
        ]}
      />

      <Box
        id="about-us"
        sx={{ pt: 5, width: "90%", mx: "auto", justifyContent: "center" }}
      >
        <Grid container spacing={4} justifyContent="center">
          {/* Poster + nút Play */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                maxWidth: 520,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Button
                aria-label="Play video giới thiệu"
                sx={{
                  position: "absolute",
                  border: "2px solid #F86D72",
                  borderRadius: "50%",
                  p: 5,
                  backgroundColor: "white",
                  boxShadow: 3,
                  transition: "transform .2s ease",
                  "&:hover": {
                    backgroundColor: "#fff",
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() =>
                  window.open("https://www.youtube.com/", "_blank")
                }
              >
                ▶
              </Button>
              <Box
                component="img"
                src="/demo/images/single-image-about.jpg"
                alt="Giới thiệu EventSphere"
                sx={{ width: "100%", display: "block" }}
              />
            </Box>
          </Grid>

          {/* Nội dung giới thiệu */}
          <Grid item xs={12} md={6}>
            <Box sx={{ pl: { md: 5 }, mt: { xs: 2, md: 5 } }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
                EventSphere — Cổng sự kiện Đại học
              </Typography>

              <Typography paragraph variant="h6">
                Nền tảng tập trung giúp sinh viên, câu lạc bộ và phòng ban
                <strong> tạo – quản lý – khám phá</strong> sự kiện một cách
                nhanh chóng và minh bạch.
              </Typography>

              <Typography paragraph variant="body1" color="text.secondary">
                Từ hội thảo học thuật, giải thể thao, đến hoạt động thiện
                nguyện, EventSphere chuẩn hoá quy trình duyệt, đồng bộ lịch và
                thông báo đa kênh. Mục tiêu của chúng tôi là giúp mọi sự kiện
                đều tìm được đúng người tham gia, đúng thời điểm, đúng địa điểm.
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  href="/events/calendar"
                  sx={{
                    backgroundColor: "#F86D72",
                    color: "#fff",
                    borderRadius: "30px",
                    textTransform: "none",
                    px: 3,
                    "&:hover": { backgroundColor: "#D85A60" },
                  }}
                >
                  Xem lịch sự kiện
                </Button>
                <Button
                  variant="outlined"
                  href="/events/submit"
                  sx={{
                    borderColor: "#F86D72",
                    color: "#F86D72",
                    borderRadius: "30px",
                    textTransform: "none",
                    px: 3,
                    "&:hover": {
                      borderColor: "#D85A60",
                      color: "#D85A60",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Đăng sự kiện
                </Button>
              </Stack>
            </Box>
          </Grid>

          {/* Thống kê nhanh */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {stats.map((s, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      p: 2.5,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {s.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {s.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* Khối sự kiện mới (đã chỉnh cho chủ đề event) */}
      <LatestPosts />

      {/* Album ảnh sự kiện */}
      <Box sx={{ width: "90%", mx: "auto", mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
          Album ảnh sự kiện
        </Typography>
      </Box>
      <InstagramGallery />
    </>
  );
};

export default About;
