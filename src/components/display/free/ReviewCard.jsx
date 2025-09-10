import React from "react";
import { Card, Typography, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const ReviewCard = ({ review }) => {
  return (
    <Box>
    <Card
      sx={{
        position: "relative",
        textAlign: "left",
        padding: 5,
        borderRadius: 5,
        boxShadow: "0px 4px 10px rgba(250, 249, 249, 0.2)", // Điều chình bóng mờ
        overflow: "hidden", // Ẩn phần thừa nếu border-radius bị ảnh hưởng
        backgroundColor: "white",
        transition: "transform 0.3s ease, box-shadow 0.3s ease", // Hiệu ứng hover
        // "&:hover": {
        // //   transform: "scale(1.01)", // Phóng to nhẹ khi hover
        //   boxShadow: "0px 6px 15px rgba(250, 224, 224, 0.3)", // Tăng bóng mờ khi hover
        // },
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontStyle: "italic",
          mb: 3,
          color: "text.secondary", // Màu chữ phụ
        }}
      >
        "{review.text}"
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color: "warning.main", // Màu vàng cho rating
          mb: 2,
        }}
      >
        {Array(5)
          .fill()
          .map((_, index) => (
            <StarIcon key={index} />
          ))}
      </Box>
      <Typography
        variant="h6"
        sx={{
          mt: 2,
          fontWeight: "normal",
        //   color: "primary.main", // Màu chính cho tên người đánh giá
        }}
      >
        {review.name}
      </Typography>
    </Card>
    </Box>
  );
};

export default ReviewCard;
