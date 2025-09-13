import React, { useMemo, useState } from "react";
import { Box, Grid, Typography, Stack, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Button } from "@mui/material";
import PostCard from "../../components/display/post/PostCard";
import BreadcrumbsComponent from "../../components/display/free/BreadcrumbsComponent";
import PaginationComponent from "../../components/display/free/PaginationComponent";
import CategoriesSection from "../../components/display/info/CategoriesSection";
import InstagramGallery from "../../components/display/GroupItems/InstagramGallery";
import CustomerReviewsSlider from "../../components/action/CustomerReviewsSlider";

const BlogPage = () => {
  // ===== Dữ liệu mẫu cho "Bản tin sự kiện" =====
  const posts = [
    {
      image: "https://assets-global.website-files.com/605baba32d94435376625d33/6514274edaff1d5c70319e8f_64dcd9b38b33dd95c766b3dd_work-social-events.jpeg",
      category: "Thông báo",
      department: "Khoa CNTT",
      title: "Mở đăng ký Seminar: Ứng dụng AI trong Giáo dục",
      description: "Diễn ra ngày 20/09 tại C204. Số lượng chỗ ngồi có hạn, đăng ký trước 18/09.",
      date: "2025-09-12",
      postLink: "/news/announce-ai-seminar",
      categoryLink: "/news?type=announce",
    },
    {
      image: "https://valterlongo.com/wp-content/uploads/2019/03/coffee-break.jpg",
      category: "Điểm tin",
      department: "Trung tâm Việc làm",
      title: "Career Fair 2025: 60+ doanh nghiệp xác nhận tham dự",
      description: "Có khu vực phỏng vấn trực tiếp, workshop CV và góc ảnh headshot miễn phí.",
      date: "2025-09-10",
      postLink: "/news/career-fair-preview",
      categoryLink: "/news?type=news",
    },
    {
      image: "https://matchboxdesigngroup.com/wp-content/uploads/2023/01/teamwork-marketing-presentation-or-business-man-planning-collaboration-or-working-on-strategy-co-768x383.jpg",
      category: "Hướng dẫn",
      department: "Khoa CNTT",
      title: "Cẩm nang tham gia Hackathon: Smart Campus",
      description: "Chuẩn bị đội hình, timeline 48h, checklist nộp bài, tiêu chí chấm điểm.",
      date: "2025-09-09",
      postLink: "/news/hackathon-guide",
      categoryLink: "/news?type=guide",
    },
    {
      image: "https://matchboxdesigngroup.com/wp-content/uploads/2023/01/brazilian-lady-showing-chart-giving-training-using-laptop-and-monitor-tv-in-indoors-classroom.jpg",
      category: "Thông báo",
      department: "Trung tâm Thể thao",
      title: "Lịch thi đấu University Football Cup 2025",
      description: "Cập nhật bảng đấu, thời gian và địa điểm các trận vòng loại.",
      date: "2025-09-11",
      postLink: "/news/football-cup-schedule",
      categoryLink: "/news?type=announce",
    },
    {
      image: "https://matchboxdesigngroup.com/wp-content/uploads/2023/01/social-media-network-diagram-1536x1028.jpg",
      category: "Recap",
      department: "Phòng Công tác SV",
      title: "Recap Tuần lễ Định hướng Tân sinh viên",
      description: "Những khoảnh khắc ấn tượng, tài liệu & câu hỏi thường gặp.",
      date: "2025-09-05",
      postLink: "/news/orientation-recap",
      categoryLink: "/news?type=recap",
    },
    {
      image: "https://matchboxdesigngroup.com/wp-content/uploads/2025/08/UXUI-blog-cover.png",
      category: "Thông báo",
      department: "Đoàn – Hội",
      title: "Hiến máu nhân đạo: Giọt hồng Tri ân",
      description: "Đăng ký ca hiến từ 07:30–11:30, ngày 28/09 tại Nhà thi đấu Đa năng.",
      date: "2025-09-08",
      postLink: "/news/blood-donation-call",
      categoryLink: "/news?type=announce",
    },
    {
      image: "https://matchboxdesigngroup.com/wp-content/uploads/2025/05/word-image-29645-1.jpeg",
      category: "Điểm tin",
      department: "Khoa An toàn thông tin",
      title: "Điểm tin: Chuỗi seminar An toàn thông tin tháng 9",
      description: "4 buổi/tuần, chủ đề SOC, DFIR, Web Security, Cloud Security.",
      date: "2025-09-07",
      postLink: "/news/cybersecurity-series",
      categoryLink: "/news?type=news",
    },
    {
      image: "https://matchboxdesigngroup.com/wp-content/uploads/2025/07/Data-First-Bank-Marketing-Matchbox-Design-Group.jpg",
      category: "Hướng dẫn",
      department: "Đoàn – Hội",
      title: "Hướng dẫn đăng ký tình nguyện viên sự kiện lớn",
      description: "Yêu cầu, quyền lợi, quy trình duyệt & chấm công giờ CTXH.",
      date: "2025-09-06",
      postLink: "/news/volunteer-handbook",
      categoryLink: "/news?type=guide",
    },
  ];

  // ===== Bộ lọc nhanh =====
  const [q, setQ] = useState("");
  const [type, setType] = useState(""); // Thông báo | Điểm tin | Recap | Hướng dẫn
  const [dept, setDept] = useState(""); // Khoa/Phòng ban

  const typeOptions = ["Thông báo", "Điểm tin", "Recap", "Hướng dẫn"];
  const deptOptions = [
    "Khoa CNTT",
    "Trung tâm Việc làm",
    "Trung tâm Thể thao",
    "Phòng Công tác SV",
    "Đoàn – Hội",
    "Khoa An toàn thông tin",
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
        title="Bản tin sự kiện"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blog" },
        ]}
      />

      <Box sx={{ py: 4 }}>
        {/* Header + filter */}
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
                Bản tin sự kiện
              </Typography>
              <Chip
                label={`${filtered.length} bài viết`}
                variant="outlined"
                size="small"
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: { xs: "100%", md: "auto" } }}>
              <TextField
                size="small"
                placeholder="Tìm theo tiêu đề, nội dung…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                fullWidth
              />
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Loại bản tin</InputLabel>
                <Select
                  label="Loại bản tin"
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

              <FormControl size="small" sx={{ minWidth: 180 }}>
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
            </Stack>
          </Stack>
        </Box>

        {/* Grid bài viết */}
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
                sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
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
      {/* TODO: Khi có API, truyền page & totalPages để phân trang thực */}

      {/* Album ảnh & phản hồi (có thể đổi thành "Cảm nhận người tham gia") */}
      <InstagramGallery />
      <CustomerReviewsSlider />
      <CategoriesSection />
    </>
  );
};

export default BlogPage;
