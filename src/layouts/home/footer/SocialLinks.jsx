import React from "react";
import { Box, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";

const SocialLinks = () => {
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <IconButton href="#" aria-label="Facebook">
        <FacebookIcon />
      </IconButton>
      <IconButton href="#" aria-label="Instagram">
        <InstagramIcon />
      </IconButton>
      <IconButton href="#" aria-label="Twitter">
        <TwitterIcon />
      </IconButton>
      <IconButton href="#" aria-label="LinkedIn">
        <LinkedInIcon />
      </IconButton>
      <IconButton href="#" aria-label="YouTube">
        <YouTubeIcon />
      </IconButton>
    </Box>
  );
};

export default SocialLinks;
