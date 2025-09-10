import React from "react";
import {
  Menu,
  MenuItem,
  Typography,
  Box,
  Button,
  Divider,
  List,
  ListItem,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";


const WishlistDropdown = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <FavoriteIcon style={{ cursor: "pointer" }} onClick={handleOpen} />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: { width: 300, padding: 16 },
        }}
      >
        <Typography variant="h6" mb={2}>
          Your Wishlist
        </Typography>
        <List>
          <ListItem>
            <Box>
              <Typography variant="subtitle1">The Emerald Crown</Typography>
              <Typography variant="body2">Special discounted price.</Typography>
              <Button variant="text" size="small" sx={{ color: "#14403a" }}>
                Add to cart
              </Button>
            </Box>
            <Typography>$2000</Typography>
          </ListItem>
          <Divider />
          <ListItem>
            <Box>
              <Typography variant="subtitle1">The Last Enchantment</Typography>
              <Typography variant="body2">Perfect for enlightened people.</Typography>
              <Button variant="text" size="small" sx={{ color: "#14403a" }}>
                Add to cart
              </Button>
            </Box>
            <Typography>$29</Typography>
          </ListItem>
        </List>
        <Box mt={2}>
          <Button variant="contained" fullWidth
          sx={{ backgroundColor: "#14403a" }}
          >
            Add all to cart
          </Button>
          <Button variant="outlined" fullWidth sx={{ mt: 1 }} component={Link} to="#" color="error">
          Delete Wishlist
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default WishlistDropdown;
