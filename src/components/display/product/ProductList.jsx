import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
} from "@mui/material";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import PlaceRounded from "@mui/icons-material/PlaceRounded";

import ProductCard from "./ProductCard";
import PaginationComponent from "../free/PaginationComponent";
import { useNavigate } from "react-router-dom";

/* ===== sort & string helpers (an toàn cho null/undefined) ===== */
const str = (v) => (v ?? "").toString();
const lower = (v) => str(v).toLowerCase();
const viCompare = (a, b) =>
  str(a).localeCompare(str(b), "vi", { sensitivity: "base" });
const ts = (d) => {
  const t = d ? new Date(d).getTime() : NaN;
  return Number.isFinite(t) ? t : 0;
};

/* ===== helpers ===== */
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
const isEvent = (item) => !!item?.startDate;

function yyyymmdd(d) {
  const pad = (n) => (n < 10 ? "0" + n : "" + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function currentWeekRange() {
  const now = new Date();
  const day = now.getDay(); // 0 = CN
  const diffToMon = (day + 6) % 7; // về thứ 2
  const start = new Date(now);
  start.setDate(now.getDate() - diffToMon);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { from: yyyymmdd(start), to: yyyymmdd(end) };
}
function currentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: yyyymmdd(start), to: yyyymmdd(end) };
}
function badgeParts(dt) {
  if (!dt) return { d: "", m: "" };
  const d = new Date(dt);
  return {
    d: d.getDate().toString().padStart(2, "0"),
    m: d.toLocaleString("vi-VN", { month: "short" }).replace(".", ""),
  };
}

/* ===== Event card (layout cho sự kiện) ===== */
const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={1}
      sx={{
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "1px solid #eee",
      }}
    >
      {/* Ảnh 16:9 */}
      <Box
        sx={{ position: "relative", aspectRatio: "16 / 9", bgcolor: "#fafafa" }}
      >
        <Box
          component="img"
          src={event?.image || "/demo/images/placeholder.png"}
          alt={event.title}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          loading="lazy"
        />
      </Box>

      {/* Nội dung */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          flexGrow: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 44,
          }}
          title={event.title}
        >
          {event.title}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {event?.category && (
            <Chip size="small" variant="outlined" label={event.category} />
          )}
        </Stack>

        {(event?.startDate || event?.endDate) && (
          <Stack spacing={0.5} sx={{ mt: 0.5 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthRounded fontSize="small" />
              <Typography variant="body2">
                {fmtRange(event.startDate, event.endDate)}
              </Typography>
            </Stack>
            {event?.venue && (
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceRounded fontSize="small" />
                <Typography variant="body2">{event.venue}</Typography>
              </Stack>
            )}
          </Stack>
        )}

        {event?.link && (
          <Button
            fullWidth
            sx={{ mt: "auto" }}
            variant="contained"
            onClick={() => navigate(event.link)}
          >
            Visit Now
          </Button>
        )}
      </Box>
    </Paper>
  );
};

/* ===== main component ===== */
const ProductList = ({ filters: initialFilters }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State lọc
  const [filters, setFilters] = useState(
    initialFilters || {
      searchQuery: "",
      dateFrom: "",
      dateTo: "",
      sort: "",
      category: "",
    }
  );
  useEffect(() => {
    if (initialFilters) setFilters((f) => ({ ...f, ...initialFilters }));
  }, [initialFilters]);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:6868/api/events")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách sự kiện");
        return res.json();
      })
      .then((data) => {
        const mapped = data.map((x) => ({
          id: x.eventId,
          title: x.title || "",
          description: x.description || "",
          image: x.mainImageUrl || "/demo/images/placeholder.png",
          category: x.category || "",
          startDate: x.startDate || x.date || null,
          endDate: x.endDate || null,
          venue: x.venue || "",
          totalSeats: x.totalSeats || 0,
          link: `/productdetail/${x.eventId}`,
        }));
        setProducts(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Lỗi khi tải sự kiện");
        setLoading(false);
      });
  }, []);

  /* ==== LỌC ==== */
  const filteredProducts = products.filter((p) => {
    const q = lower(filters.searchQuery);
    const matchesSearch =
      !q || lower(p.title).includes(q) || lower(p.description).includes(q);

    const matchesCategory = !filters.category || p.category === filters.category;

    // Lọc theo khoảng ngày
    const from = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const to = filters.dateTo ? new Date(filters.dateTo) : null;
    let matchesDate = true;
    if (from || to) {
      const s = p.startDate ? new Date(p.startDate) : null;
      const e = p.endDate ? new Date(p.endDate) : s;
      if (s) {
        const startOk = !to || s <= to;
        const endOk = !from || (e || s) >= from;
        matchesDate = startOk && endOk;
      } else {
        matchesDate = false;
      }
    }

    return matchesSearch && matchesCategory && matchesDate;
  });

  /* ==== SẮP XẾP ==== */
  const comparatorMap = {
    "name-asc": (a, b) => viCompare(a.title, b.title),
    "name-desc": (a, b) => viCompare(b.title, a.title),
    "date-asc": (a, b) => ts(a.startDate) - ts(b.startDate),
    "date-desc": (a, b) => ts(b.startDate) - ts(a.startDate),
  };
  const sorter = comparatorMap[filters?.sort] ?? (() => 0);
  const sortedProducts = [...filteredProducts].sort(sorter);

  useEffect(() => {
    setPage(0);
  }, [filters]);

  const totalPages = Math.ceil(sortedProducts.length / size);
  const displayedProducts = sortedProducts.slice(page * size, (page + 1) * size);

  // Handlers cho filter bar
  const handleChange = (key) => (e) =>
    setFilters((f) => ({ ...f, [key]: e.target.value }));
  const setRange = ({ from, to }) =>
    setFilters((f) => ({ ...f, dateFrom: from, dateTo: to }));

  /* ===== render ===== */
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  if (sortedProducts.length === 0) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography>Không tìm thấy sự kiện</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Filter bar */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: "1px solid #eee",
          bgcolor: "#fff",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm kiếm sự kiện…"
              value={filters.searchQuery || ""}
              onChange={handleChange("searchQuery")}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Từ ngày"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filters.dateFrom || ""}
              onChange={handleChange("dateFrom")}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Đến ngày"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filters.dateTo || ""}
              onChange={handleChange("dateTo")}
            />
          </Grid>

          <Grid item xs={12} md={2.5} sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setRange(currentWeekRange())}
            >
              TUẦN NÀY
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setRange(currentMonthRange())}
            >
              THÁNG NÀY
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => setRange({ from: "", to: "" })}
            >
              XOÁ NGÀY
            </Button>
          </Grid>

          <Grid item xs={12} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Sắp xếp</InputLabel>
              <Select
                label="Sắp xếp"
                value={filters.sort || ""}
                onChange={handleChange("sort")}
              >
                <MenuItem value="">Mặc định</MenuItem>
                <MenuItem value="name-asc">Tên A → Z</MenuItem>
                <MenuItem value="name-desc">Tên Z → A</MenuItem>
                <MenuItem value="date-asc">Ngày sớm → muộn</MenuItem>
                <MenuItem value="date-desc">Ngày muộn → sớm</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Lưới kết quả: card sự kiện */}
      <Grid container spacing={3}>
        {displayedProducts.map((p) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={p.id}
            sx={{ display: "flex" }}
          >
            <EventCard event={p} />
          </Grid>
        ))}
      </Grid>

      <PaginationComponent
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </>
  );
};

export default ProductList;