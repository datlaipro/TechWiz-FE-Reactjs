import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { Box, IconButton } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

const GalleryProduct = ({ images }) => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const slider1 = useRef(null);
  const slider2 = useRef(null);

  useEffect(() => {
    setNav1(slider1.current);
    setNav2(slider2.current);
  }, []);

  // Chuyển thumbnail lên hoặc xuống
  const handleNextThumb = () => {
    if (slider2.current) slider2.current.slickNext();
  };

  const handlePrevThumb = () => {
    if (slider2.current) slider2.current.slickPrev();
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {/* Thumbnail Slider (bên trái) */}
      <Box sx={{ width: "20%", position: "relative" }}>
        {/* Nút Lùi */}
        <IconButton
          onClick={handlePrevThumb}
          sx={{
            position: "absolute",
            top: -20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            boxShadow: 1,
            zIndex: 10,
          }}
        >
          <ArrowUpward />
        </IconButton>

        <Slider
          asNavFor={nav1}
          ref={slider2}
          slidesToShow={2} // Hiển thị tối đa 3 ảnh
          slidesToScroll={1}
          arrows={false}
          focusOnSelect={true}
          infinite={false}
          vertical={true}
          verticalSwiping={true}
        >
          {images.map((img, index) => (
            <Box key={index} sx={{ padding: "5px", cursor: "pointer", marginTop: "5px" }}>
              <img 
                src={img} 
                alt={`thumb-${index}`} 
                style={{
                  width: "100%", 
                  // maxWidth: "300px",
                  marginTop: "10px",
                  borderRadius: "8px", 
                  border: "2px solid transparent"
                }}
              />
            </Box>
          ))}
        </Slider>

        {/* Nút Tiến */}
        <IconButton
          onClick={handleNextThumb}
          sx={{
            position: "absolute",
            bottom: -15,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "white",
            boxShadow: 1,
            zIndex: 10,
          }}
        >
          <ArrowDownward />
        </IconButton>
      </Box>

      {/* Ảnh lớn (bên phải) */}
      <Box sx={{ width: "80%"}}>
        <Slider 
          asNavFor={nav2} 
          ref={slider1} 
          arrows={false} 
          fade={true}
        >
          {images.map((img, index) => (
            <Box key={index}
              sx={{
                padding: "5px",
                cursor: "pointer",
                marginTop: "5px",
                ml: {
                  xs: "5px", // Giao diện nhỏ
                  sm: "10px", // Giao diện vừa
                  md: "20px", // Giao diện lớn
                },
              }}>
              <img 
                src={img} 
                alt={`product-${index}`} 
                style={{
                  // width: "100%",
                  // marginLeft: "20px",
                  maxWidth: "700px",
                  maxHeight: "900px",
                  borderRadius: "8px"
                }} 
              />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default GalleryProduct;
