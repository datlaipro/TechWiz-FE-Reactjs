import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Alert,
  Skeleton,
  Stack,
  Chip,
  TextField,
  Divider,
  LinearProgress,
  FormControlLabel,
  Switch,
  IconButton,
  Button,
  MenuItem,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import PlaceRounded from "@mui/icons-material/PlaceRounded";
import FilterAlt from "@mui/icons-material/FilterAlt";
import { useEventContext } from "../../EventContext";
import { Tooltip } from "@mui/material";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

const EVENTS_URL = "http://localhost:6868/api/events";
const STORAGE_KEY = "authState_v1";

function readAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null };
    const obj = JSON.parse(raw);
    const token = obj.accessToken || obj.token || obj.jwt || null;
    return { token };
  } catch {
    return { token: null };
  }
}

const paperCardSx = {
  p: 2,
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  bgcolor: "white",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 8px 28px rgba(0,0,0,0.12)",
    transform: "translateY(-2px)",
  },
};


const todayStr = () => new Date().toISOString().slice(0, 10);
const parseISO = (s) => (s ? new Date(s) : null);

function isOngoingAt(ev, refDayStr, now = new Date()) {
  // hàm lấy ra thời gian hiện tại
  if (!ev?.startDate) return false;

  const refDay = parseISO(refDayStr);
 
  const dayNow = parseISO(ev.date);
  if (!dayNow) return false;

  // return s <= refTs && refTs <= e;
  return (
    // trả về true khi ngày diễn ra sự kiện trùng với ngày hiện tại
    dayNow.getFullYear() === refDay.getFullYear() &&
    dayNow.getMonth() === refDay.getMonth() &&
    dayNow.getDate() === refDay.getDate()
  );
}

function fmtTimeRange(s, e) {
  const S = parseISO(s);
  const E = parseISO(e) || S;
  if (!S) return "—";
  const pad = (n) => String(n).padStart(2, "0");
  const from = `${pad(S.getHours())}:${pad(S.getMinutes())}`;
  const to = `${pad(E.getHours())}:${pad(E.getMinutes())}`;
  return `${from} - ${to}`;
}

