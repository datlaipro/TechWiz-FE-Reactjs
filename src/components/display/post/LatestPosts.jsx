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
  // ===== Demo events (hard-code) =====
  const events = [
    {
      image: "/demo/events/orientation.jpg",
      category: "Orientation", // type
      department: "Phòng Công tác SV",
      title: "Tuần lễ Định hướng Tân sinh viên 2025",
      description:
        "Chào mừng tân sinh viên: tour campus, talk show học bổng, hoạt động câu lạc bộ.",
      date: "2025-09-15",
      time: "08:00–16:30",
      location: "Hội trường A1",
      postLink: "/events/orientation-2025",
      categoryLink: "/events?type=orientation",
    },
    {
      image: "/demo/events/ai-seminar.jpg",
      category: "Seminar",
      department: "Khoa CNTT",
      title: "Seminar: Ứng dụng AI trong Giáo dục",
      description:
        "Chia sẻ của diễn giả từ doanh nghiệp EdTech về LLM, cá nhân hoá học tập.",
      date: "2025-09-20",
      time: "13:30–15:30",
      location: "Phòng C204",
      postLink: "/events/ai-in-education-llm",
      categoryLink: "/events?type=seminar",
    },
    {
      image: "/demo/events/football-cup.jpg",
      category: "Competition",
      department: "Trung tâm Thể thao",
      title: "University Football Cup 2025",
      description:
        "Giải bóng đá nam nữ toàn trường – vòng loại & chung kết trực tiếp.",
      date: "2025-09-22",
      time: "17:00–20:30",
      location: "Sân vận động B",
      postLink: "/events/university-football-cup-2025",
      categoryLink: "/events?type=competition",
    },
    {
      image: "/demo/events/hackathon.jpg",
      category: "Hackathon",
      department: "Khoa CNTT",
      title: "Hackathon: Smart Campus",
      description:
        "48h xây prototype giải quyết bài toán SmartParking, SmartCard, E-Queue.",
      date: "2025-10-01",
      time: "08:00–08:00 (+2 ngày)",
      location: "Innovation Lab",
      postLink: "/events/hackathon-smart-campus",
      categoryLink: "/events?type=hackathon",
    },
    {
      image: "/demo/events/blood-donation.jpg",
      category: "Volunteer",
      department: "Đoàn – Hội",
      title: "Hiến máu nhân đạo – Giọt hồng Tri ân",
      description:
        "Chương trình thiện nguyện thường niên, mỗi giọt máu cho đi – một cuộc đời ở lại.",
      date: "2025-09-28",
      time: "07:30–11:30",
      location: "Nhà thi đấu Đa năng",
      postLink: "/events/blood-donation-2025",
      categoryLink: "/events?type=volunteer",
    },
    {
      image: "/demo/events/career-fair.jpg",
      category: "Career Fair",
      department: "Trung tâm Việc làm",
      title: "Career Fair 2025: 60+ Doanh nghiệp",
      description:
        "Phỏng vấn trực tiếp, workshop CV/LinkedIn, góc ảnh CV headshot miễn phí.",
      date: "2025-10-05",
      time: "08:30–16:00",
      location: "Sảnh Nhà E",
      postLink: "/events/career-fair-2025",
      categoryLink: "/events?type=career",
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
    if (mode === "week") return diffDays >= -1 && diffDays <= 7; // từ hôm qua -> 7 ngày tới
    if (mode === "month") return diffDays >= -3 && diffDays <= 31; // buffer nhẹ
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

  // Helper render line under title for date/time/location (đưa vào description cho PostCard)
  const formatMeta = (e) =>
    `${new Date(e.date).toLocaleDateString("vi-VN")} • ${e.time} • ${e.location}`;

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
    "Phòng Công tác SV",
    "Khoa CNTT",
    "Trung tâm Thể thao",
    "Đoàn – Hội",
    "Trung tâm Việc làm",
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
              Sự kiện sắp diễn ra
            </Typography>
            <Chip
              label={`${filtered.length} sự kiện`}
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
            Xem lịch
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
              placeholder="Tìm theo từ khóa: tiêu đề, mô tả, địa điểm…"
              size="small"
              fullWidth
            />

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Loại sự kiện</InputLabel>
              <Select
                label="Loại sự kiện"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {typeOptions.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Phòng ban</InputLabel>
              <Select
                label="Phòng ban"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {deptOptions.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Mốc thời gian</InputLabel>
              <Select
                label="Mốc thời gian"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <MenuItem value="week">Trong 1 tuần</MenuItem>
                <MenuItem value="month">Trong 1 tháng</MenuItem>
                <MenuItem value="all">Tất cả</MenuItem>
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

        {/* Nếu không có kết quả */}
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
                Chưa tìm thấy sự kiện phù hợp
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hãy thử đổi từ khóa, loại sự kiện, phòng ban hoặc mốc thời gian.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default LatestPosts;
