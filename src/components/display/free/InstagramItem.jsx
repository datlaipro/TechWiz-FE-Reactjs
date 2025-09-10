import React from "react";
import { Box, IconButton } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";

const InstagramItem = ({ image, link }) => {
  return (
    <Box
    //   component="figure"  NẾU ĐỂ COMPONENT NÀY THÌ KHOẢNG CÁCH GIỮA CÁC ẢNH NHIỀU QUÁ - XẤU
      component="div"
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        "&:hover .overlay": {
          opacity: 1,
        },
      }}
    >
      <a href={link} target="_blank" rel="noopener noreferrer">
        <Box
          component="img"
          src={image}
          alt="Instagram"
          sx={{
            width: "100%",
            height: "auto",
            borderRadius: 3,
          }}
        />
        <Box
          className="overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <IconButton sx={{ color: "white", fontSize: 30 }}>
            <InstagramIcon fontSize="large" />
          </IconButton>
        </Box>
      </a>
    </Box>
  );
};

export default InstagramItem;
