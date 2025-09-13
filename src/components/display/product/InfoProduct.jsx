import React from "react";
import {
  Container, Box, Grid, Typography, Button, Chip, List, ListItem, ListItemIcon,
  ListItemText, Link as MuiLink
} from "@mui/material";
import PlaceRounded from "@mui/icons-material/PlaceRounded";
import QueueMusicRounded from "@mui/icons-material/QueueMusicRounded";
import RuleRounded from "@mui/icons-material/RuleRounded";
import HelpOutlineRounded from "@mui/icons-material/HelpOutlineRounded";
import DirectionsRounded from "@mui/icons-material/DirectionsRounded";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";

const ACCENT = "#F86D72";

const InfoProduct = ({ event }) => {
  // ==== Lấy dữ liệu từ ProductDetail (có fallback nhẹ) ====
  const title         = event?.title ?? "Sự kiện";
  const description   = event?.description?.trim() || "Thông tin chi tiết sẽ được cập nhật.";
  const venueName     = event?.venueName || "Địa điểm sẽ cập nhật";
  const venueAddress  = event?.venueAddress || "";
  const category      = event?.category || null;
  const status        = event?.status || null;

  // Nếu có lineup/rules/faqs từ BE thì dùng, không thì fallback demo
  const lineup = Array.isArray(event?.lineup) && event.lineup.length
    ? event.lineup
    : [
        { time: "18:30", act: "Mở cổng · Check-in" },
        { time: "19:30", act: "Tiết mục mở màn" },
        { time: "20:15", act: "Chương trình chính" },
        { time: "21:00", act: "Gala/Headliner" },
      ];

  const rules = Array.isArray(event?.rules) && event.rules.length
    ? event.rules
    : [
        "Tuân thủ hướng dẫn của BTC và an ninh.",
        "Không mang vật nguy hiểm, hạn chế balo lớn.",
        "Giữ gìn vệ sinh, không xả rác.",
      ];

  const faqs = Array.isArray(event?.faqs) && event.faqs.length
    ? event.faqs
    : [
        { q: "Vé có hoàn/đổi được không?", a: "Không hoàn/đổi trừ khi sự kiện hủy/hoãn." },
        { q: "Có bãi đỗ xe không?", a: "Có bãi đỗ trong/ngoài khuôn viên (có thể thu phí)." },
      ];

  const mapEmbedUrl = venueAddress
    ? `https://www.google.com/maps?q=${encodeURIComponent(venueAddress)}&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(venueName)}&output=embed`;

  const go = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <Container sx={{ mt: 4 }}>
      {/* NAV mục lục */}
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
              {title}
            </Typography>

            {/* Nếu có category/status thì hiển thị nhẹ dưới tiêu đề */}
            {(category || status) && (
              <Box sx={{ mb: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {category && (
                  <Chip
                    label={`Phân loại: ${category}`}
                    size="small"
                    sx={{ bgcolor: `${ACCENT}22` }}
                  />
                )}
                {status && (
                  <Chip
                    label={`Trạng thái: ${status}`}
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,.08)" }}
                  />
                )}
              </Box>
            )}

            <Typography sx={{ lineHeight: 1.9, fontSize: 18, mb: 2 }}>
              {description}
            </Typography>

            {/* Gạch đầu dòng mô tả thêm (không lặp lại date/time/totalSeats đã ở poster) */}
            <List dense sx={{ pl: 1 }}>
              {[
                category ? `Chủ đề/nhóm sự kiện: ${category}` : null,
                "Hỗ trợ an ninh & y tế trong suốt sự kiện.",
                "Khu vực refreshment/đồ uống trong khuôn viên.",
              ]
                .filter(Boolean)
                .map((t, i) => (
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
              *Lịch trình có thể thay đổi vì lý do kỹ thuật/thời tiết.
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
            {(venueName || venueAddress) && (
              <MuiLink
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  venueAddress || venueName
                )}`}
                target="_blank"
                rel="noopener"
                underline="none"
              >
                <Button startIcon={<DirectionsRounded />} variant="outlined">
                  Chỉ đường bằng Google Maps
                </Button>
              </MuiLink>
            )}
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

        {/* RIGHT SIDEBAR – giữ nguyên layout (để trống hoặc bạn thêm card sticky sau) */}
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