export default function OngoingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  // ===== Bộ lọc theo ảnh (KHÔNG có khoảng ngày) =====
  const [dept, setDept] = useState("Tất cả");
  const [type, setType] = useState("Tất cả");
  const [qTitle, setQTitle] = useState("");
  const [cat, setCat] = useState("Tất cả"); // thêm bộ lọc theo thể loại

  // ===== Bộ lọc đặc thù: theo "ngày tham chiếu" & "đang diễn ra" =====
  const [refDay, setRefDay] = useState(todayStr());
  const [onlyOngoing, setOnlyOngoing] = useState(true);

  // Tự tick 30s để re-evaluate "đang diễn ra"
  const [tick, setTick] = useState(Date.now());
  useEffect(() => {
    if (!onlyOngoing) return;
    const id = setInterval(() => setTick(Date.now()), 30000);
    return () => clearInterval(id);
  }, [onlyOngoing]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setErr("");
      const { token } = readAuth();
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(EVENTS_URL, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (e) {
      setErr("Không thể tải danh sách sự kiện");
      setLoading(false);
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);



  const typeOptions = useMemo(() => {
    const s = new Set(["Tất cả"]);
    (events || []).forEach((e) => s.add(e.type || "Khác"));
    return Array.from(s);
  }, [events]);
  const categoryOptions = useMemo(
    () => ["Tất cả", "Workshop", "Sports", "Cultural", "Technical"],
    []
  );

  // Áp tất cả điều kiện lọc
  const filtered = useMemo(() => {
    let base;
    if (onlyOngoing) {
      const now = new Date();
      void tick;
      base = events.filter((ev) => isOngoingAt(ev, refDay, now)); // lọc ra những ngày thỏa điều kiện starday <= ngày hiện tại <=nday
    } else {
      // Nếu tắt "đang diễn ra": hiển thị các sự kiện có giao với ngày refDay
      const startDay = new Date(`${refDay}T00:00:00`);
      const endDay = new Date(`${refDay}T23:59:59`);
      base = events.filter((ev) => {
        const s = parseISO(ev.startDate);
        const e = parseISO(ev.endDate) || s;
        if (!s) return false;
        return s <= endDay && e >= startDay;
      });
    }

    const q = qTitle.trim().toLowerCase();
    return base.filter((ev) => {
      const evDept = ev.department || ev.category || "Khác";
      const evCat = ev.category || "";
      const evType = ev.type || "Khác";
      const okDept =
        dept === "Tất cả" ||
        evDept === dept ||
        (dept === "Khác" && !ev.department);
      const okType = type === "Tất cả" || evType === type;
      const okCat =
        cat === "Tất cả" || evCat.toLowerCase() === cat.toLowerCase();
      const okTitle =
        !q ||
        String(ev.title || "")
          .toLowerCase()
          .includes(q);

      return okDept && okType && okCat && okTitle;
    });
  }, [events, onlyOngoing, refDay, tick, dept, type, qTitle, cat]);

  const handleReset = () => {
    setDept("Tất cả");
    setType("Tất cả");
    setQTitle("");
    setRefDay(todayStr());
    setCat("Tất cả"); // reset thể loại

    setOnlyOngoing(true);
  };

  if (loading) {
    return (
      <Box sx={{ mt: 2, px: { xs: 1, sm: 2 }, bgcolor: "grey.50" }}>
        <Grid container spacing={2}>
          {[...Array(3)].map((_, i) => (
            <Grid item xs={12} key={`sk-${i}`}>
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: "12px" }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (err) {
    return (
      <Box sx={{ mt: 2, px: { xs: 1, sm: 2 }, bgcolor: "grey.50" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {err}
        </Alert>
        <Button onClick={fetchEvents} startIcon={<RefreshIcon />}>
          Thử lại
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 1, px: { xs: 1, sm: 2 }, bgcolor: "grey.50" }}>
      <Paper sx={{ ...paperCardSx }}>
        {/* ======= HÀNG TRÊN: Thanh filter giống ảnh (không có khoảng ngày) + filter riêng ======= */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "stretch", md: "center" }}
          spacing={2}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 1 }}>
            <Tooltip title="Back to Home">
              <IconButton size="small" onClick={() => navigate("/admin")}>
                <ArrowBackIosNew fontSize="small" />
              </IconButton>
            </Tooltip>
            <FilterAlt />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Bộ lọc sự kiện
            </Typography>
          </Stack>

          {/* Select phòng ban & loại sự kiện */}
          <TextField
            select
            size="small"
            label="Thể loại"
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            {categoryOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            label="Loại sự kiện"
            value={type}
            onChange={(e) => setType(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            {typeOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ flex: 1 }} />

          {/* Bộ lọc riêng: theo ngày tham chiếu & đang diễn ra */}
          <TextField
            size="small"
            type="date"
            label="Ngày tham chiếu"
            InputLabelProps={{ shrink: true }}
            value={refDay}
            onChange={(e) => setRefDay(e.target.value || todayStr())}
            sx={{ minWidth: 170 }}
          />
          <FormControlLabel
            sx={{ ml: 1 }}
            control={
              <Switch
                checked={onlyOngoing}
                onChange={(e) => setOnlyOngoing(e.target.checked)}
              />
            }
            label="Chỉ sự kiện đang diễn ra"
          />
          <IconButton onClick={fetchEvents} title="Tải lại">
            <RefreshIcon />
          </IconButton>
          <Button variant="outlined" onClick={handleReset}>
            XÓA LỌC
          </Button>
        </Stack>

        {/* ======= HÀNG DƯỚI: Tìm kiếm theo tiêu đề ======= */}
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Tìm kiếm theo tiêu đề"
            placeholder="Nhập từ khoá tiêu đề sự kiện…"
            value={qTitle}
            onChange={(e) => setQTitle(e.target.value)}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ======= Danh sách kết quả ======= */}
        {filtered.length === 0 ? (
          <Alert severity="info">
            Không có sự kiện phù hợp tại thời điểm hiện tại của ngày đã chọn.
          </Alert>
        ) : (
          <Stack spacing={1.5}>
            {filtered
              .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
              .map((ev) => {
                const timeLabel = fmtTimeRange(ev.startDate, ev.endDate);
                const deptLabel = ev.category || "Khác";
                const typeLabel = ev.type || "Sự kiện";
                const status = (ev.status || "").toUpperCase();
                const capacity =
                  Number(ev.capacity) || Number(ev.totalSeats) || 0;
                const registered = Math.min(
                  Number(ev.registered) || Number(ev.seatsUsed) || 0,
                  capacity || Number.MAX_SAFE_INTEGER
                );
                const progress =
                  capacity > 0 ? Math.round((registered / capacity) * 100) : 0;
                const key =
                  ev.eventId ?? ev.id ?? ev.uuid ?? `${ev.title}-${ev.date}`;

                return (
                  <Box
                    key={key}
                    sx={{
                      p: 1.5,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1.5,
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {ev.title || "—"}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ mt: 1 }}
                      flexWrap="wrap"
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AccessTimeRounded fontSize="small" />
                        <Typography variant="body2">{timeLabel}</Typography>
                      </Stack>
                      {ev.venue && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PlaceRounded fontSize="small" />
                          <Typography variant="body2">{ev.venue}</Typography>
                        </Stack>
                      )}
                      {ev.date && (
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarMonthRounded fontSize="small" />
                          <Typography variant="body2">
                            {String(ev.date).slice(0, 10)}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      {ev.category && (
                        <Chip
                          size="small"
                          label={ev.category}
                          color="secondary"
                          variant="outlined"
                        />
                      )}

                      {!!status && (
                        <Chip
                          size="small"
                          label={status}
                          color={status === "PUBLISHED" ? "success" : "warning"}
                          variant="outlined"
                        />
                      )}
                    </Stack>

                    {capacity > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Đăng ký: {registered}/{capacity}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {progress}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{ height: 8, borderRadius: 1 }}
                        />
                      </Box>
                    )}
                  </Box>
                );
              })}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
