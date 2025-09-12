import React from "react";
import {
  Container, Box, Grid, Typography, Button, Chip, List, ListItem, ListItemIcon,
  ListItemText, Paper, Link as MuiLink
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import PlaceRounded from "@mui/icons-material/PlaceRounded";
import QueueMusicRounded from "@mui/icons-material/QueueMusicRounded";
import RuleRounded from "@mui/icons-material/RuleRounded";
import HelpOutlineRounded from "@mui/icons-material/HelpOutlineRounded";
import DirectionsRounded from "@mui/icons-material/DirectionsRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";

const ACCENT = "#F86D72";

const InfoProduct = ({ event }) => {
  // dữ liệu có thể truyền từ ProductDetail, nếu thiếu dùng fallback
  const title = event?.title || "Your Event Title";
  const dateText =
    event?.eventDateText ||
    (event?.startTime && event?.endTime ? `${event.startTime} – ${event.endTime}` : "TBA");
  const venueName = event?.venueName || "Main Hall / Arena";
  const venueAddress = event?.venueAddress || "123 Example St, City, Country";
  const priceFrom = event?.priceFrom ?? event?.price ?? 150000;

  const lineup = event?.lineup || [
    { time: "18:30", act: "Mở cổng · Check-in" },
    { time: "19:30", act: "Artist A" },
    { time: "20:15", act: "Artist B" },
    { time: "21:00", act: "Headliner" },
    { time: "22:30", act: "Encore & Goodbye" },
  ];

  const rules = event?.rules || [
    "Không mang đồ uống có cồn từ bên ngoài.",
    "Hạn chế balo lớn; kiểm tra an ninh tại cổng.",
    "Không dùng flycam/professional camera khi chưa có phép.",
    "Giữ khoảng cách an toàn, tuân thủ hướng dẫn BTC.",
  ];

  const faqs = event?.faqs || [
    { q: "Vé có hoàn/đổi được không?", a: "Không hoàn/đổi sau khi thanh toán, trừ trường hợp sự kiện hủy/hoãn." },
    { q: "Trẻ em có vào cửa được không?", a: "Có, đi kèm người lớn; một số khu vực có giới hạn độ tuổi." },
    { q: "Có bãi đỗ xe không?", a: "Có bãi đỗ thu phí theo giờ ngay trong khuôn viên/đối diện cổng." },
  ];

  const mapEmbedUrl = event?.mapEmbedUrl
    ? event.mapEmbedUrl
    : `https://www.google.com/maps?q=${encodeURIComponent(venueAddress)}&output=embed`;

  const fmtVND = (n) =>
    typeof n === "number" ? new Intl.NumberFormat("vi-VN").format(n) + " đ" : n;

  const go = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <Container sx={{ mt: 4 }}>
      {/* NAV mục lục kiểu sự kiện */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          justifyContent: { xs: "center", md: "flex-start" },
          mb: 2,
        }}
      >
        {[
          ["overview", "Tổng quan"],
          ["lineup", "Line-up & Schedule"],
          ["venue", "Địa điểm & Bản đồ"],
          ["rules", "Nội quy"],
          ["faq", "FAQ"],
        ].map(([id, label]) => (
          <Chip
            key={id}
            label={label}
            onClick={() => go(id)}
            sx={{
              px: 1.2,
              "&:hover": { bgcolor: `${ACCENT}14` },
              borderRadius: 999,
            }}
            clickable
          />
        ))}
      </Box>

      <Grid container spacing={3} alignItems="flex-start">
        {/* LEFT CONTENT */}
        <Grid item xs={12} md={8}>
          {/* OVERVIEW */}
          <Section id="overview" title="Tổng quan">
            <Typography variant="h6" sx={{ mb: 1 }}>
              {title} – Đêm nhạc bùng nổ cảm xúc!
            </Typography>
            <Typography sx={{ lineHeight: 1.9, fontSize: 18, mb: 2 }}>
              Sự kiện quy tụ nhiều nghệ sĩ nổi tiếng, âm thanh – ánh sáng tiêu chuẩn, hứa hẹn mang lại
              trải nghiệm “cháy” hết mình. Cửa mở sớm để bạn check-in, săn ảnh và nhận quà mini-game
              khu vực lobby.
            </Typography>

            <List dense sx={{ pl: 1 }}>
              {[
                "Sân khấu lớn, màn hình LED.",
                "An ninh & y tế trực 24/7.",
                "Quầy đồ ăn – nước uống trong khuôn viên.",
              ].map((t, i) => (
                <ListItem key={i} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ChevronRightRounded />
                  </ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontSize: 18 }} primary={t} />
                </ListItem>
              ))}
            </List>
          </Section>

          {/* LINE-UP */}
          <Section id="lineup" title="Line-up & Schedule" icon={<QueueMusicRounded />}>
            <List dense>
              {lineup.map((it, idx) => (
                <ListItem key={idx} sx={{ py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Chip label={it.time} size="small" />
                  </ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontSize: 18 }} primary={it.act} />
                </ListItem>
              ))}
            </List>
            <Typography sx={{ mt: 1.5, color: "text.secondary" }}>
              *Lịch trình có thể thay đổi nhẹ vì lý do kỹ thuật / thời tiết.
            </Typography>
          </Section>

          {/* VENUE & MAP */}
          <Section id="venue" title="Địa điểm & Bản đồ" icon={<PlaceRounded />}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {venueName}
            </Typography>
            <Typography sx={{ mb: 2 }}>{venueAddress}</Typography>
            <Box
              component="iframe"
              title="Venue map"
              src={mapEmbedUrl}
              loading="lazy"
              sx={{ border: 0, width: "100%", height: 320, borderRadius: 2, mb: 1.5 }}
            />
            <MuiLink
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                venueAddress
              )}`}
              target="_blank"
              rel="noopener"
              underline="none"
            >
              <Button startIcon={<DirectionsRounded />} variant="outlined">
                Chỉ đường bằng Google Maps
              </Button>
            </MuiLink>
          </Section>

          {/* RULES */}
          <Section id="rules" title="Nội quy" icon={<RuleRounded />}>
            <List dense>
              {rules.map((r, i) => (
                <ListItem key={i} disableGutters>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <ChevronRightRounded />
                  </ListItemIcon>
                  <ListItemText primary={r} primaryTypographyProps={{ fontSize: 16 }} />
                </ListItem>
              ))}
            </List>
          </Section>

          {/* FAQ */}
          <Section id="faq" title="FAQ" icon={<HelpOutlineRounded />}>
            <List>
              {faqs.map((f, i) => (
                <ListItem key={i} alignItems="flex-start">
                  <ListItemText
                    primary={<Typography variant="h6">{f.q}</Typography>}
                    secondary={<Typography sx={{ mt: 0.5 }}>{f.a}</Typography>}
                  />
                </ListItem>
              ))}
            </List>
          </Section>
        </Grid>

        {/* RIGHT SIDEBAR – event card sticky */}
        
      </Grid>
    </Container>
  );
};

/* ---------- small building blocks ---------- */
const Section = ({ id, title, icon, children }) => (
  <Box id={id} sx={{ mb: 4 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon}
      <Typography variant="h6" sx={{ color: ACCENT, fontWeight: 700 }}>
        {title}
      </Typography>
    </Box>
    <Box sx={{ mt: 1.5 }}>{children}</Box>
  </Box>
);

const Row = ({ icon, text, bold }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1 }}>
    <Box sx={{ display: "grid", placeItems: "center" }}>{icon}</Box>
    <Typography sx={{ fontWeight: bold ? 700 : 500 }}>{text}</Typography>
  </Box>
);

export default InfoProduct;
