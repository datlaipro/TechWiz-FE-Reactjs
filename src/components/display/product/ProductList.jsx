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
const money = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/* ====== Date helpers (local) ====== */
// Parse "YYYY-MM-DD" + "HH:mm:ss" -> Date (local)
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

// Lấy mốc bắt đầu & kết thúc thực tế từ object event
function getEventStart(ev) {
  // Ưu tiên startDate + time; fallback date + time; cuối cùng chỉ có startDate/date
  return (
    buildLocalDate(ev?.startDate, ev?.time) ||
    buildLocalDate(ev?.date, ev?.time) ||
    buildLocalDate(ev?.startDate) ||
    buildLocalDate(ev?.date) ||
    null
  );
}

function getEventEnd(ev) {
  const start =
    buildLocalDate(ev?.startDate, ev?.time) ||
    buildLocalDate(ev?.date, ev?.time) ||
    buildLocalDate(ev?.startDate) ||
    buildLocalDate(ev?.date) ||
    null;

  // Nếu có endDate/endTime -> dùng chúng (fallback endTime = 23:59:59 nếu chỉ có endDate)
  if (ev?.endDate || ev?.endTime) {
    const endDateStr = ev?.endDate || ev?.startDate || ev?.date;
    const endTimeStr = ev?.endTime || (ev?.endDate ? "23:59:59" : ev?.time);
    return buildLocalDate(endDateStr, endTimeStr) || start;
  }

  // Nếu chỉ có date (không có time) -> coi kết thúc cuối ngày đó
  if ((ev?.date || ev?.startDate) && !ev?.time && !ev?.endTime) {
    const d = ev?.date || ev?.startDate;
    return buildLocalDate(d, "23:59:59") || start;
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

// Format phạm vi thời gian từ Date -> string
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
      : `${s.toLocaleString("vi-VN", dOpt)} → ${e.toLocaleString("vi-VN", dOpt)}`;
  } catch {
    return "";
  }
}

// Format phạm vi thời gian từ object event -> string
function fmtEventRange(ev) {
  const s = getEventStart(ev);
  const e = getEventEnd(ev);
  return fmtRangeByDates(s, e);
}

/* ===== helpers cho filter bar ===== */
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

/* ===== phân biệt event hay product (fallback) ===== */
const isEvent = (item) => !!(item?.startDate || item?.date);

