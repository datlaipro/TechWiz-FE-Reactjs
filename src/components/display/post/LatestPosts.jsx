import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import PostCard from "./PostCard";

const LatestPosts = () => {
  // ===== Demo events (hard-coded) =====
  const events = [
    {
      image: "https://picsum.photos/id/1003/1200/800",
      category: "Orientation", // type
      department: "Student Affairs Office",
      title: "Freshmen Orientation Week 2025",
      description:
        "Welcome freshmen: campus tour, scholarship talk show, and club activities.",
      date: "2025-09-15",
      time: "08:00–16:30",
      location: "A1 Auditorium",
      postLink: "/events/orientation-2025",
      categoryLink: "/events?type=orientation",
    },
    {
      image: "https://picsum.photos/id/1003/1200/800",
      category: "Seminar",
      department: "IT Faculty",
      title: "Seminar: AI Applications in Education",
      description:
        "A talk by an EdTech speaker on LLMs and personalized learning.",
      date: "2025-09-20",
      time: "13:30–15:30",
      location: "Room C204",
      postLink: "/events/ai-in-education-llm",
      categoryLink: "/events?type=seminar",
    },
    {
      image: "https://picsum.photos/id/1003/1200/800",
      category: "Orientation",
      department: "Student Affairs Office",
      title: "Freshmen Orientation Week 2025",
      description:
        "Welcome freshmen: campus tour, scholarship talk show, and club activities.",
      date: "2025-09-15",
      time: "08:00–16:30",
      location: "A1 Auditorium",
      postLink: "/events/orientation-2025",
      categoryLink: "/events?type=orientation",
    },
    {
      image: "https://picsum.photos/id/1003/1200/800",
      category: "Orientation",
      department: "Student Affairs Office",
      title: "Freshmen Orientation Week 2025",
      description:
        "Welcome freshmen: campus tour, scholarship talk show, and club activities.",
      date: "2025-09-15",
      time: "08:00–16:30",
      location: "A1 Auditorium",
      postLink: "/events/orientation-2025",
      categoryLink: "/events?type=orientation",
    },
  ];

  // ===== Filters =====
  const [q, setQ] = useState("");
  const [type, setType] = useState(""); // category/type
  const [dept, setDept] = useState(""); // department
  const [timeframe, setTimeframe] = useState("week"); // week | month | all

  const withinTimeframe = (isoDate, mode) => {
    const d = new Date(isoDate);
    const now = new Date();
    if (mode === "all") return true;

    const msPerDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((d - now) / msPerDay); // future if >= 0
    if (mode === "week") return diffDays >= -1 && diffDays <= 7; // from yesterday -> next 7 days
    if (mode === "month") return diffDays >= -3 && diffDays <= 31; // small buffer
    return true;
  };

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchQ =
        !q ||
        e.title.toLowerCase().includes(q.toLowerCase()) ||
        e.description.toLowerCase().includes(q.toLowerCase()) ||
        e.location.toLowerCase().includes(q.toLowerCase());
      const matchType = !type || e.category === type;
      const matchDept = !dept || e.department === dept;
      const matchTime = withinTimeframe(e.date, timeframe);
      return matchQ && matchType && matchDept && matchTime;
    });
  }, [q, type, dept, timeframe]);

  // Helper: render date/time/location under title (put into PostCard description)
  const formatMeta = (e) =>
    `${new Date(e.date).toLocaleDateString("en-US")} • ${e.time} • ${e.location}`;

  // ===== Unique lists for Select =====
  const typeOptions = [
    "Orientation",
    "Seminar",
    "Competition",
    "Hackathon",
    "Volunteer",
    "Career Fair",
  ];
  const deptOptions = [
    "Student Affairs Office",
    "IT Faculty",
    "Sports Center",
    "Youth Union & Student Association",
    "Career Center",
  ];

  return (
    <Box id="latest-events" sx={{ py: 6, backgroundColor: "#fff" }}>
      {/* Header + CTA */}
      <Grid
        container
        spacing={3}
        sx={{ maxWidth: 1280, mx: "auto", px: { xs: 2, sm: 3, md: 4 } }}
      >
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="h4"
              component="h3"
              sx={{ fontWeight: 700, letterSpacing: 0.2 }}
            >
              Upcoming events
            </Typography>
            <Chip
              label={`${filtered.length} events`}
              variant="outlined"
              size="small"
            />
          </Stack>

          <Button
            href="/events/calendar"
            variant="contained"
            sx={{
              backgroundColor: "#F86D72",
              color: "#FFFFFF",
              fontSize: "0.875rem",
              borderRadius: "30px",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": { backgroundColor: "#D85A60" },
            }}
          >
            View calendar
          </Button>
        </Grid>

        {/* Filters */}
        <Grid item xs={12}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <TextField
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by keywords: title, description, location…"
              size="small"
              fullWidth
            />

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Event type</InputLabel>
              <Select
                label="Event type"
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

            <FormControl size="small" sx={{ minWidth: 200 }}>
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

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Time range</InputLabel>
              <Select
                label="Time range"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <MenuItem value="week">Within 1 week</MenuItem>
                <MenuItem value="month">Within 1 month</MenuItem>
                <MenuItem value="all">All</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>

        {/* Cards */}
        {filtered.map((e, idx) => (
          <Grid
            item
            key={idx}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box sx={{ width: 350, maxHeight: 520, overflow: "hidden" }}>
              <PostCard
                image={e.image}
                category={`${e.category} • ${e.department}`}
                title={e.title}
                description={`${formatMeta(e)} — ${e.description}`}
                postLink={e.postLink}
                categoryLink={e.categoryLink}
              />
            </Box>
          </Grid>
        ))}

        {/* Empty state */}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: "center",
                py: 6,
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 2,
                width: "100%",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                No matching events found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting the keywords, event type, department, or time
                range.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default LatestPosts;
