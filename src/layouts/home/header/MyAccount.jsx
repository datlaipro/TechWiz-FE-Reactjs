import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Chip,
  Avatar,
  Stack,
  TextField,
  MenuItem,
  IconButton,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import axios from "axios";
import readAuth from "../../../admin/auth/getToken";

const STORAGE_KEY_NEW = "authState_v1";
const STORAGE_KEY_OLD = "STORAGE_KEY";
const STORAGE_KEY_JWT = "jwtToken";
const REG_KEY = "registeredEvents_v1";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:6868";

const { token } = readAuth();
const authHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=UTF-8",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

/* ---------- Helpers: decode JWT & đọc localStorage ---------- */
function b64urlDecode(str) {
  try {
    const pad = (s) => s + "=".repeat((4 - (s.length % 4)) % 4);
    const b64 = pad(str.replace(/-/g, "+").replace(/_/g, "/"));
    return decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return "";
  }
}
function parseJwt(token) {
  try {
    const parts = token?.split(".") || [];
    if (parts.length !== 3) return {};
    return JSON.parse(b64urlDecode(parts[1]) || "{}");
  } catch {
    return {};
  }
}
function isTokenExpired(token) {
  try {
    const { exp } = parseJwt(token);
    if (!exp) return false;
    const nowSec = Math.floor(Date.now() / 1000);
    return exp <= nowSec;
  } catch {
    return true;
  }
}
function readAuthFromStorage() {
  try {
    const rawNew = localStorage.getItem(STORAGE_KEY_NEW);
    if (rawNew) {
      try {
        const saved = JSON.parse(rawNew);
        const token =
          saved?.token ||
          saved?.jwtToken ||
          saved?.user?.token ||
          saved?.user?.jwt ||
          null;

        const logged = !!token && !isTokenExpired(token);
        let user = saved?.user || null;
        if (!user && token) {
          const p = parseJwt(token);
          user = {
            email: p?.sub || p?.email || "",
            fullName: p?.name || p?.fullName || "",
            roles: p?.roles || "",
          };
        }
        return { isLoggedIn: logged, user, accessToken: token || null };
      } catch {}
    }

    const tokOld = localStorage.getItem(STORAGE_KEY_OLD);
    if (tokOld) {
      const logged = !isTokenExpired(tokOld);
      const p = parseJwt(tokOld);
      const user = {
        email: p?.sub || p?.email || "",
        fullName: p?.name || p?.fullName || "",
        roles: p?.roles || "",
      };
      return { isLoggedIn: logged, user, accessToken: tokOld };
    }

    const tokJwt = localStorage.getItem(STORAGE_KEY_JWT);
    if (tokJwt) {
      const logged = !isTokenExpired(tokJwt);
      const p = parseJwt(tokJwt);
      const user = {
        email: p?.sub || p?.email || "",
        fullName: p?.name || p?.fullName || "",
        roles: p?.roles || "",
      };
      return { isLoggedIn: logged, user, accessToken: tokJwt };
    }

    return { isLoggedIn: false, user: null, accessToken: null };
  } catch {
    return { isLoggedIn: false, user: null, accessToken: null };
  }
}

const fmt = (s) => {
  const d = new Date(s);
  return Number.isNaN(+d) ? "N/A" : d.toLocaleString("vi-VN");
};
const isUpcoming = (s) => new Date(s).getTime() >= Date.now();

