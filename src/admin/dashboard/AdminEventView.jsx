import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  CalendarMonthRounded,
  AccessTimeRounded,
  PlaceRounded,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import readAuth from "../auth/getToken";

/** Đọc token giống Dashboard */
const STORAGE_KEY = "authState_v1";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:6868";

export default function AdminEventView() {
  const { id } = useParams(); // id sự kiện
  const navigate = useNavigate();
  const { token, role, userId } = readAuth();
  const authHeaders = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ open: false, text: "", type: "success" });

  useEffect(() => {
    (async () => {
      try {
        // TÙY API của bạn, nếu chi tiết event là /api/admin/events/{id} thì sửa lại:
        const res = await fetch(`${API_BASE}/api/admin/pending/${id}`, {
          headers: authHeaders,
        });
        if (!res.ok) throw new Error(`GET event failed: ${res.status}`);
        const data = await res.json();
        setEvent(data);
      } catch (e) {
        setMsg({
          open: true,
          text: "Không tải được chi tiết sự kiện",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleApprove = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/events/${id}/approve`, {
        method: "POST",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error(`Approve failed: ${res.status}`);
      setEvent((prev) => ({ ...prev, status: "APPROVED" }));
      setMsg({ open: true, text: "Đã duyệt sự kiện", type: "success" });
    } catch (e) {
      setMsg({ open: true, text: "Duyệt thất bại", type: "error" });
    }
  };

  const handleReject = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/organizer/events/${id}/`, {
        method: "POST",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error(`Reject failed: ${res.status}`);
      setEvent((prev) => ({ ...prev, status: "REJECTED" }));
      setMsg({ open: true, text: "Đã từ chối sự kiện", type: "success" });
    } catch (e) {
      setMsg({ open: true, text: "Từ chối thất bại", type: "error" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Không tìm thấy sự kiện</Alert>
      </Box>
    );
  }

  const parseISO = (s) => (s ? new Date(s) : null);
  const s = parseISO(event.startDate || event.date);
  const e = parseISO(event.endDate || event.date);

  const timeLabel =
    s && e
      ? `${String(s.getHours()).padStart(2, "0")}:${String(
          s.getMinutes()
        ).padStart(2, "0")} - ${String(e.getHours()).padStart(2, "0")}:${String(
          e.getMinutes()
        ).padStart(2, "0")}`
      : "—";

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Xem sự kiện
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.2}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {event.title || "—"}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={event.department || event.category || "—"} />
            <Chip
              label={(event.type || "Sự kiện").toString()}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={(event.status || "PENDING").toString().toUpperCase()}
              color={
                (event.status || "").toString().toUpperCase() === "APPROVED"
                  ? "success"
                  : (event.status || "").toString().toUpperCase() === "REJECTED"
                  ? "error"
                  : "warning"
              }
              variant="outlined"
            />
          </Stack>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            {(s || e) && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarMonthRounded fontSize="small" />
                <Typography variant="body2">
                  {s?.toLocaleDateString()}{" "}
                  {e && s && s.toDateString() !== e.toDateString()
                    ? `→ ${e.toLocaleDateString()}`
                    : ""}
                </Typography>
              </Stack>
            )}
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeRounded fontSize="small" />
              <Typography variant="body2">{timeLabel}</Typography>
            </Stack>
            {event.venue && (
              <Stack direction="row" spacing={1} alignItems="center">
                <PlaceRounded fontSize="small" />
                <Typography variant="body2">{event.venue}</Typography>
              </Stack>
            )}
          </Stack>

          {event.description && (
            <>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Mô tả
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {event.description}
              </Typography>
            </>
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={handleApprove}
            disabled={(event.status || "").toUpperCase() === "APPROVED"}
          >
            Duyệt
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Cancel />}
            onClick={handleReject}
            disabled={(event.status || "").toUpperCase() === "REJECTED"}
          >
            Từ chối
          </Button>
        </Stack>
      </Paper>

      <Snackbar
        open={msg.open}
        autoHideDuration={2500}
        onClose={() => setMsg((m) => ({ ...m, open: false }))}
      >
        <Alert
          onClose={() => setMsg((m) => ({ ...m, open: false }))}
          severity={msg.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {msg.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
