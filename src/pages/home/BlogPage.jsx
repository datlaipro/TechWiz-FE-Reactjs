import React, { useMemo, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
} from "@mui/material";
import PostCard from "../../components/display/post/PostCard";
import BreadcrumbsComponent from "../../components/display/free/BreadcrumbsComponent";
import PaginationComponent from "../../components/display/free/PaginationComponent";
import CategoriesSection from "../../components/display/info/CategoriesSection";
import InstagramGallery from "../../components/display/GroupItems/InstagramGallery";
import CustomerReviewsSlider from "../../components/action/CustomerReviewsSlider";

const BlogPage = () => {
  // ===== Sample data for "Event News" =====
  const posts = [
    {
      image:
        "https://assets-global.website-files.com/605baba32d94435376625d33/6514274edaff1d5c70319e8f_64dcd9b38b33dd95c766b3dd_work-social-events.jpeg",
      category: "Announcement",
      department: "IT Faculty",
      title: "Registration Open: Seminar on AI in Education",
      description:
        "Takes place on September 20 at C204. Limited seats—register by September 18.",
      date: "2025-09-12",
      postLink: "/news/announce-ai-seminar",
      categoryLink: "/news?type=announce",
    },
    {
      image: "https://valterlongo.com/wp-content/uploads/2019/03/coffee-break.jpg",
      category: "News",
      department: "Career Center",
      title: "Career Fair 2025: 60+ Companies Confirmed",
      description:
        "On-site interviews, CV workshops, and a free headshot corner.",
      date: "2025-09-10",
      postLink: "/news/career-fair-preview",
      categoryLink: "/news?type=news",
    },
    {
      image:
        "https://matchboxdesigngroup.com/wp-content/uploads/2023/01/teamwork-marketing-presentation-or-business-man-planning-collaboration-or-working-on-strategy-co-768x383.jpg",
      category: "Guide",
      department: "IT Faculty",
      title: "Handbook for the Smart Campus Hackathon",
      description:
        "Team prep, 48-hour timeline, submission checklist, and scoring criteria.",
      date: "2025-09-09",
      postLink: "/news/hackathon-guide",
      categoryLink: "/news?type=guide",
    },
    {
      image:
        "https://matchboxdesigngroup.com/wp-content/uploads/2023/01/brazilian-lady-showing-chart-giving-training-using-laptop-and-monitor-tv-in-indoors-classroom.jpg",
      category: "Announcement",
      department: "Sports Center",
      title: "Match Schedule: University Football Cup 2025",
      description:
        "Group tables, times, and venues for the qualifiers.",
      date: "2025-09-11",
      postLink: "/news/football-cup-schedule",
      categoryLink: "/news?type=announce",
    },
    {
      image:
        "https://matchboxdesigngroup.com/wp-content/uploads/2023/01/social-media-network-diagram-1536x1028.jpg",
      category: "Recap",
      department: "Student Affairs Office",
      title: "Recap: Freshmen Orientation Week",
      description:
        "Highlights, materials, and frequently asked questions.",
      date: "2025-09-05",
      postLink: "/news/orientation-recap",
      categoryLink: "/news?type=recap",
    },
    {
      image:
        "https://matchboxdesigngroup.com/wp-content/uploads/2025/08/UXUI-blog-cover.png",
      category: "Announcement",
      department: "Youth Union & Student Association",
      title: "Blood Donation Drive: Grateful Drops",
      description:
        "Register for donation slots 07:30–11:30, September 28 at the Multi-purpose Gym.",
      date: "2025-09-08",
      postLink: "/news/blood-donation-call",
      categoryLink: "/news?type=announce",
    },
    {
      image:
        "https://matchboxdesigngroup.com/wp-content/uploads/2025/05/word-image-29645-1.jpeg",
      category: "News",
      department: "Information Security Faculty",
      title: "News: September Information Security Seminar Series",
      description:
        "Four sessions/week: SOC, DFIR, Web Security, and Cloud Security.",
      date: "2025-09-07",
      postLink: "/news/cybersecurity-series",
      categoryLink: "/news?type=news",
    },
    {
      image:
        "https://matchboxdesigngroup.com/wp-content/uploads/2025/07/Data-First-Bank-Marketing-Matchbox-Design-Group.jpg",
      category: "Guide",
      department: "Youth Union & Student Association",
      title: "Guide: Registering as a Volunteer for Major Events",
      description:
        "Requirements, benefits, approval process, and community service hour tracking.",
      date: "2025-09-06",
      postLink: "/news/volunteer-handbook",
      categoryLink: "/news?type=guide",
    },
  ];

  // ===== Quick filters =====
  const [q, setQ] = useState("");
  const [type, setType] = useState(""); // Announcement | News | Recap | Guide
  const [dept, setDept] = useState(""); // Department/Faculty

  const typeOptions = ["Announcement", "News", "Recap", "Guide"];
  const deptOptions = [
    "IT Faculty",
    "Career Center",
    "Sports Center",
    "Student Affairs Office",
    "Youth Union & Student Association",
    "Information Security Faculty",
  ];

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase());
      const matchType = !type || p.category === type;
      const matchDept = !dept || p.department === dept;
      return matchQ && matchType && matchDept;
    });
  }, [q, type, dept, posts]);

  return (
    <>
      <BreadcrumbsComponent
        title="Event News"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
      />

      <Box sx={{ py: 4 }}>
        {/* Header + filters */}
        <Box
          sx={{
            maxWidth: "xl",
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
            mb: 2,
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Event News
              </Typography>
              <Chip
                label={`${filtered.length} posts`}
                variant="outlined"
                size="small"
              />
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              <TextField
                size="small"
                placeholder="Search by title or content…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                fullWidth
              />
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>News type</InputLabel>
                <Select
                  label="News type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {typeOptions.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  label="Department"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  {deptOptions.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Box>

        {/* Posts grid */}
        <Box id="news-list" sx={{ py: 2 }}>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ width: "100%", maxWidth: "xl", m: "0 auto" }}
          >
            {filtered.map((post, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={3}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: 350,
                    maxHeight: 500,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                >
                  <PostCard
                    image={post.image}
                    category={`${post.category} • ${post.department}`}
                    title={post.title}
                    description={post.description}
                    postLink={post.postLink}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <PaginationComponent />
      {/* TODO: When the API is ready, pass page & totalPages for real pagination */}

      {/* Photo album & feedback (can be renamed to "Participant Testimonials") */}
      <InstagramGallery />
      <CustomerReviewsSlider />
      <CategoriesSection />
    </>
  );
};

export default BlogPage;
