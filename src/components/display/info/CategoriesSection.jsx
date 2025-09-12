import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardActionArea,
  Chip,
  Stack,
  Link as MUILink,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ScienceRounded from "@mui/icons-material/ScienceRounded";
import TheatersRounded from "@mui/icons-material/TheatersRounded";
import SportsSoccerRounded from "@mui/icons-material/SportsSoccerRounded";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import CampaignRounded from "@mui/icons-material/CampaignRounded";

const ICONS = {
  technical: <ScienceRounded />,
  cultural: <TheatersRounded />,
  sports: <SportsSoccerRounded />,
  academic: <SchoolRounded />,
  clubs: <GroupsRounded />,
  admissions: <CampaignRounded />,
};

export default function EventCategoriesSection() {
  const categories = [
    {
      key: "technical",
      title: "Technical",
      image: "/demo/images/cat-technical.jpg",
      link: "/events?category=technical",
    },
    {
      key: "cultural",
      title: "Cultural & Arts",
      image: "/demo/images/cat-cultural.jpg",
      link: "/events?category=cultural",
    },
    {
      key: "sports",
      title: "Sports",
      image: "/demo/images/cat-sports.jpg",
      link: "/events?category=sports",
    },
    {
      key: "academic",
      title: "Academic & Seminar",
      image: "/demo/images/cat-academic.jpg",
      link: "/events?category=academic",
    },
    {
      key: "clubs",
      title: "Clubs & Societies",
      image: "/demo/images/cat-clubs.jpg",
      link: "/events?category=clubs",
    },
    {
      key: "admissions",
      title: "Admissions & Orientation",
      image: "/demo/images/cat-admissions.jpg",
      link: "/events?category=admissions",
    },
  ];

  const quickFilters = [
    { label: "This week", href: "/events?when=this-week" },
    { label: "This month", href: "/events?when=this-month" },
    { label: "Free entry", href: "/events?free=true" },
    { label: "Online", href: "/events?mode=online" },
    { label: "Nearby", href: "/events?near=me" },
  ];

  return (
    <Box id="categories" sx={{ py: 4, width: "100%" }}>
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, md: 3 },
        }}
      >
        {/* Title + Quick filters */}
        <Box
          mb={3}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h4" sx={{ fontSize: 32 }}>
            Browse by Topic
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{ overflowX: "auto", pb: 0.5 }}
          >
            {quickFilters.map((f, i) => (
              <Chip
                key={i}
                component={MUILink}
                clickable
                href={f.href}
                label={f.label}
                variant="outlined"
                sx={{ textDecoration: "none" }}
              />
            ))}
          </Stack>
        </Box>

        {/* Category cards */}
        <Grid container spacing={4} sx={{ alignItems: "stretch" }}>
          {categories.map((c) => (
            <Grid key={c.key} xs={12} sm={6} md={4}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <CardActionArea
                  href={c.link}
                  sx={{
                    position: "relative",
                    height: 240,
                    "&:hover .overlay": { opacity: 1 },
                    "&:hover img": { transform: "scale(1.04)" },
                  }}
                >
                  <Box
                    component="img"
                    src={c.image}
                    alt={c.title}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform .35s ease",
                      display: "block",
                    }}
                  />
                  {/* gradient overlay */}
                  <Box
                    className="overlay"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 100%)",
                      opacity: 0.85,
                      transition: "opacity .3s ease",
                    }}
                  />
                  {/* label */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 16,
                      bottom: 16,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Chip
                      icon={ICONS[c.key]}
                      label={c.title}
                      color="primary"
                      sx={{
                        color: "primary.contrastText",
                        bgcolor: "primary.main",
                        "& .MuiChip-icon": { color: "inherit" },
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
