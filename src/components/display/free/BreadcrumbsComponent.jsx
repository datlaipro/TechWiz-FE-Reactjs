// Component phân trang BreadcrumbsComponent

import React from "react";
import { Box, Container, Typography, Breadcrumbs, Link } from "@mui/material";

const BreadcrumbsComponent = ({ title, breadcrumbs }) => {
  return (
    <Box
      sx={{
        backgroundImage: "url(/demo/images/banner-image-bg-1.jpg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Container>
        <Box textAlign="center">
          <Typography fontSize={80} fontWeight="bold" color="black">
            {title} {/* Nhận title từ props */}
          </Typography>
          <Breadcrumbs
            separator="›"
            sx={{
              justifyContent: "center",
              display: "flex",
              color: "black",
              mt: 1,
              fontSize: "1.3rem",
            }}
          >
            {breadcrumbs.map((breadcrumb, index) =>
              breadcrumb.href ? (
                <Link key={index} href={breadcrumb.href} underline="hover" color="black">
                  {breadcrumb.label}
                </Link>
              ) : (
                <Typography key={index} textDecoration="underline" color="black" sx={{fontSize: "1.3rem"}}>
                  {breadcrumb.label}
                </Typography>
              )
            )}
          </Breadcrumbs>
        </Box>
      </Container>
    </Box>
  );
};

export default BreadcrumbsComponent;
