import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";

const LimitedOffer = () => {
  // Set thời gian kết thúc (30 ngày từ hiện tại)
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 4); // Cộng thêm 4 ngày

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = endDate - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Reset mỗi khi tải lại trang
  }, []);

  return (
    <Box
      id="limited-offer"
      sx={{
        position: "relative",
        backgroundImage: `linear-gradient(90deg,
      rgba(0,0,0,.65) 0%,
      rgba(0,0,0,.35) 35%,
      rgba(0,0,0,0) 65%
    ),
    url(https://media.istockphoto.com/id/654134124/vi/anh/h%C3%B2a-nh%E1%BA%A1c.jpg?s=2048x2048&w=is&k=20&c=Jc-V8lcH736wne1AxDvxczJQGnsWIphJyAIK6kkKPU4=)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "800px",
        display: "flex",
        alignItems: "center",
        padding: "32px",
      }}
    >
      <Grid container spacing={4} alignItems="center">
        {/* Image Section */}
        <Grid item xs={12} md={6} textAlign="center"></Grid>

        {/* Text Section */}
        <Grid item xs={12} md={5}>
          {/* <Typography
            variant="h2"
            textAlign={{ xs: "center", md: "left" }}
            sx={{ fontSize: "2rem", fontWeight: "bold" }}
          >
            30% Discount on all items. Hurry Up !!!
          </Typography> */}
          <Box
            id="countdown-clock"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: { xs: 2, md: 3 },
              px: { xs: 2, md: 3 },
              py: { xs: 1, md: 1.5 },
              borderRadius: "16px",
              backgroundColor: "rgba(0,0,0,.35)", // lớp tối nhẹ
              border: "1px solid rgba(255,255,255,.15)",
              backdropFilter: "blur(6px)", // hiệu ứng glass
              boxShadow: "0 10px 30px rgba(0,0,0,.35)",
              color: "#fff", // chữ trắng
            }}
          >
            {/* Days */}
            <Box sx={{ minWidth: { xs: 60, md: 80 }, textAlign: "center" }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2.25rem", md: "3.25rem" },
                  fontWeight: 800,
                  lineHeight: 1,
                  textShadow:
                    "0 8px 24px rgba(0,0,0,.8), 0 2px 8px rgba(0,0,0,.6)",
                }}
              >
                {String(timeLeft.days).padStart(2, "0")}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 12, md: 13 },
                  letterSpacing: "0.08em",
                  opacity: 0.9,
                }}
              >
                Days
              </Typography>
            </Box>

            {/* Separator */}
            <Typography
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                px: { xs: 0.5, md: 1 },
                fontWeight: 700,
                color: "#4DA3FF",
              }}
            >
              :
            </Typography>

            {/* Hours */}
            <Box sx={{ minWidth: { xs: 60, md: 80 }, textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: { xs: "2.25rem", md: "3.25rem" },
                  fontWeight: 800,
                  lineHeight: 1,
                  textShadow:
                    "0 8px 24px rgba(0,0,0,.8), 0 2px 8px rgba(0,0,0,.6)",
                }}
              >
                {String(timeLeft.hours).padStart(2, "0")}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 12, md: 13 },
                  letterSpacing: "0.08em",
                  opacity: 0.9,
                }}
              >
                Hrs
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                px: { xs: 0.5, md: 1 },
                fontWeight: 700,
                color: "#4DA3FF",
              }}
            >
              :
            </Typography>

            {/* Minutes */}
            <Box sx={{ minWidth: { xs: 60, md: 80 }, textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: { xs: "2.25rem", md: "3.25rem" },
                  fontWeight: 800,
                  lineHeight: 1,
                  textShadow:
                    "0 8px 24px rgba(0,0,0,.8), 0 2px 8px rgba(0,0,0,.6)",
                }}
              >
                {String(timeLeft.minutes).padStart(2, "0")}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 12, md: 13 },
                  letterSpacing: "0.08em",
                  opacity: 0.9,
                }}
              >
                Min
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                px: { xs: 0.5, md: 1 },
                fontWeight: 700,
                color: "#4DA3FF",
              }}
            >
              :
            </Typography>

            {/* Seconds */}
            <Box sx={{ minWidth: { xs: 60, md: 80 }, textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: { xs: "2.25rem", md: "3.25rem" },
                  fontWeight: 800,
                  lineHeight: 1,
                  textShadow:
                    "0 8px 24px rgba(0,0,0,.8), 0 2px 8px rgba(0,0,0,.6)",
                }}
              >
                {String(timeLeft.seconds).padStart(2, "0")}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 12, md: 13 },
                  letterSpacing: "0.08em",
                  opacity: 0.9,
                }}
              >
                Sec
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              //   marginTop: "16px",
              //   color: "text.primary",
              //   flexDirection: "row",
            }}
          >
            <Button
              href="shop.html"
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                marginTop: "16px",
                borderRadius: "30px" /* Bo tròn 4 góc */,
                backgroundColor: "#F86D72",
                padding: "16px",
              }}
            >
              Shop Collection
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LimitedOffer;
