import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Divider,
  LinearProgress,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import PlaceRounded from "@mui/icons-material/PlaceRounded";
import FilterAlt from "@mui/icons-material/FilterAlt";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import { useEventContext } from "../../EventContext";

const parseISO = (s) => (s ? new Date(s) : null);
const fmtDate = (s) => (s ? String(s).slice(0, 10) : "—");
const fmtTimeHM = (d) =>
  d ? `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` : "—";

const paperCardSx = {
  p: 2,
  borderRadius: "12px",
  boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
  bgcolor: "white",
};

/** check khoảng thời gian có giao nhau không (overlap) */
function inRange(start, end, fromStr, toStr) {
  if (!fromStr && !toStr) return true;
  const s = parseISO(start);
  const e = parseISO(end) || s;
  if (!s) return false;
  const from = fromStr ? new Date(`${fromStr}T00:00:00`) : null;
  const to = toStr ? new Date(`${toStr}T23:59:59`) : null;
  if (from && e < from) return false;
  if (to && s > to) return false;
  return true;
}

export default function EventsThisMonthPanel() {
  const navigate = useNavigate();
  const { eventsThisMonth = [] } = useEventContext();

  // --------- STATE FILTER ----------
  const [qTitle, setQTitle] = useState("");
  const [filters, setFilters] = useState({
    dept: "Tất cả",
    type: "Tất cả",
    startDate: "",
    endDate: "",
  });

  // --------- OPTIONS SELECT ----------
  const deptOptions = useMemo(() => {
    const s = new Set(["Tất cả"]);
    (eventsThisMonth || []).forEach((ev) => {
      const v = ev.department || ev.category || "Khác";
      s.add(v);
    });
    return Array.from(s);
  }, [eventsThisMonth]);

 const typeOptions = useMemo( 
   () => ["Tất cả", "Workshop", "Sports", "Cultural", "Technical"], 
  [] 
 );

  // --------- ÁP DỤNG FILTER ----------
const filtered = useMemo(() => {
  const normalize = (s) =>
    String(s || "")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

  const q = normalize(qTitle.trim());

  return (eventsThisMonth ?? []).filter((ev) => {
    const evDept = ev.department || ev.category || "Khác";
    const evCategory = ev.category || ev.type || "Khác"; // ưu tiên category

    const okDept = filters.dept === "Tất cả" || evDept === filters.dept;
    const okType = filters.type === "Tất cả" || evCategory === filters.type;
    const okDate = inRange(ev.startDate, ev.endDate, filters.startDate, filters.endDate);
    const okTitle = !q || normalize(ev.title).includes(q);

    return okDept && okType && okDate && okTitle;
  });
}, [
  eventsThisMonth,
  qTitle,
  filters.dept,
  filters.type,
  filters.startDate,
  filters.endDate,
]);


  // Tổng hợp capacity/registered
  const { totalCapacity, totalRegistered } = useMemo(() => {
    return filtered.reduce(
      (acc, ev) => {
        const cap = Number(ev.capacity) || Number(ev.totalSeats) || 0;
        const reg = Math.min(Number(ev.registered) || Number(ev.seatsUsed) || 0, cap || Infinity);
        acc.totalCapacity += cap;
        acc.totalRegistered += reg;
        return acc;
      },
      { totalCapacity: 0, totalRegistered: 0 }
    );
  }, [filtered]);

  return (
    <Paper sx={paperCardSx}>
      {/* Header + Back */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Quay lại">
            <IconButton size="small" onClick={() => navigate(-1)}>
              <ArrowBackIosNew fontSize="small" />
            </IconButton>
          </Tooltip>
          <CalendarMonthRounded />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Events this month
          </Typography>
        </Stack>
        <Chip color="primary" label={`${filtered.length} sự kiện`} sx={{ fontWeight: 600 }} />
      </Stack>

      {/* Tổng quan đăng ký */}
      {(totalCapacity > 0 || totalRegistered > 0) && (
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Đăng ký: {totalRegistered}/{totalCapacity}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {totalCapacity > 0 ? Math.round((totalRegistered / totalCapacity) * 100) : 0}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={
              totalCapacity > 0
                ? Math.min(100, Math.round((totalRegistered / totalCapacity) * 100))
                : 0
            }
            sx={{ height: 8, borderRadius: 1, mt: 0.5 }}
          />
        </Box>
      )}

      <Divider sx={{ my: 2 }} />

      {/* ===== Bộ lọc ===== */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
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

        {/* <TextField
          select
          size="small"
          label="Phòng ban"
          value={filters.dept}
          onChange={(e) => setFilters((f) => ({ ...f, dept: e.target.value }))}
          sx={{ minWidth: 180 }}
        >
          {deptOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField> */}

        <TextField
          select
          size="small"
          label="Loại sự kiện"
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
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

      <Divider sx={{ my: 2 }} />

      {/* ===== Danh sách ===== */}
      {filtered.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Không có sự kiện nào phù hợp bộ lọc.
        </Typography>
      ) : (
        <Stack spacing={1.5} sx={{ maxHeight: 420, overflow: "auto", pr: 1 }}>
          {filtered.map((ev) => {
            const s = parseISO(ev.startDate);
            const e = parseISO(ev.endDate) || s;
            const timeLabel = s && e ? `${fmtTimeHM(s)} - ${fmtTimeHM(e)}` : "—";
            const key = ev.id ?? ev.eventId ?? ev.uuid ?? `${ev.title}-${ev.startDate}`;

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
                    {ev.title || "Untitled event"}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {!!(ev.department || ev.category) && (
                      <Chip size="small" label={ev.department || ev.category} />
                    )}
                    {!!ev.type && (
                      <Chip size="small" label={ev.type} color="primary" variant="outlined" />
                    )}
                    {!!ev.status && (
                      <Chip
                        size="small"
                        label={String(ev.status).toUpperCase()}
                        color={
                          String(ev.status).toUpperCase() === "PUBLISHED" ? "success" : "warning"
                        }
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mt: 1 }} flexWrap="wrap">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonthRounded fontSize="small" />
                    <Typography variant="body2">
                      {fmtDate(ev.startDate)}
                      {ev.endDate && ev.endDate !== ev.startDate ? ` → ${fmtDate(ev.endDate)}` : ""}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <AccessTimeRounded fontSize="small" />
                    <Typography variant="body2">{timeLabel}</Typography>
                  </Stack>

                  {!!ev.venue && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PlaceRounded fontSize="small" />
                      <Typography variant="body2">{ev.venue}</Typography>
                    </Stack>
                  )}
                </Stack>

                {Number(ev.capacity) > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="caption" color="text.secondary">
                        Đăng ký:{" "}
                        {Math.min(Number(ev.registered) || 0, Number(ev.capacity) || 0)}/
                        {Number(ev.capacity) || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {Math.round(
                          ((Math.min(Number(ev.registered) || 0, Number(ev.capacity) || 0) /
                            (Number(ev.capacity) || 1)) *
                            100)
                        )}
                        %
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(
                        100,
                        Math.round(
                          ((Math.min(Number(ev.registered) || 0, Number(ev.capacity) || 0) /
                            (Number(ev.capacity) || 1)) *
                            100)
                        )
                      )}
                      sx={{ height: 6, borderRadius: 1 }}
                    />
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}