/* ================= Component ================= */
export default function MyAccount() {
  const [{ isLoggedIn, user, accessToken }, setAuth] = useState(
    readAuthFromStorage()
  );

  // ===== QR tickets =====
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ===== Registrations =====
  const [regs, setRegs] = useState([]); // danh sách đã đăng ký (enriched kèm info event)
  const [regsLoading, setRegsLoading] = useState(true);
  const [regsErr, setRegsErr] = useState("");

  const [filter, setFilter] = useState("all"); // all | upcoming | past
  const [search, setSearch] = useState("");
  const [qrDialog, setQrDialog] = useState({ open: false, img: "", title: "" });
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });

  function readEventStudentSafe() {
    const raw = localStorage.getItem(REG_KEY) || "";

    // 1) JSON trước
    try {
      const j = JSON.parse(raw);
      if (Array.isArray(j)) {
        for (let i = j.length - 1; i >= 0; i--) {
          const ids = String(j[i]).match(/\d+/g);
          if (ids && ids.length >= 2) {
            return { eventId: +ids[0], studentId: +ids[1] };
          }
        }
      } else if (j && typeof j === "object") {
        const e = j.eventId ?? j.e ?? j.event ?? j.id;
        const s = j.studentId ?? j.s ?? j.student ?? j.userId;
        return {
          eventId: e != null ? +String(e).match(/\d+/)?.[0] : null,
          studentId: s != null ? +String(s).match(/\d+/)?.[0] : null,
        };
      }
    } catch {}

    // 2) Dạng "eventId|studentId"
    if (raw.includes("|")) {
      const [a, b] = raw.split("|");
      return {
        eventId: +((a || "").match(/\d+/)?.[0] || NaN) || null,
        studentId: +((b || "").match(/\d+/)?.[0] || NaN) || null,
      };
    }

    // 3) Fallback: bắt 2 số đầu tiên
    const m = raw.match(/\d+/g);
    return {
      eventId: m?.[0] ? +m[0] : null,
      studentId: m?.[1] ? +m[1] : null,
    };
  }

  const { eventId, studentId } = readEventStudentSafe();
  if (eventId && studentId) {
    localStorage.setItem(REG_KEY, `${eventId}|${studentId}`);
  }
  const payload = { eventId, studentId, size: 240 };

  // Đồng bộ auth theo localStorage
  useEffect(() => {
    const onStorage = (e) => {
      if (
        e.key === STORAGE_KEY_NEW ||
        e.key === STORAGE_KEY_OLD ||
        e.key === STORAGE_KEY_JWT
      ) {
        setAuth(readAuthFromStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  useEffect(() => {
    setAuth(readAuthFromStorage());
  }, []);

  // ====== FIX: gọi API phát QR đúng chuẩn axios.post(url, data, config)
  const fetchTickets = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      setErr("");
      const res = await axios.post(
        `${API_BASE}/api/qr/issue`,
        payload,
        { headers: authHeaders }
      );
      setTickets(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Lỗi tải vé/QR.");
    } finally {
      setLoading(false);
    }
  };

  // ====== Registrations ======
  const eventCache = useRef(new Map()); // cache event detail theo id

  const fetchEventDetail = async (id) => {
    if (!id) return null;
    if (eventCache.current.has(id)) return eventCache.current.get(id);
    try {
      const res = await axios.get(`${API_BASE}/api/events/${id}`, {
        headers: authHeaders,
      });
      const data = res?.data || null;
      eventCache.current.set(id, data);
      return data;
    } catch {
      eventCache.current.set(id, null);
      return null;
    }
  };

  const tryGet = async (url) => {
    try {
      const r = await axios.get(url, { headers: authHeaders });
      if (Array.isArray(r.data)) return r.data;
      if (r?.data?.content && Array.isArray(r.data.content)) return r.data.content; // nếu dạng page
      return [];
    } catch {
      return null; // cho phép fallback endpoint khác
    }
  };

  const fetchRegistrations = async () => {
    if (!accessToken || !studentId) {
      setRegsLoading(false);
      return;
    }
    setRegsLoading(true);
    setRegsErr("");
    try {
      const endpoints = [
        `${API_BASE}/api/registrations/student/${studentId}`,
        `${API_BASE}/api/registrations/by-student/${studentId}`,
        `${API_BASE}/api/registrations?studentId=${studentId}`,
      ];
      let raw = null;
      for (const ep of endpoints) {
        raw = await tryGet(ep);
        if (raw !== null) break;
      }
      if (!raw) raw = [];

      // Enrich bằng thông tin event
      const enriched = await Promise.all(
        raw.map(async (r) => {
          const ev = await fetchEventDetail(r.eventId);
          return {
            id: r.registrationId ?? r.id,
            registrationId: r.registrationId ?? r.id,
            eventId: r.eventId,
            studentId: r.studentId,
            status: r.status,
            registeredOn: r.registeredOn,
            // Thông tin event (nếu có)
            eventTitle: ev?.title || `Sự kiện #${r.eventId}`,
            eventDate: ev?.startDate || ev?.date || null,
            venue: ev?.venue || "",
            department: ev?.department || ev?.organizer || "",
            link: ev?.id ? `/productdetail/${ev.id}` : undefined, // tuỳ route của bạn
          };
        })
      );
      setRegs(enriched);
    } catch (e) {
      setRegsErr(e?.response?.data?.message || e?.message || "Lỗi tải đăng ký.");
    } finally {
      setRegsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && !isTokenExpired(accessToken)) {
      fetchTickets();
      fetchRegistrations();
    } else {
      setLoading(false);
      setRegsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, studentId]);

  const statusChip = (s) => {
    const key = String(s || "").toUpperCase();
    const map = {
      CONFIRMED: { label: "Đã xác nhận", color: "success" },
      PENDING: { label: "Chờ duyệt", color: "warning" },
      PENDING_APPROVAL: { label: "Chờ duyệt", color: "warning" },
      CANCELED: { label: "Đã hủy", color: "default" },
      REJECTED: { label: "Từ chối", color: "error" },
      // lowercase support
      CONFIRMED_L: { label: "Đã xác nhận", color: "success" },
      PENDING_L: { label: "Chờ duyệt", color: "warning" },
      CANCELED_L: { label: "Đã hủy", color: "default" },
    };
    const m = map[key] || map[`${key}_L`] || { label: s || "Trạng thái", color: "default" };
    return <Chip size="small" color={m.color} label={m.label} />;
  };

  const filteredTickets = useMemo(() => {
    let arr = [...tickets];
    if (filter === "upcoming") arr = arr.filter((t) => isUpcoming(t.eventDate));
    if (filter === "past") arr = arr.filter((t) => !isUpcoming(t.eventDate));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      arr = arr.filter(
        (t) =>
          t.eventTitle?.toLowerCase().includes(q) ||
          t.department?.toLowerCase().includes(q) ||
          t.venue?.toLowerCase().includes(q)
      );
    }
    arr.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    return arr;
  }, [tickets, filter, search]);

  const filteredRegs = useMemo(() => {
    let arr = [...regs];
    if (filter === "upcoming") arr = arr.filter((t) => isUpcoming(t.eventDate));
    if (filter === "past") arr = arr.filter((t) => !isUpcoming(t.eventDate));
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      arr = arr.filter(
        (t) =>
          t.eventTitle?.toLowerCase().includes(q) ||
          t.department?.toLowerCase().includes(q) ||
          t.venue?.toLowerCase().includes(q)
      );
    }
    // Nếu không có eventDate (BE chưa có), fallback sort theo registeredOn
    arr.sort((a, b) => {
      const da = a.eventDate ? new Date(a.eventDate) : new Date(a.registeredOn || 0);
      const db = b.eventDate ? new Date(b.eventDate) : new Date(b.registeredOn || 0);
      return da - db;
    });
    return arr;
  }, [regs, filter, search]);

  const openFullQR = (item) =>
    setQrDialog({
      open: true,
      img: item.qrImageUrl || "",
      title: item.eventTitle || "QR Code",
    });

  const downloadQR = (item) => {
    if (item.qrImageUrl) {
      const a = document.createElement("a");
      a.href = item.qrImageUrl;
      a.download = `${item.eventTitle || "event"}-qr.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else if (item.qrData) {
      setSnack({
        open: true,
        sev: "info",
        msg: "BE chưa trả ảnh QR. Hãy trả sẵn qrImageUrl hoặc base64 để tải.",
      });
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          background:
            "linear-gradient(135deg, rgba(25,118,210,.1), rgba(56,142,60,.1))",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
            <SchoolIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Tài khoản của tôi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vé sự kiện &amp; QR đã đăng ký – phục vụ check-in tại khu vực sự kiện.
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          {accessToken && (
            <IconButton
              onClick={() => {
                fetchTickets();
                fetchRegistrations();
              }}
              title="Làm mới"
            >
              <RefreshIcon />
            </IconButton>
          )}
        </Stack>
      </Paper>

      {!accessToken ? (
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
          <QrCode2Icon fontSize="large" />
          <Typography variant="h6" mt={1}>
            Bạn chưa đăng nhập
          </Typography>
          <Typography color="text.secondary" mb={2}>
            Vui lòng đăng nhập để xem danh sách QR và đăng ký sự kiện.
          </Typography>
          <Button
            variant="contained"
            onClick={() => window.dispatchEvent(new Event("OPEN_LOGIN_MODAL"))}
          >
            Mở cửa sổ đăng nhập
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* Thông tin user */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Stack spacing={2} alignItems="center">
                <Avatar
                  sx={{ width: 84, height: 84, bgcolor: "secondary.main" }}
                >
                  {(
                    user?.fullName?.[0] ||
                    user?.name?.[0] ||
                    user?.email?.[0] ||
                    "U"
                  ).toUpperCase()}
                </Avatar>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h6" fontWeight={700}>
                    {user?.fullName || user?.name || "Sinh viên"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email || "email@student.univ.edu"}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip size="small" label="Student Portal" />
                  <Chip size="small" label="EventSphere" color="primary" />
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* Vé & QR */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2.5, borderRadius: 3, mb: 3 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", sm: "center" }}
                mb={2}
              >
                <TextField
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  size="small"
                  placeholder="Tìm theo tên sự kiện, khoa/phòng, địa điểm…"
                  InputProps={{
                    startAdornment: (
                      <SearchIcon
                        fontSize="small"
                        sx={{ mr: 1, opacity: 0.6 }}
                      />
                    ),
                  }}
                  fullWidth
                />
                <TextField
                  select
                  size="small"
                  label="Lọc"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  sx={{ minWidth: 180 }}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="upcoming">Sắp diễn ra</MenuItem>
                  <MenuItem value="past">Đã diễn ra</MenuItem>
                </TextField>
              </Stack>

              <Stack spacing={2}>
                {loading &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <Paper
                      key={`t-skel-${i}`}
                      variant="outlined"
                      sx={{ p: 2, borderRadius: 2 }}
                    >
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="rounded" height={100} />
                    </Paper>
                  ))}

                {!loading && filteredTickets.length === 0 && (
                  <Box
                    sx={{ p: 3, textAlign: "center", color: "text.secondary" }}
                  >
                    <QrCode2Icon />
                    <Typography mt={1}>
                      Chưa có vé/QR nào phù hợp bộ lọc.
                    </Typography>
                  </Box>
                )}

                {!loading &&
                  filteredTickets.map((item) => (
                    <Paper
                      key={`t-${item.id}`}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "140px 1fr auto",
                        },
                        gap: 16,
                        alignItems: "center",
                      }}
                    >
                      {/* QR */}
                      <Box
                        sx={{
                          aspectRatio: "1 / 1",
                          width: { xs: "100%", sm: 120 },
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          display: "grid",
                          placeItems: "center",
                          overflow: "hidden",
                          bgcolor: "#fafafa",
                        }}
                      >
                        {item.qrImageUrl ? (
                          <img
                            src={item.qrImageUrl}
                            alt="QR"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Stack alignItems="center" spacing={1} sx={{ p: 1 }}>
                            <QrCode2Icon />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              textAlign="center"
                            >
                              BE chưa trả ảnh QR
                            </Typography>
                          </Stack>
                        )}
                      </Box>

                      {/* Info */}
                      <Box>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          mb={0.5}
                        >
                          <Typography variant="h6" fontWeight={700}>
                            {item.eventTitle}
                          </Typography>
                          {statusChip(item.status)}
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={2}
                          flexWrap="wrap"
                          useFlexGap
                        >
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <CalendarMonthRoundedIcon fontSize="small" />
                            <Typography variant="body2">
                              {fmt(item.eventDate)}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                          >
                            <PlaceRoundedIcon fontSize="small" />
                            <Typography variant="body2">
                              {item.venue || "Cập nhật sau"}
                            </Typography>
                          </Stack>
                          {!!item.department && (
                            <Chip
                              size="small"
                              variant="outlined"
                              label={item.department}
                            />
                          )}
                        </Stack>
                      </Box>

                      {/* Actions */}
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <IconButton
                          onClick={() => openFullQR(item)}
                          title="Xem lớn"
                        >
                          <OpenInFullIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => downloadQR(item)}
                          title="Tải về"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
              </Stack>
            </Paper>

            {/* ======== SỰ KIỆN ĐÃ ĐĂNG KÝ ======== */}
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <InfoOutlinedIcon />
                <Typography variant="h6" fontWeight={700}>
                  Sự kiện đã đăng ký
                </Typography>
              </Stack>

              <Stack spacing={2}>
                {regsLoading &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <Paper
                      key={`r-skel-${i}`}
                      variant="outlined"
                      sx={{ p: 2, borderRadius: 2 }}
                    >
                      <Skeleton variant="text" width="45%" />
                      <Skeleton variant="text" width="70%" />
                    </Paper>
                  ))}

                {!regsLoading && filteredRegs.length === 0 && (
                  <Box
                    sx={{ p: 3, textAlign: "center", color: "text.secondary" }}
                  >
                    <Typography>Chưa có sự kiện nào bạn đã đăng ký.</Typography>
                    <Typography variant="body2">
                      Khi đăng ký thành công, mục này sẽ hiển thị dạng:
                      <code style={{ marginLeft: 6 }}>
                        {"{ registrationId, eventId, studentId, status, registeredOn }"}
                      </code>
                    </Typography>
                  </Box>
                )}

                {!regsLoading &&
                  filteredRegs.map((item) => (
                    <Paper
                      key={`r-${item.registrationId}`}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="h6" fontWeight={700}>
                            {item.eventTitle}
                          </Typography>
                          {statusChip(item.status)}
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={2}
                          flexWrap="wrap"
                          useFlexGap
                          mt={0.5}
                        >
                          {item.eventDate && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <CalendarMonthRoundedIcon fontSize="small" />
                              <Typography variant="body2">
                                {fmt(item.eventDate)}
                              </Typography>
                            </Stack>
                          )}

                          {item.venue && (
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <PlaceRoundedIcon fontSize="small" />
                              <Typography variant="body2">
                                {item.venue}
                              </Typography>
                            </Stack>
                          )}

                          <Chip
                            size="small"
                            variant="outlined"
                            label={`Mã đăng ký: ${item.registrationId}`}
                          />
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`Đăng ký lúc: ${fmt(item.registeredOn)}`}
                          />
                        </Stack>
                      </Box>

                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {item.link ? (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => (window.location.href = item.link)}
                          >
                            Xem chi tiết
                          </Button>
                        ) : (
                          <Button size="small" variant="outlined" disabled>
                            Xem chi tiết
                          </Button>
                        )}
                      </Stack>
                    </Paper>
                  ))}
              </Stack>

              {regsErr && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="error">{regsErr}</Alert>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Dialog QR lớn */}
      <Dialog
        open={qrDialog.open}
        onClose={() => setQrDialog({ open: false, img: "", title: "" })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{qrDialog.title}</DialogTitle>
        <DialogContent dividers>
          {qrDialog.img ? (
            <Box sx={{ display: "grid", placeItems: "center" }}>
              <img
                src={qrDialog.img}
                alt="QR Large"
                style={{
                  width: "100%",
                  maxWidth: 360,
                  aspectRatio: "1/1",
                  objectFit: "contain",
                }}
              />
            </Box>
          ) : (
            <Alert severity="info">
              Chưa có <code>qrImageUrl</code>. Hãy cập nhật BE để trả ảnh QR.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setQrDialog({ open: false, img: "", title: "" })}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={2800}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.sev}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>

      {err && (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error">{err}</Alert>
        </Box>
      )}
    </Container>
  );
}
