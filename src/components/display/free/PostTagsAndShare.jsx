// COMPONENT NÀY GẮN DƯỚI CHÂN BÀI VIẾT

import React from "react";
import { Box, Chip, Typography, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, LinkedIn, YouTube } from "@mui/icons-material";

const PostTagsAndShare = () => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
      {/* Tags */}
      <Box>
        {["Books", "Story", "Fictional"].map((tag, index) => (
          <Chip key={index} label={tag} sx={{ marginRight: 1 }} />
        ))}
      </Box>

      {/* Social Links */}
      <Box display="flex" alignItems="center">
        <Typography variant="body2" sx={{ marginRight: 1 }}>
          Share:
        </Typography>
        <IconButton href="#" color="primary">
          <Facebook />
        </IconButton>
        <IconButton href="#" color="secondary">
          <Instagram />
        </IconButton>
        <IconButton href="#" color="primary">
          <Twitter />
        </IconButton>
        <IconButton href="#" color="primary">
          <LinkedIn />
        </IconButton>
        <IconButton href="#" color="error">
          <YouTube />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PostTagsAndShare;
