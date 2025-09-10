// import React, { useState } from "react";
// import { Box, Typography, Button, IconButton, List, ListItem, Divider } from "@mui/material";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// import RemoveIcon from "@mui/icons-material/Remove";
// import AddIcon from "@mui/icons-material/Add";
// import StarIcon from "@mui/icons-material/Star";
// import InfoProduct from '../../components/display/product/InfoProduct'; // Component InfoProduct


// const ProductDetail = () => {
//   const [quantity, setQuantity] = useState(1);
//   const product = {
//     name: "The Emerald Crown",
//     price: 200,
//     oldPrice: 260,
//     rating: 5,
//     description: "Justo, cum feugiat imperdiet nulla molestie ac vulputate scelerisque amet.",
//     stock: 2,
//     colors: ["Gray", "Blue", "White"],
//     sizes: ["S", "M", "L"],
//     sku: "1223",
//     categories: ["Romance", "Sci-Fi", "Fiction"],
//     tags: ["Revenge", "Vampire", "Life"],
//   };

//   const handleQuantityChange = (type) => {
//     setQuantity((prev) => (type === "increase" ? prev + 1 : Math.max(1, prev - 1)));
//   };

//   return (
//     <>
//     <Box sx={{ p: 3, maxWidth: 600 }}>
//       <Typography variant="h4" fontWeight="bold">
//         {product.name}
//       </Typography>
//       <Box display="flex" alignItems="center" mt={2}>
//         <Typography variant="h5" color="primary" fontWeight="light" mr={2}>
//           ${product.price}
//         </Typography>
//         <Typography variant="body1" sx={{ textDecoration: "line-through" }}>
//           ${product.oldPrice}
//         </Typography>
//       </Box>
//       <Box display="flex" alignItems="center" mt={1} color="gold">
//         {[...Array(product.rating)].map((_, index) => (
//           <StarIcon key={index} />
//         ))}
//       </Box>
//       <Typography mt={2}>{product.description}</Typography>
//       <Divider sx={{ my: 2 }} />

//       {/* Color Options */}
//       <Typography variant="h6" gutterBottom>
//         Color
//       </Typography>
//       <Box display="flex" gap={2}>
//         {product.colors.map((color) => (
//           <Button key={color} variant="outlined">
//             {color}
//           </Button>
//         ))}
//       </Box>

//       {/* Size Options */}
//       <Typography variant="h6" gutterBottom mt={2}>
//         Size
//       </Typography>
//       <Box display="flex" gap={2}>
//         {product.sizes.map((size) => (
//           <Button key={size} variant="outlined">
//             {size}
//           </Button>
//         ))}
//       </Box>

//       {/* Quantity Selection */}
//       <Typography variant="h6" mt={2}>
//         {product.stock} in stock
//       </Typography>
//       <Box display="flex" alignItems="center" gap={2} mt={1}>
//         <IconButton onClick={() => handleQuantityChange("decrease")}>
//           <RemoveIcon />
//         </IconButton>
//         <Typography>{quantity}</Typography>
//         <IconButton onClick={() => handleQuantityChange("increase")}>
//           <AddIcon />
//         </IconButton>
//       </Box>

//       {/* Action Buttons */}
//       <Box display="flex" gap={2} mt={3}>
//         <Button variant="contained" color="primary">
//           Order Now
//         </Button>
//         <Button variant="contained" color="secondary">
//           Add to Cart
//         </Button>
//         <IconButton>
//           <FavoriteBorderIcon />
//         </IconButton>
//       </Box>

//       <Divider sx={{ my: 2 }} />
//       {/* Meta Information */}
//       <Box>
//         <Typography variant="h6">SKU: {product.sku}</Typography>
//         <Typography variant="h6" mt={1}>Category:</Typography>
//         <List>
//           {product.categories.map((category) => (
//             <ListItem key={category}>{category}</ListItem>
//           ))}
//         </List>
//         <Typography variant="h6">Tags:</Typography>
//         <List>
//           {product.tags.map((tag) => (
//             <ListItem key={tag}>{tag}</ListItem>
//           ))}
//         </List>
//       </Box>
//     </Box>
//     <InfoProduct />
//     </>
//   );
// };

// export default ProductDetail;
