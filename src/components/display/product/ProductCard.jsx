// import React from 'react';
// import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
// import StarIcon from '@mui/icons-material/Star';
// import CardActions from '../../action/CardActions';
// import { useNavigate } from 'react-router-dom';

// const ProductCard = ({ product }) => {
//   const navigate = useNavigate();

//   const handleNavigate = () => {
//     navigate(`/productdetail`);
//   };

//   return (
//     <Card
//       sx={{
//         position: 'relative',
//         pt: 2,
//         pr: 2,
//         pb: 0.5,
//         pl: 2,
//         borderRadius: 3,
//         boxShadow: 'none',
//         border: '1px solid #ddd',
//         bgcolor: 'background.paper',
//         width: '100%',
//         height: 'auto',
//         display: 'flex',
//         flexDirection: 'column',
//         overflow: 'hidden',
//         '&:hover .card-actions': {
//           opacity: '1 !important',
//         },
//       }}
//     >
//       {/* Các nút hành động CardActions */}
//       <CardActions
//         className="card-actions"
//         product={product} // Truyền product vào CardActions
//         sx={{
//           position: 'absolute',
//           top: '90%',
//           left: '75%',
//           transform: 'translate(-50%, -50%)',
//           opacity: 0,
//           transition: 'opacity 0.3s ease',
//           zIndex: 2,
//         }}
//       />

//       {/* Hiển thị giảm giá */}
//       {product.discount && (
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 8,
//             right: 8,
//             bgcolor: '#F86D72',
//             color: 'white',
//             borderRadius: 1,
//             px: 1,
//             py: 0.5,
//             fontSize: '0.8rem',
//           }}
//         >
//           {product.discount}
//         </Box>
//       )}

//       {/* Ảnh sản phẩm */}
//       <CardMedia
//         component="img"
//         height="auto"
//         image={product.image}
//         alt={product.name}
//         sx={{ borderRadius: 2, boxShadow: 2, cursor: 'pointer' }}
//         onClick={handleNavigate}
//       />

//       <CardContent sx={{ flex: 1 }}>
//         {/* Tên sản phẩm */}
//         <Typography
//           variant="h7"
//           component="div"
//           sx={{
//             fontWeight: 'bold',
//             mb: 1,
//             whiteSpace: 'nowrap',
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             cursor: 'pointer',
//             '&:hover': { color: '#F86D72' },
//           }}
//           onClick={handleNavigate}
//         >
//           {product.name}
//         </Typography>

//         {/* Tác giả và Rating */}
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//           <Typography
//             variant="body2"
//             color="text.secondary"
//             sx={{
//               mr: 1,
//               whiteSpace: 'nowrap',
//               overflow: 'hidden',
//               textOverflow: 'ellipsis',
//             }}
//           >
//             {product.author}
//           </Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             {Array.from({ length: product.rating }, (_, index) => (
//               <StarIcon
//                 key={index}
//                 sx={{ color: 'gold', fontSize: 16, fontWeight: 'bold' }}
//               />
//             ))}
//           </Box>
//         </Box>

//         <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#F86D72', mt: 1 }}>
//           ${product.price}
//         </Typography>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProductCard;

import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CardActions from '../../action/CardActions';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/productdetail/${product.id}`);
  };

  return (
    <Card
      sx={{
        position: 'relative',
        pt: 2,
        pr: 2,
        pb: 0.5,
        pl: 2,
        borderRadius: 3,
        boxShadow: 'none',
        border: '1px solid #ddd',
        bgcolor: 'background.paper',
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        '&:hover .card-actions': {
          opacity: '1 !important',
        },
      }}
    >
      {/* Các nút hành động CardActions */}
      <CardActions
        className="card-actions"
        product={product}
        sx={{
          position: 'absolute',
          top: '90%',
          left: '75%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          zIndex: 2,
        }}
      />

      {/* Hiển thị giảm giá */}
      {product.discount && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: '#F86D72',
            color: 'white',
            borderRadius: 1,
            px: 1,
            py: 0.5,
            fontSize: '0.8rem',
          }}
        >
          {product.discount}
        </Box>
      )}

      {/* Ảnh sản phẩm */}
      <CardMedia
        component="img"
        height="auto"
        image={product.image}
        alt={product.name}
        sx={{ borderRadius: 2, boxShadow: 2, cursor: 'pointer', maxHeight: '300px' }}
        onClick={handleNavigate}
      />

      <CardContent sx={{ flex: 1 }}>
        {/* Tên sản phẩm */}
        <Typography
          variant="h7"
          component="div"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
            '&:hover': { color: '#F86D72' },
          }}
          onClick={handleNavigate}
        >
          {product.name}
        </Typography>

        {/* Tác giả và Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mr: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.author}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {Array.from({ length: product.rating }, (_, index) => (
              <StarIcon
                key={index}
                sx={{ color: 'gold', fontSize: 16, fontWeight: 'bold' }}
              />
            ))}
          </Box>
        </Box>

        {/* Giá và giá khuyến mại */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#F86D72',
              mt: 1,
              ...(product.salePrice && {
                textDecoration: 'line-through',
                color: 'text.secondary',
                fontSize: '1rem',
              }),
            }}
          >
            {product.price.toLocaleString('vi-VN')} $
          </Typography>
          {product.salePrice && (
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', color: '#F86D72', mt: 1 }}
            >
              {product.salePrice.toLocaleString('vi-VN')} $
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;