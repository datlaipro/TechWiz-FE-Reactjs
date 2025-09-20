import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Alert,
  Skeleton,
  Stack,
  Button,
  Chip,
  TextField,
  MenuItem,
  Divider,
  LinearProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  FilterAlt,
  CalendarMonthRounded,
  PlaceRounded,
  AccessTimeRounded,
  Article,
  PendingActions,
  WarningAmberRounded,
} from "@mui/icons-material";
import { useEventContext } from "../../EventContext";
import readAuth from "../auth/getToken";
/* ========================= Component ========================= */

function Dashboard() {
  const { token, role, userId } = readAuth();
  const authHeaders = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  /* ---------- EVENTS ONLY (đã bỏ News/Pending Queue) ---------- */
  const [events, setEvents] = useState([]);
  const [pendingEvent, setPendingEvent] = useState([]);
  const [evLoading, setEvLoading] = useState(true);
  const [evError, setEvError] = useState("");
  const [qTitle, setQTitle] = useState("");
  const PENDING_URL = "http://localhost:6868/api/admin/events/pending-approve";

  // Bộ lọc giai đoạn 1
  const [filters, setFilters] = useState({
    dept: "Tất cả",
    type: "Tất cả",
    startDate: "",
    endDate: "",
  });

  // === Auth helpers ===
  const STORAGE_KEY = "authState_v1";


  useEffect(() => {
    const fetchAll = async () => {
      try {
        const EVENTS_URL = "http://localhost:6868/api/events";
        const res = await fetch(EVENTS_URL, {
          method: "GET",
          headers: authHeaders,
        });

        let evData = [];
        if (res.ok) {
          evData = await res.json();
        }

        if (!Array.isArray(evData)) evData = [];
        setEvents(evData);
        setEvLoading(false);
      } catch (e) {
        console.error("Events Error:", e);
        setEvError("Không thể tải dữ liệu sự kiện");
        setEvLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Helpers
  const parseISO = (s) => (s ? new Date(s) : null);
  const sameDayKey = (d) =>
    d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`
      : "";
  const isInRange = (start, end, fromStr, toStr) => {
    if (!fromStr && !toStr) return true;
    const from = fromStr ? new Date(fromStr + "T00:00:00") : null;
    const to = toStr ? new Date(toStr + "T23:59:59") : null;
    const s = parseISO(start);
    const e = parseISO(end) || s;
    if (from && e < from) return false;
    if (to && s > to) return false;
    return true;
  };

  // Options cho Select filter
  const deptOptions = useMemo(
    () => [
      "Tất cả",
      ...Array.from(new Set(events.map((e) => e.department || "Khác"))),
    ],
    [events]
  );
  const typeOptions = useMemo(
    () => ["Tất cả", "Workshop", "Sports", "Cultural", "Technical"],
    []
  );

  // Áp bộ lọc
  const filteredEvents = useMemo(() => {
    const normalize = (s) =>
      String(s || "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();

    const q = normalize(qTitle.trim());

    return events.filter((e) => {
      const evDept = e.department || "Khác";
      const evCategory = e.category || e.type || "Khác";

      const okDept = filters.dept === "Tất cả" || evDept === filters.dept;
      const okType = filters.type === "Tất cả" || evCategory === filters.type;
      const okDate = isInRange(
        e.startDate,
        e.endDate,
        filters.startDate,
        filters.endDate
      );
      const okTitle = !q || normalize(e.title).includes(q);

      return okDept && okType && okDate && okTitle;
    });
  }, [
    events,
    filters.dept,
    filters.type,
    filters.startDate,
    filters.endDate,
    qTitle,
  ]);

  // Group theo ngày cho "Calendar List"
  const eventsByDay = useMemo(() => {
    const map = new Map();
    filteredEvents.forEach((ev) => {
      const key = sameDayKey(parseISO(ev.startDate));
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    });
    const entries = Array.from(map.entries()).sort(
      ([a], [b]) => new Date(a) - new Date(b)
    );
    entries.forEach(([, list]) =>
      list.sort((x, y) => parseISO(x.startDate) - parseISO(y.startDate))
    );
    return entries;
  }, [filteredEvents]);

  // Metrics Giai đoạn 1
  const { setEventsThisMonth } = useEventContext();
  const [monthStartKey, monthEndKey] = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return [sameDayKey(start), sameDayKey(end)];
  }, []);

  const eventsThisMonth = useMemo(
    () =>
      (events ?? []).filter((e) =>
        isInRange(e.startDate, e.endDate, monthStartKey, monthEndKey)
      ).length,
    [events, monthStartKey, monthEndKey]
  );

  useEffect(() => {
    const list = (events ?? []).filter((e) =>
      isInRange(e.startDate, e.endDate, monthStartKey, monthEndKey)
    );
    setEventsThisMonth(list);
  }, [events, monthStartKey, monthEndKey, setEventsThisMonth]);

  // 🟩 ĐẾM SỰ KIỆN ĐANG DIỄN RA TRONG NGÀY (giữ nguyên như bạn đang dùng)
  const ongoingNowCount = events.filter((e) => {
    const eventNow = parseISO(e.date);
    const dayNow = new Date();
    if (!eventNow) return false;
    return (
      dayNow.getFullYear() === eventNow.getFullYear() &&
      dayNow.getMonth() === eventNow.getMonth() &&
      dayNow.getDate() === eventNow.getDate()
    );
  }).length;

  // Đếm conflict đơn giản: cùng địa điểm & trùng thời gian
  const conflictCount = useMemo(() => {
    let c = 0;
    const arr = [...events];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const a = arr[i],
          b = arr[j];
        if (!a.venue || !b.venue || a.venue !== b.venue) continue;
        const aS = parseISO(a.startDate),
          aE = parseISO(a.endDate) || aS;
        const bS = parseISO(b.startDate),
          bE = parseISO(b.endDate) || bS;
        if (aS && aE && bS && bE && aS <= bE && bS <= aE) c++;
      }
    }
    return c;
  }, [events]);

  useEffect(() => {
    const fetchPendingEvents = async () => {
      const res = await fetch(PENDING_URL, {
        method: "GET",
        headers: authHeaders,
      });
      let pendingData = [];
      if (res.ok) {
        pendingData = await res.json();
      }
      if (!Array.isArray(pendingData)) pendingData = [];
      setPendingEvent(pendingData);
    };

    fetchPendingEvents();
  }, []);

  const pendingEvents = pendingEvent.filter(
    (e) =>
      (e.status || "").toUpperCase() === "IN_REVIEW" ||
      (e.status || "").toUpperCase() === "PENDING_APPROVAL"
  ).length;
  /* ---------- Loading & Error ---------- */
  if (evLoading) {
    return (
      <Box sx={{ mt: 2, px: { xs: 1, sm: 2 }, bgcolor: "grey.50" }}>
        <Grid container spacing={2}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={`sk-kpi-${i}`}>
              <Skeleton
                variant="rectangular"
                height={160}
                sx={{ borderRadius: "16px" }}
              />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Skeleton
              variant="rectangular"
              height={420}
              sx={{ borderRadius: "12px" }}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (evError) {
    return (
      <Box sx={{ mt: 2, px: { xs: 1, sm: 2 }, bgcolor: "grey.50" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {evError}
        </Alert>
      </Box>
    );
  }

  /* ========================= Render ========================= */
  return (
    <Box
      sx={{
        mt: 1,
        px: { xs: 1, sm: 2 },
        bgcolor: "grey.50",
        cursor: "pointer",
      }}
    >
      {/* TOP: KPI (đã bỏ KPI Pending Approval) */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <KpiCard
          link={"/admin/EventsThisMonth"}
          large
          title="Events of the month"
          value={eventsThisMonth}
          icon={<CalendarMonthRounded sx={{ fontSize: 64 }} />}
          gradient="linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
        />
        <KpiCard
          link={"/admin/event-posted"}
          large
          title="Event posted"
          value={ongoingNowCount}
          icon={<Article sx={{ fontSize: 64 }} />}
          gradient="linear-gradient(135deg, #00897b 0%, #26a69a 100%)"
        />
        <KpiCard
          link={"/admin/ApprovalQueue"}
          large
          title="Pending approval (Event)" // chờ duyệt sự kiện
          value={`${pendingEvents}`}
          icon={<PendingActions sx={{ fontSize: 64 }} />}
          gradient="linear-gradient(135deg, #5e35b1 0%, #9575cd 100%)"
        />

        <KpiCard
          large
          title="Number of subscribers"
          value={conflictCount}
          icon={<WarningAmberRounded sx={{ fontSize: 64 }} />}
          gradient="linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)"
        />
      </Grid>

      {/* Bộ lọc Giai đoạn 1 */}
      <Paper sx={{ ...paperCardSx, mb: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterAlt />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Bộ lọc sự kiện
            </Typography>
          </Stack>
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
          <Box sx={{ flex: 1 }} />
          <TextField
            select
            size="small"
            label="Phòng ban"
            value={filters.dept}
            onChange={(e) =>
              setFilters((f) => ({ ...f, dept: e.target.value }))
            }
            sx={{ minWidth: 180 }}
          >
            {deptOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Loại sự kiện"
            value={filters.type}
            onChange={(e) =>
              setFilters((f) => ({ ...f, type: e.target.value }))
            }
            sx={{ minWidth: 180 }}
          >
            {typeOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            type="date"
            label="Từ ngày"
            InputLabelProps={{ shrink: true }}
            value={filters.startDate}
            onChange={(e) =>
              setFilters((f) => ({ ...f, startDate: e.target.value }))
            }
          />
          <TextField
            size="small"
            type="date"
            label="Đến ngày"
            InputLabelProps={{ shrink: true }}
            value={filters.endDate}
            onChange={(e) =>
              setFilters((f) => ({ ...f, endDate: e.target.value }))
            }
          />
          <Button
            variant="outlined"
            onClick={() =>
              setFilters({
                dept: "Tất cả",
                type: "Tất cả",
                startDate: "",
                endDate: "",
              })
            }
          >
            Xóa lọc
          </Button>
        </Stack>
      </Paper>

      {/* Calendar List */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={paperCardSx}>
            <Typography variant="h6" sx={cardTitleSx}>
              Lịch sự kiện
            </Typography>
            {eventsByDay.length === 0 ? (
              <Alert severity="info">Không có sự kiện phù hợp bộ lọc</Alert>
            ) : (
              <Stack
                spacing={2}
                sx={{ maxHeight: 420, overflow: "auto", pr: 1 }}
              >
                {eventsByDay.map(([day, list]) => (
                  <Box key={day}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <Chip label={day} icon={<CalendarMonthRounded />} />
                      <Typography variant="subtitle2" color="text.secondary">
                        {list.length} sự kiện
                      </Typography>
                    </Stack>
                    <Stack spacing={1.5}>
                      {list.map((ev) => {
                        const s = parseISO(ev.startDate);
                        const e = parseISO(ev.endDate) || s;
                        const timeLabel =
                          s && e
                            ? `${String(s.getHours()).padStart(
                                2,
                                "0"
                              )}:${String(s.getMinutes()).padStart(
                                2,
                                "0"
                              )} - ${String(e.getHours()).padStart(
                                2,
                                "0"
                              )}:${String(e.getMinutes()).padStart(2, "0")}`
                            : "—";
                        const capacity = Number(ev.capacity) || 0;
                        const registered = Math.min(
                          Number(ev.registered) || 0,
                          capacity || Number.MAX_SAFE_INTEGER
                        );
                        const progress =
                          capacity > 0
                            ? Math.round((registered / capacity) * 100)
                            : 0;

                        return (
                          <Box
                            key={ev.id}
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
                              <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600 }}
                              >
                                {ev.title}
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                <Chip
                                  size="small"
                                  label={ev.category || ev.type || "Khác"}
                                  color="info"
                                  variant="outlined"
                                />
                                <Chip
                                  size="small"
                                  label={ev.type || "Sự kiện"}
                                  color="primary"
                                  variant="outlined"
                                />
                                <Chip
                                  size="small"
                                  label={(ev.status || "PENDING").toUpperCase()}
                                  color={
                                    (ev.status || "").toUpperCase() ===
                                    "PUBLISHED"
                                      ? "success"
                                      : "warning"
                                  }
                                  variant="outlined"
                                />
                              </Stack>
                            </Stack>
                            <Stack
                              direction="row"
                              spacing={2}
                              sx={{ mt: 1 }}
                              flexWrap="wrap"
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <AccessTimeRounded fontSize="small" />
                                <Typography variant="body2">
                                  {timeLabel}
                                </Typography>
                              </Stack>
                              {ev.venue && (
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <PlaceRounded fontSize="small" />
                                  <Typography variant="body2">
                                    {ev.venue}
                                  </Typography>
                                </Stack>
                              )}
                            </Stack>
                            {capacity > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                >
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Đăng ký: {registered}/{capacity}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
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
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

/* ====================== Subcomponents & styles ====================== */

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

const cardTitleSx = { fontWeight: "bold", color: "text.primary", mb: 1.5 };

function KpiCard({ title, value, icon, gradient, large, link }) {
  const navigate = useNavigate();
  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={3}
      onClick={() => {
        if (link) navigate(link);
      }}
    >
      <Paper
        sx={{
          p: large ? 3 : 2,
          borderRadius: "16px",
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.12)",
          background: gradient,
          color: "white",
          display: "flex",
          alignItems: "center",
          minHeight: large ? 140 : 100,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 10px 32px rgba(0, 0, 0, 0.18)",
            transform: "translateY(-4px)",
          },
        }}
      >
        <Box sx={{ mr: 2 }}>{icon}</Box>
        <Box>
          <Typography
            variant={large ? "body1" : "body2"}
            sx={{ fontWeight: 600 }}
          >
            {title}
          </Typography>
          <Typography variant={large ? "h4" : "h5"} sx={{ fontWeight: "bold" }}>
            {value}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}

export default Dashboard;
