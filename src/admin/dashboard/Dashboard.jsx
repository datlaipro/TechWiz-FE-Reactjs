import React, { useState, useEffect, useMemo } from 'react';
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
} from '@mui/material';
import {
  FilterAlt,
  CheckCircle,
  Cancel,
  CalendarMonthRounded,
  PlaceRounded,
  AccessTimeRounded,
  Article,
  PendingActions,
  WarningAmberRounded,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

/* ========================= Component ========================= */

function Dashboard() {
  /* ---------- EVENTS & NEWS (Giai đoạn 1) ---------- */
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [evLoading, setEvLoading] = useState(true);
  const [evError, setEvError] = useState('');

  // Bộ lọc giai đoạn 1
  const [filters, setFilters] = useState({
    dept: 'Tất cả',
    type: 'Tất cả',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [evRes, newsRes] = await Promise.allSettled([
          fetch('http://localhost:6868/api/events'),// hàng chờ duyệt và sự kiện
          fetch('http://localhost:6868/api/news'),
        ]);

        let evData = [];
        let newsData = [];

        if (evRes.status === 'fulfilled' && evRes.value.ok) {
          evData = await evRes.value.json();
        }
        if (newsRes.status === 'fulfilled' && newsRes.value.ok) {
          newsData = await newsRes.value.json();
        }

        // Fallback demo nếu API chưa có
        if (!Array.isArray(evData) || evData.length === 0) evData = demoEvents();
        if (!Array.isArray(newsData) || newsData.length === 0) newsData = demoNews();

        setEvents(evData);
        setNews(newsData);
        setEvLoading(false);
      } catch (e) {
        console.error('Events Error:', e);
        setEvError('Không thể tải dữ liệu sự kiện/tin tức');
        setEvLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Helpers
  const parseISO = (s) => (s ? new Date(s) : null);
  const sameDayKey = (d) =>
    d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '';
  const isInRange = (start, end, fromStr, toStr) => {
    if (!fromStr && !toStr) return true;
    const from = fromStr ? new Date(fromStr + 'T00:00:00') : null;
    const to = toStr ? new Date(toStr + 'T23:59:59') : null;
    const s = parseISO(start);
    const e = parseISO(end) || s;
    if (from && e < from) return false;
    if (to && s > to) return false;
    return true;
  };

  // Options cho Select filter
  const deptOptions = useMemo(() => ['Tất cả', ...Array.from(new Set(events.map((e) => e.department || 'Khác')))], [events]);
  const typeOptions = useMemo(() => ['Tất cả', ...Array.from(new Set(events.map((e) => e.type || 'Khác')))], [events]);

  // Áp bộ lọc
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const okDept = filters.dept === 'Tất cả' || (e.department || 'Khác') === filters.dept;
      const okType = filters.type === 'Tất cả' || (e.type || 'Khác') === filters.type;
      const okDate = isInRange(e.startDate, e.endDate, filters.startDate, filters.endDate);
      return okDept && okType && okDate;
    });
  }, [events, filters]);

  // Group theo ngày cho "Calendar List"
  const eventsByDay = useMemo(() => {
    const map = new Map();
    filteredEvents.forEach((ev) => {
      const key = sameDayKey(parseISO(ev.startDate));
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    });
    const entries = Array.from(map.entries()).sort(([a], [b]) => new Date(a) - new Date(b));
    entries.forEach(([, list]) => list.sort((x, y) => parseISO(x.startDate) - parseISO(y.startDate)));
    return entries;
  }, [filteredEvents]);

  // Metrics Giai đoạn 1
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const eventsThisMonth = events.filter(
    (e) => isInRange(e.startDate, e.endDate, sameDayKey(monthStart), sameDayKey(monthEnd))
  ).length;

  const newsThisMonth = news.filter((n) => {
    const d = parseISO(n.publishAt || n.createdAt);
    return d && d >= monthStart && d <= monthEnd;
  }).length;

  const pendingEvents = events.filter((e) => (e.status || '').toUpperCase() === 'IN_REVIEW' || (e.status || '').toUpperCase() === 'PENDING').length;
  const pendingNews = news.filter((n) => (n.status || '').toUpperCase() === 'IN_REVIEW' || (n.status || '').toUpperCase() === 'PENDING').length;

  // Đếm conflict đơn giản: cùng địa điểm & trùng thời gian
  const conflictCount = useMemo(() => {
    let c = 0;
    const arr = [...events];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const a = arr[i], b = arr[j];
        if (!a.venue || !b.venue || a.venue !== b.venue) continue;
        const aS = parseISO(a.startDate), aE = parseISO(a.endDate) || aS;
        const bS = parseISO(b.startDate), bE = parseISO(b.endDate) || bS;
        if (aS && aE && bS && bE && aS <= bE && bS <= aE) c++;
      }
    }
    return c;
  }, [events]);

  // Approval Queue rows (events + news)
  const [queueRows, setQueueRows] = useState([]);
  useEffect(() => {
    const evRows = events
      .filter((e) => (e.status || '').toUpperCase() === 'IN_REVIEW' || (e.status || '').toUpperCase() === 'PENDING')
      .map((e) => ({
        id: `EVT-${e.id}`,
        type: 'Sự kiện',
        title: e.title,
        department: e.department || 'Khác',
        status: e.status || 'PENDING',
        scheduledAt: e.startDate,
        venue: e.venue || '',
      }));
    const newsRows = news
      .filter((n) => (n.status || '').toUpperCase() === 'IN_REVIEW' || (n.status || '').toUpperCase() === 'PENDING')
      .map((n) => ({
        id: `NEWS-${n.id}`,
        type: 'Tin tức',
        title: n.title,
        department: n.department || 'Khác',
        status: n.status || 'PENDING',
        scheduledAt: n.publishAt || n.createdAt,
        venue: '',
      }));
    setQueueRows([...evRows, ...newsRows]);
  }, [events, news]);

  const handleApprove = (id) => setQueueRows((prev) => prev.filter((r) => r.id !== id)); // fake
  const handleReject = (id) => setQueueRows((prev) => prev.filter((r) => r.id !== id));   // fake

  /* ---------- Loading & Error ---------- */
  if (evLoading) {
    return (
      <Box sx={{ mt: 2, px: { xs: 1, sm: 2 }, bgcolor: 'grey.50' }}>
        <Grid container spacing={2}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={`sk-kpi-${i}`}>
              <Skeleton variant="rectangular" height={160} sx={{ borderRadius: '16px' }} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} >
            <Skeleton variant="rectangular" height={420} sx={{ borderRadius: '12px' }} />
          </Grid>
          <Grid item xs={12} >
            <Skeleton variant="rectangular" height={420} sx={{ borderRadius: '12px' }} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (evError) {
    return (
      <Box sx={{ mt: 2, px: { xs: 1, sm: 2 }, bgcolor: 'grey.50' }}>
        <Alert severity="error" sx={{ mb: 2 }}>{evError}</Alert>
      </Box>
    );
  }

  /* ========================= Render ========================= */
  return (
    <Box sx={{ mt: 1, px: { xs: 1, sm: 2 }, bgcolor: 'grey.50' }}>
      {/* TOP: KPI Sự kiện & Tin tức (to gấp đôi) */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <KpiCard
          large
          title="Sự kiện trong tháng"
          value={eventsThisMonth}
          icon={<CalendarMonthRounded sx={{ fontSize: 64 }} />}
          gradient="linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
        />
        <KpiCard
          large
          title="Tin tức trong tháng"
          value={newsThisMonth}
          icon={<Article sx={{ fontSize: 64 }} />}
          gradient="linear-gradient(135deg, #00897b 0%, #26a69a 100%)"
        />
        <KpiCard
          large
          title="Chờ duyệt (Sự kiện/Tin)"
          value={`${pendingEvents}/${pendingNews}`}
          icon={<PendingActions sx={{ fontSize: 64 }} />}
          gradient="linear-gradient(135deg, #5e35b1 0%, #9575cd 100%)"
        />
        <KpiCard
          large
          title="Cảnh báo trùng lịch"
          value={conflictCount}
          icon={<WarningAmberRounded sx={{ fontSize: 64 }} />}
          gradient="linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)"
        />
      </Grid>

      {/* Bộ lọc Giai đoạn 1 */}
      <Paper sx={{ ...paperCardSx, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterAlt />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Bộ lọc sự kiện
            </Typography>
          </Stack>
          <Box sx={{ flex: 1 }} />
          <TextField
            select
            size="small"
            label="Phòng ban"
            value={filters.dept}
            onChange={(e) => setFilters((f) => ({ ...f, dept: e.target.value }))}
            sx={{ minWidth: 180 }}
          >
            {deptOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Loại sự kiện"
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
            sx={{ minWidth: 180 }}
          >
            {typeOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            type="date"
            label="Từ ngày"
            InputLabelProps={{ shrink: true }}
            value={filters.startDate}
            onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
          />
          <TextField
            size="small"
            type="date"
            label="Đến ngày"
            InputLabelProps={{ shrink: true }}
            value={filters.endDate}
            onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
          />
          <Button
            variant="outlined"
            onClick={() => setFilters({ dept: 'Tất cả', type: 'Tất cả', startDate: '', endDate: '' })}
          >
            Xóa lọc
          </Button>
        </Stack>
      </Paper>

      {/* Lưới: Calendar List (trái) + Approval Queue (phải) */}
      <Grid container spacing={2}>
        {/* Calendar List */}
        <Grid item xs={12} >
          <Paper sx={paperCardSx}>
            <Typography variant="h6" sx={cardTitleSx}>
              Lịch sự kiện (theo ngày)
            </Typography>
            {eventsByDay.length === 0 ? (
              <Alert severity="info">Không có sự kiện phù hợp bộ lọc</Alert>
            ) : (
              <Stack spacing={2} sx={{ maxHeight: 420, overflow: 'auto', pr: 1 }}>
                {eventsByDay.map(([day, list]) => (
                  <Box key={day}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
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
                            ? `${String(s.getHours()).padStart(2, '0')}:${String(s.getMinutes()).padStart(2, '0')} - ${String(e.getHours()).padStart(2, '0')}:${String(e.getMinutes()).padStart(2, '0')}`
                            : '—';
                        const capacity = Number(ev.capacity) || 0;
                        const registered = Math.min(Number(ev.registered) || 0, capacity || Number.MAX_SAFE_INTEGER);
                        const progress = capacity > 0 ? Math.round((registered / capacity) * 100) : 0;

                        return (
                          <Box key={ev.id} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
                            <Stack
                              direction={{ xs: 'column', sm: 'row' }}
                              spacing={1}
                              alignItems={{ xs: 'flex-start', sm: 'center' }}
                              justifyContent="space-between"
                            >
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {ev.title}
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                <Chip size="small" label={ev.department || 'Khác'} />
                                <Chip size="small" label={ev.type || 'Sự kiện'} color="primary" variant="outlined" />
                                <Chip
                                  size="small"
                                  label={(ev.status || 'PENDING').toUpperCase()}
                                  color={(ev.status || '').toUpperCase() === 'PUBLISHED' ? 'success' : 'warning'}
                                  variant="outlined"
                                />
                              </Stack>
                            </Stack>
                            <Stack direction="row" spacing={2} sx={{ mt: 1 }} flexWrap="wrap">
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
                                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
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

        {/* Approval Queue */}
        <Grid item xs={12} >
          <Paper sx={paperCardSx}>
            <Typography variant="h6" sx={cardTitleSx}>
              Hàng chờ duyệt
            </Typography>
            <Box sx={{ height: 420 }}>
              <DataGrid
                rows={queueRows}
                columns={[
                  { field: 'type', headerName: 'Loại', width: 90 },
                  { field: 'title', headerName: 'Tiêu đề', flex: 1, minWidth: 160 },
                  { field: 'department', headerName: 'Phòng ban', width: 120 },
                  {
                    field: 'status',
                    headerName: 'Trạng thái',
                    width: 120,
                    renderCell: (p) => (
                      <Chip
                        size="small"
                        label={(p.value || '').toUpperCase()}
                        color={(p.value || '').toUpperCase() === 'PENDING' ? 'warning' : 'info'}
                        variant="outlined"
                      />
                    ),
                  },
                  { field: 'scheduledAt', headerName: 'Lịch', width: 120 },
                  {
                    field: 'actions',
                    headerName: 'Thao tác',
                    width: 160,
                    sortable: false,
                    renderCell: (p) => (
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          color="success"
                          variant="outlined"
                          startIcon={<CheckCircle />}
                          onClick={() => handleApprove(p.row.id)}
                        >
                          Duyệt
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<Cancel />}
                          onClick={() => handleReject(p.row.id)}
                        >
                          Hủy
                        </Button>
                      </Stack>
                    ),
                  },
                ]}
                hideFooterSelectedRowCount
                pageSizeOptions={[5, 10]}
                initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
              />
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant="body2" color="text.secondary">
              *Thao tác duyệt/hủy hiện chỉ cập nhật UI. Khi có API, gọi endpoint tương ứng rồi refetch.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

/* ====================== Subcomponents & styles ====================== */

const paperCardSx = {
  p: 2,
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  bgcolor: 'white',
  transition: 'all 0.3s ease',
  '&:hover': { boxShadow: '0 8px 28px rgba(0,0,0,0.12)', transform: 'translateY(-2px)' },
};

const cardTitleSx = { fontWeight: 'bold', color: 'text.primary', mb: 1.5 };

function KpiCard({ title, value, icon, gradient, large }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Paper
        sx={{
          p: large ? 3 : 2,
          borderRadius: '16px',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
          background: gradient,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          minHeight: large ? 140 : 100,
          transition: 'all 0.3s ease',
          '&:hover': { boxShadow: '0 10px 32px rgba(0, 0, 0, 0.18)', transform: 'translateY(-4px)' },
        }}
      >
        <Box sx={{ mr: 2 }}>{icon}</Box>
        <Box>
          <Typography variant={large ? 'body1' : 'body2'} sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant={large ? 'h4' : 'h5'} sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}

/* ====================== Demo Data (fallback) ====================== */
function demoEvents() {
  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 19);
  const d = (offsetDay, sh, sm, eh, em) => {
    const s = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offsetDay, sh, sm, 0);
    const e = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offsetDay, eh, em, 0);
    return [iso(s), iso(e)];
  };
  const [s1, e1] = d(0, 9, 0, 11, 0);
  const [s2, e2] = d(1, 14, 0, 16, 0);
  const [s3, e3] = d(1, 9, 30, 11, 30);
  const [s4, e4] = d(2, 18, 0, 20, 0);
  const [s5, e5] = d(0, 10, 0, 12, 0); // conflict venue C101

  return [
    { id: 1, title: 'Workshop React cơ bản', department: 'Khoa CNTT', type: 'Workshop', status: 'PUBLISHED', startDate: s1, endDate: e1, venue: 'A201', capacity: 120, registered: 76 },
    { id: 2, title: 'Hội thảo AI & Data', department: 'Khoa CNTT', type: 'Hội thảo', status: 'IN_REVIEW', startDate: s2, endDate: e2, venue: 'Hall 1', capacity: 300, registered: 210 },
    { id: 3, title: 'Cuộc thi Học thuật', department: 'Khoa Kinh tế', type: 'Cuộc thi', status: 'PENDING', startDate: s3, endDate: e3, venue: 'C101', capacity: 80, registered: 80 },
    { id: 4, title: 'Talkshow Khởi nghiệp', department: 'Phòng CTSV', type: 'Talkshow', status: 'PENDING', startDate: s4, endDate: e4, venue: 'Sân khấu trung tâm', capacity: 500, registered: 320 },
    { id: 5, title: 'Seminar Blockchain', department: 'Khoa CNTT', type: 'Seminar', status: 'PUBLISHED', startDate: s5, endDate: e5, venue: 'C101', capacity: 60, registered: 45 },
  ];
}

function demoNews() {
  const now = new Date();
  const iso = (d) => d.toISOString().slice(0, 19);
  return [
    { id: 101, title: 'Thông báo lịch học tuần này', department: 'Phòng Đào tạo', status: 'PUBLISHED', publishAt: iso(now) },
    { id: 102, title: 'Mời tham gia hội thảo AI', department: 'Khoa CNTT', status: 'IN_REVIEW', publishAt: iso(new Date(now.getTime() + 86400000)) },
    { id: 103, title: 'Tổng kết cuộc thi nghiên cứu khoa học', department: 'Phòng KHCN', status: 'PENDING', publishAt: iso(new Date(now.getTime() + 2 * 86400000)) },
  ];
}

export default Dashboard;
