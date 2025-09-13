// Nhóm các Event card thành 1 cột (giữ nguyên props: { title, products })
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlaceIcon from "@mui/icons-material/Place";
import { useNavigate } from "react-router-dom";

// Parse "YYYY-MM-DD" + "HH:mm:ss" thành Date (local)
function buildLocalDate(dateStr, timeStr) {
  if (!dateStr) return null;
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    let hh = 0,
      mm = 0,
      ss = 0;
    if (timeStr) {
      const parts = timeStr.split(":").map(Number);
      hh = parts[0] ?? 0;
      mm = parts[1] ?? 0;
      ss = parts[2] ?? 0;
    }
    return new Date(y, (m || 1) - 1, d || 1, hh, mm, ss);
  } catch {
    return null;
  }
}
// --- Helpers (dùng cùng file ProductGroup) ---
// Parse "YYYY-MM-DD" + "HH:mm:ss" thành Date (local)

// Lấy mốc "kết thúc" thực tế của event
function getEventEnd(ev) {
  const start = buildLocalDate(ev?.startDate || ev?.date, ev?.time) || null;

  // Nếu có endDate/endTime -> dùng chúng (fallback endTime = 23:59:59 nếu chỉ có endDate)
  if (ev?.endDate || ev?.endTime) {
    const endDateStr = ev?.endDate || ev?.startDate || ev?.date;
    const endTimeStr = ev?.endTime || (ev?.endDate ? "23:59:59" : ev?.time);
    return buildLocalDate(endDateStr, endTimeStr) || start;
  }

  // Nếu chỉ có date (không có time) -> coi kết thúc cuối ngày đó
  if (ev?.date && !ev?.time) {
    return buildLocalDate(ev.date, "23:59:59") || start;
  }

  // Nếu có start + time nhưng không có end -> coi như kết thúc tại thời điểm bắt đầu
  return start;
}

// Đã kết thúc chưa?
function isEventOver(ev, now = new Date()) {
  const end = getEventEnd(ev);
  if (!end) return false;
  return now.getTime() > end.getTime();
}

function fmtRangeByDates(s, e) {
  try {
    if (!s) return "";
    const dOpt = { dateStyle: "medium", timeStyle: "short" };
    if (!e) return `Bắt đầu: ${s.toLocaleString("vi-VN", dOpt)}`;

    const sameDay =
      s.getFullYear() === e.getFullYear() &&
      s.getMonth() === e.getMonth() &&
      s.getDate() === e.getDate();

    return sameDay
      ? `${s.toLocaleString("vi-VN", dOpt)} – ${e.toLocaleTimeString("vi-VN", {
          timeStyle: "short",
        })}`
      : `${s.toLocaleString("vi-VN", dOpt)} → ${e.toLocaleString(
          "vi-VN",
          dOpt
        )}`;
  } catch {
    return "";
  }
}

const ProductGroup = ({ title, products = [] }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360, // mỗi group là 1 cột gọn đẹp
        border: "1px solid #eee",
        borderRadius: 3,
        p: 2,
        mb: 4,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, ml: 1 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2}>
        {products.map((ev, idx) => {
          const id = ev?.id ?? ev?.eventId ?? idx;
          const titleText = ev?.title || ev?.name || "Untitled";
          const imgSrc =
            ev?.mainImageUrl ||
            ev?.image ||
            ev?.img ||
            ev?.images?.[0]?.imagePath ||
            ""; // có thể thêm placeholder nếu muốn

          // Ưu tiên startDate/time; nếu không có thì dùng date/time
          const start =
            buildLocalDate(ev?.startDate, ev?.time) ||
            buildLocalDate(ev?.date, ev?.time) ||
            null;

          // Nếu BE có endTime thì dùng; nếu không có thì chỉ hiển thị bắt đầu
          const end =
            buildLocalDate(ev?.endDate, ev?.endTime) ||
            (ev?.endDate ? buildLocalDate(ev?.endDate) : null);

          const whenText = fmtRangeByDates(start, end);
          const whereText = ev?.location || ev?.venue || ev?.address || "";
          const over = isEventOver(ev);
          const detailPath =
            ev?.link || `/productdetail/${ev?.id ?? ev?.eventId ?? ""}`;
          const canVisit = !!detailPath && !over;

          return (
            <Card
              key={id}
              variant="outlined"
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                "&:hover": { boxShadow: 6, translate: "0 -2px" },
                transition: "all .2s ease",
              }}
            >
              {imgSrc ? (
                <CardMedia
                  component="img"
                  image={imgSrc}
                  alt={titleText}
                  sx={{ height: 160, objectFit: "cover" }}
                  onError={(e) => {
                    // fallback nếu ảnh lỗi
                    e.currentTarget.src = "/demo/images/placeholder.png";
                  }}
                />
              ) : null}

              <CardContent sx={{ p: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                  title={titleText}
                >
                  {titleText}
                </Typography>

                {whenText && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                    sx={{ mt: 1 }}
                  >
                    <CalendarMonthIcon fontSize="small" />
                    <Typography variant="body2">{whenText}</Typography>
                  </Stack>
                )}

                {whereText && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                    sx={{ mt: 0.5 }}
                  >
                    <PlaceIcon fontSize="small" />
                    <Typography variant="body2">{whereText}</Typography>
                  </Stack>
                )}

                <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={!canVisit}
                    onClick={() => canVisit && navigate(detailPath)}
                  >
                    {over ? "Đã kết thúc" : "Visit Now"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

export default ProductGroup;
