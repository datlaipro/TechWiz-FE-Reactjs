// Đây là Card bài viết, có thể tái sử dụng


import React from "react";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const PostCard = ({ image, category, title, description, postLink }) => {
  const navigate = useNavigate(); // Khởi tạo useNavigate

  return (
    // <Card 
    //   sx={{ 
    //     // borderRadius: 3, 
    //     boxShadow: 0, 
    //     maxWidth: 345, 
    //     position: "relative", 
    //     // cursor: "pointer", // Hiệu ứng khi hover
    //     transition: "0.3s", // Hiệu ứng khi hover
    //     "&:hover": { boxShadow: 3 }
    //   }}
    //   // onClick={() => navigate(postLink)} // Khi click vào toàn bộ Card → điều hướng
    // >
    <Card sx={{ borderRadius: 3, boxShadow: 0, maxWidth: 345, position: "relative" }}>
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt="Post image"
        sx={{ borderRadius: "12px 12px 0 0", position: "absolute", top: 0, left: 0, width: "100%" }}
      />
      <CardContent sx={{ paddingTop: "210px" }}>
        <Typography variant="body2" color="#677d72">
          {category}
        </Typography>
        <Typography 
          variant="h6" 
          component="h4" 
          sx={{ mt: 1, mb: 1, fontWeight: "bold", "&:hover": { color: "#F86D72" } }}
          onClick={(e) => { 
            e.stopPropagation(); // Ngăn chặn sự kiện click vào card
            navigate(postLink);
          }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "18px" }}>
          {description}{" "}
          <span 
            style={{ color: "gray", cursor: "pointer", textDecoration: "underline" }}
            onClick={(e) => { 
              e.stopPropagation(); // Ngăn chặn sự kiện click vào card
              navigate(postLink);
            }}
          >
            Read More
          </span>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PostCard;


// Card cũ

// import React from "react";
// import { Box, Typography, Link, Card, CardMedia, CardContent } from "@mui/material";

// const PostCard = ({ image, category, title, description, postLink, categoryLink }) => {
//   return (
//     <Card sx={{ borderRadius: 3, boxShadow: 0, maxWidth: 345, position: "relative" }}>
//       <CardMedia
//         component="img"
//         height="200"
//         image={image}
//         alt="Post image"
//         sx={{ borderRadius: "12px 12px 0 0", position: "absolute", top: 0, left: 0, width: "100%" }}
//       />
//       <CardContent sx={{ paddingTop: '210px' }}>
//         {/* Điều chỉnh padding top để không bị che bởi CardMedia
//         Nếu không có padding top, phần nội dung sẽ bị che bởi CardMedia
//         Nếu không phải bỏ absolute và relative phía trên đi
//         */}
//         <Link href={categoryLink} underline="hover" color="primary" variant="body2">
//           {category}
//         </Link>
//         <Typography variant="h6" component="h4" sx={{ mt: 1, mb: 1, fontWeight: "bold" }}>
//           <Link href={postLink} underline="none" color="text.primary"
//           sx={{ '&:hover': { color: '#F86D72', textDecoration: 'none', } }}
//           >
//             {title}
//           </Link>
//         </Typography>
//         {/* <Typography variant="body2" color="text.secondary" > */}
//         <Typography variant="body2" color="text.secondary" sx={{fontSize: '18px' }} >

//           {description}{" "}
//           <Link href={postLink} underline="hover" color="text.primary">
//             Read More
//           </Link>
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// export default PostCard;
