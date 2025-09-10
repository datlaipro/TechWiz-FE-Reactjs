import React from "react";
import { Box, Typography, Link, List, ListItem } from "@mui/material";

const FooterColumn = ({ title, items }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ pb: 2, fontWeight: "bold" }} color="textSecondary">
        {title}
      </Typography>
      {Array.isArray(items) ? (
        <List sx={{ p: 0 }}>
          {items.map((item, index) => (
            <ListItem key={index} sx={{ p: 0, mb: 1 }}>
              <Link href={item.link} underline="hover" color="textSecondary">
                {item.label}
              </Link>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="textSecondary">
          {items}
        </Typography>
      )}
    </Box>
  );
};

export default FooterColumn;
