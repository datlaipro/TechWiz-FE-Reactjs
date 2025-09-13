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
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
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
                src="https://cdn2.tuoitre.vn/thumb_w/640/471584752817336320/2025/4/23/truong-dai-hoc-sai-gon-17454525370672073466598.jpg"
                alt="Giới thiệu EventSphere"
                sx={{ width: "100%", display: "block" }}
              />
            </Box>
          </Grid>

          {/* Nội dung giới thiệu */}
          <Grid item xs={12} md={6}>
            <Box sx={{ pl: { md: 5 }, mt: { xs: 2, md: 5 } }}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 800 }}>
                EventSphere — University Event Portal
              </Typography>

              <Typography paragraph variant="h6">
                Centralized platform to help students, clubs and departments{" "}
                <strong> create – manage – discover</strong>events quickly and
                transparently.
              </Typography>

              <Typography paragraph variant="body1" color="text.secondary">
                From academic conferences to sports events to charity events,
                EventSphere streamlines approval processes, synchronizes
                calendars, and multi-channel notifications. Our goal is to help
                every event reach the right people, at the right time, in the
                right place.
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 2, flexWrap: "wrap" }}
              >
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
                  See event calendar
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
                  Post events
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
          Album event photo
        </Typography>
      </Box>
      <InstagramGallery />
    </>
  );
};

export default About;