/* ===== Event card ===== */
const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const over = isEventOver(event);
  const detailPath = event?.link;
  const canVisit = !!detailPath && !over;

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
      <Box sx={{ position: "relative", aspectRatio: "16 / 9", bgcolor: "#fafafa" }}>
        <Box
          component="img"
          src={event?.mainImageUrl || ""}
          alt={event.title || event.name}
          onError={(e) => {
            e.currentTarget.src = "/demo/images/placeholder.png";
          }}
          sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      </Box>

      {/* Nội dung */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, flexGrow: 1 }}>
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
          title={event.title || event.name}
        >
          {event.title || event.name}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {event?.department && <Chip size="small" label={event.department} />}
          {event?.category && <Chip size="small" variant="outlined" label={str(event.category)} />}
          {event?.status && <Chip size="small" color="default" variant="outlined" label={str(event.status)} />}
        </Stack>

        {(event?.startDate || event?.date) && (
          <Stack spacing={0.5} sx={{ mt: 0.5 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthRounded fontSize="small" />
              <Typography variant="body2">{fmtEventRange(event)}</Typography>
            </Stack>
            {(event?.location || event?.venue) && (
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceRounded fontSize="small" />
                <Typography variant="body2">{event.location || event.venue}</Typography>
              </Stack>
            )}
          </Stack>
        )}

        <Button
          fullWidth
          sx={{ mt: "auto" }}
          variant="contained"
          disabled={!canVisit}
          onClick={() => canVisit && navigate(detailPath)}
        >
          {over ? "Đã kết thúc" : "Visit Now"}
        </Button>
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

  // State lọc (giữ logic hiện có)
  const [filters, setFilters] = useState(
    initialFilters || {
      searchQuery: "",
      dateFrom: "",
      dateTo: "",
      sort: "",
      category: "",
      language: "",
      priceRange: "",
    }
  );
  useEffect(() => {
    if (initialFilters) setFilters((f) => ({ ...f, ...initialFilters }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilters]);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:6868/api/events")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách sự kiện");
        return res.json();
      })
      .then((data) => {
        // Map đúng fields BE -> UI
        const mapped = data.map((x, idx) => {
          const id = x.eventId ?? x.id ?? idx;
          return {
            // nhận diện
            id,
            eventId: x.eventId ?? x.id ?? null,

            // nội dung
            title: x.title || x.name || "",
            name: x.name || x.title || "",
            description: x.description || "",

            // phân loại / trạng thái
            category:
              typeof x.category === "string"
                ? x.category
                : x?.category?.name || x?.categoryName || "",
            status: x.status || x.approval_status || "",

            // thời gian (giữ cả cặp date/time và startDate/endDate)
            date: x.date || null, // "YYYY-MM-DD"
            time: x.time || x.startTime || null, // "HH:mm:ss"
            startDate: x.startDate || x.date || null, // ngày bắt đầu
            endDate: x.endDate || x.date || null, // ngày kết thúc nếu có
            endTime: x.endTime || null,

            // địa điểm
            venue: x.venue || "",
            location: x.location || x.venue || "",

            // ảnh từ BE
            mainImageUrl: x.mainImageUrl || "",

            // các field khác (nếu dùng UI cũ)
            author: x.author,
            discount: x.discountPercentage ? `${x.discountPercentage}% OFF` : null,
            price: x.price,
            salePrice: x.salePrice || null,
            rating: Number.isFinite(Number(x.rating)) ? Number(x.rating) : 4,

            // link chi tiết
            link: `/productdetail/${id}`,
          };
        });
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
      !q || lower(p.name).includes(q) || lower(p.description).includes(q);

    const matchesCategory = !filters.category || str(p.category) === str(filters.category);
    const matchesLanguage = !filters.language || p.language === filters.language;

    const price = p.salePrice ?? p.price;
    let matchesPrice = true;
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      const minVND = min * 25000;
      const maxVND = max ? max * 25000 : Infinity;
      matchesPrice = money(price) >= minVND && money(price) < maxVND;
    }

    // Lọc theo khoảng ngày (giao với [from, to]) — dùng mốc start/end thực tế
    const from = filters.dateFrom ? buildLocalDate(filters.dateFrom, "00:00:00") : null;
    const to = filters.dateTo ? buildLocalDate(filters.dateTo, "23:59:59") : null;

    let matchesDate = true;
    if (from || to) {
      const s = getEventStart(p);
      const e = getEventEnd(p) || s;
      if (s) {
        const startOk = !to || s <= to;
        const endOk = !from || e >= from;
        matchesDate = startOk && endOk;
      } else {
        matchesDate = false;
      }
    }

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLanguage &&
      matchesPrice &&
      matchesDate
    );
  });

  /* ==== SẮP XẾP ==== */
  const comparatorMap = {
    "name-asc": (a, b) => viCompare(a.name, b.name),
    "name-desc": (a, b) => viCompare(b.name, a.name),

    "date-asc": (a, b) => {
      const ta = getEventStart(a)?.getTime() ?? 0;
      const tb = getEventStart(b)?.getTime() ?? 0;
      return ta - tb;
    },
    "date-desc": (a, b) => {
      const ta = getEventStart(a)?.getTime() ?? 0;
      const tb = getEventStart(b)?.getTime() ?? 0;
      return tb - ta;
    },

    "price-asc": (a, b) => money(a.salePrice ?? a.price) - money(b.salePrice ?? b.price),
    "price-desc": (a, b) => money(b.salePrice ?? b.price) - money(a.salePrice ?? a.price),

    "rating-highest": (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0),
    "rating-lowest": (a, b) => (Number(a.rating) || 0) - (Number(b.rating) || 0),
  };
  const sorter = comparatorMap[filters?.sort] ?? (() => 0);
  const sortedProducts = [...filteredProducts].sort(sorter);

  // Reset page mỗi khi filter đổi
  useEffect(() => {
    setPage(0);
  }, [filters]);

  const totalPages = Math.ceil(sortedProducts.length / size);
  const displayedProducts = sortedProducts.slice(page * size, (page + 1) * size);

  // Handlers cho filter bar
  const handleChange = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));
  const setRange = ({ from, to }) => setFilters((f) => ({ ...f, dateFrom: from, dateTo: to }));

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
            <Button variant="outlined" size="small" onClick={() => setRange(currentWeekRange())}>
              TUẦN NÀY
            </Button>
            <Button variant="outlined" size="small" onClick={() => setRange(currentMonthRange())}>
              THÁNG NÀY
            </Button>
            <Button variant="text" size="small" onClick={() => setRange({ from: "", to: "" })}>
              XOÁ NGÀY
            </Button>
          </Grid>

          <Grid item xs={12} md={1.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Sắp xếp</InputLabel>
              <Select label="Sắp xếp" value={filters.sort || ""} onChange={handleChange("sort")}>
                <MenuItem value="">Mặc định</MenuItem>
                <MenuItem value="name-asc">Tên A → Z</MenuItem>
                <MenuItem value="name-desc">Tên Z → A</MenuItem>
                <MenuItem value="date-asc">Ngày sớm → muộn</MenuItem>
                <MenuItem value="date-desc">Ngày muộn → sớm</MenuItem>
                <MenuItem value="price-asc">Giá tăng dần</MenuItem>
                <MenuItem value="price-desc">Giá giảm dần</MenuItem>
                <MenuItem value="rating-highest">Đánh giá cao nhất</MenuItem>
                <MenuItem value="rating-lowest">Đánh giá thấp nhất</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Lưới kết quả: card sự kiện */}
      <Grid container spacing={3}>
        {displayedProducts.map((p) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p.id} sx={{ display: "flex" }}>
            {isEvent(p) ? <EventCard event={p} /> : <ProductCard product={p} />}
          </Grid>
        ))}
      </Grid>

      <PaginationComponent page={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
    </>
  );
};

export default ProductList;
