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
// import MiniProductCard from "./MiniProductCard";
function fmtRange(startDate, endDate) {
  try {
    const s = startDate ? new Date(startDate) : null;
    const e = endDate ? new Date(endDate) : null;
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
  // const handleNavigate = () => { // Chuyển hướng đến URL động với id
  //   if (key) {
  //     navigate(`/productdetail/${key}`);
  //   } else {
  //     console.warn("Product ID is missing");
  //     navigate('/productdetail'); // Hoặc xử lý lỗi khác
  //   }
  // };
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
          const key = ev?.id ?? idx;
          return (
            <Card
              key={key}
              variant="outlined"
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                "&:hover": { boxShadow: 6, translate: "0 -2px" },
                transition: "all .2s ease",
              }}
            >
              {ev?.image && (
                <CardMedia
                  component="img"
                  image={ev.image}
                  alt={ev.title || ev.name}
                  sx={{ height: 160, objectFit: "cover" }}
                />
              )}

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
                  title={ev.title || ev.name}
                >
                  {ev.title || ev.name}
                </Typography>

                {/* Ngày/giờ sự kiện */}
                {(ev?.startDate || ev?.endDate) && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                    sx={{ mt: 1 }}
                  >
                    <CalendarMonthIcon fontSize="small" />
                    <Typography variant="body2">
                      {fmtRange(ev.startDate, ev.endDate)}
                    </Typography>
                  </Stack>
                )}

                {/* Địa điểm (nếu có) */}
                {ev?.location && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                    sx={{ mt: 0.5 }}
                  >
                    <PlaceIcon fontSize="small" />
                    <Typography variant="body2">{ev.location}</Typography>
                 
                  </Stack>
                )}

                {/* Hành động */}
                <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
                  {ev.link ?(
                    <Button
                      size="small"
                      variant="contained"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => navigate(ev.link)}
                    >
                       Visit Now
                    </Button>
                  ) : (
                    <Button size="small" variant="outlined" disabled>
                      Registration is about to open
                    </Button>
                  )}
                  {/* Nếu cần:
                  <Button size="small" variant="text">Chi tiết</Button>
                  */}
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
