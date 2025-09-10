import React from "react";
import Slider from "react-slick";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ReviewCard from "../display/free/ReviewCard";

// Dữ liệu đánh giá mẫu
const reviews = [
  {
    text: "I find this book very good and meaningful, I always read it every night before going to bed. I will often buy products at this website.",
    name: "Emma Chamberlin",
  },
  {
    text: "As an avid reader, I'm always on the lookout for new releases, and this bookstore never disappoints. They always have the latest titles, and their recommendations have introduced me to some incredible reads!",
    name: "Thomas John",
  },
  {
    text: "I ordered a few books online from this store, and I was impressed by the quick delivery and careful packaging. It's clear that they prioritize customer satisfaction, and I'll definitely be shopping here again!",
    name: "Kevin Bryan",
  },
  {
    text: "I stumbled upon this book store while searching for a book, and I couldn't be happier with my experience! The staff was incredibly knowledgeable and guided me through the process of choosing the perfect book for my needs.",
    name: "Stevin",
  },
];

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        right: "2px",
        transform: "translateY(-50%)",
        zIndex: 1,
      }}
    >
      <ArrowForwardIosIcon fontSize="large" />
    </IconButton>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        left: "2px",
        transform: "translateY(-50%)",
        zIndex: 1,
      }}
    >
      <ArrowBackIosIcon fontSize="large" />
    </IconButton>
  );
};

const CustomerReviewsSlider = () => {
  const settings = {
    dots: true, // Hiển thị chấm chấm
    infinite: true, // Lặp vô hạn
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Box
      sx={{
        position: "relative",
        backgroundImage: "url('/demo/images/banner-image-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 20px",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "800px" }}>
        <Typography
          variant="h4"
          fontSize={39}
          textAlign="center"
        //   fontWeight="bold"
          mb={4}
        //   color="white"
        >
          Customers reviews
        </Typography>
        <Slider {...settings}>
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default CustomerReviewsSlider;

