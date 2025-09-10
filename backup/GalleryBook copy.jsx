import React from "react";
import { Box, Container, Grid, Typography, Button } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Component chính
const GalleryBook = () => {
  // Cấu hình cho React Slick
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  // Dữ liệu slider
  const slides = [
    {
      title: "The Fine Print Book Collection",
      description: "Best Offer Save 30%. Grab it now!",
      buttonText: "Shop Collection",
      image: "/demo/images/banner-image2.png",
    },
    {
      title: "How Innovation Works",
      description: "Discount available. Grab it now!",
      buttonText: "Shop Product",
      image: "/demo/images/banner-image1.png",
    },
    {
      title: "Your Heart is the Sea",
      description: "Limited stocks available. Grab it now!",
      buttonText: "Shop Collection",
      image: "/demo/images/banner-image.png",
    },
  ];

  return (
    <Box
      id="GalleryBook"
      sx={{
        position: "relative",
        py: 5,
        // backgroundColor: "#f9f9f9",
        backgroundImage: "url('/demo/images/banner-image-bg.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "800px",
      }}
    >
      <Container>
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <Box key={index}>
              <Grid
                container
                alignItems="center"
                justifyContent="center"
                spacing={2}
                sx={{
                  flexDirection: {
                    xs: "column-reverse",
                    md: "row",
                  },
                }}
              >
                {/* Text Content */}
                <Grid
                  item
                  xs={12}
                  md={5}
                  sx={{
                    textAlign: {
                      xs: "center",
                      md: "left",
                    },
                  }}
                >
                  <Box>
                    <Typography variant="h2" sx={{ fontSize: "2rem", mb: 2 }}>
                      {slide.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                      {slide.description}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      href="shop.html"
                      size="large"
                    >
                      {slide.buttonText}
                    </Button>
                  </Box>
                </Grid>

                {/* Image */}
                <Grid item xs={12} md={6}>
                  <Box
                    component="img"
                    src={slide.image}
                    alt={slide.title}
                    sx={{
                      maxWidth: "100%",
                      borderRadius: "8px",
                      objectFit: "contain",
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Slider>
      </Container>
    </Box>
  );
};

// Custom Arrow Component
const NextArrow = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        right: 20,
        transform: "translateY(-50%)",
        zIndex: 10,
        cursor: "pointer",
      }}
    >
      <svg
        width="80"
        height="80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="chevron-forward-circle"
      >
        <use xlinkHref="#alt-arrow-right-outline"></use>
      </svg>
    </Box>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        left: 20,
        transform: "translateY(-50%)",
        zIndex: 10,
        cursor: "pointer",
      }}
    >
      <svg
        width="80"
        height="80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="chevron-back-circle"
      >
        <use xlinkHref="#alt-arrow-left-outline"></use>
      </svg>
    </Box>
  );
};

export default GalleryBook;
