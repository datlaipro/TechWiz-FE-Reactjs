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
import { useNavigate } from "react-router-dom";

const STORAGE_KEY_NEW = "authState_v1";
const STORAGE_KEY_OLD = "STORAGE_KEY";
const STORAGE_KEY_JWT = "jwtToken";
const REG_KEY = "registeredEvents_v1";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:6868";
const buildHeaders = (tk) => ({
  Accept: "application/json",
  "Content-Type": "application/json; charset=UTF-8",
  ...(tk ? { Authorization: `Bearer ${tk}` } : {}),
});
const { token, role, userId } = readAuth();

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
  // Đọc từ localStorage theo thứ tự ưu tiên
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
  const navigate = useNavigate();
  const [{ isLoggedIn, user, accessToken }, setAuth] = useState(
    readAuthFromStorage()
  );
  // URL ảnh QR được tạo từ blob
 

  // ===== QR tickets =====

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

  const { eventId, studentId } = readEventStudentSafe(); // lấy ra eventId, studentId
  if (eventId && studentId) {
    localStorage.setItem(REG_KEY, `${eventId}|${studentId}`);
  }

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

  // ====== Registrations ======
  // Cache QR theo eventId để tránh gọi lại nhiều lần
  const qrCache = useRef(new Map());

  async function fetchQrFor(eventId, studentId) {
    if (!accessToken || !eventId || !studentId) return null;
    if (qrCache.current.has(eventId)) return qrCache.current.get(eventId);
    try {
      const res = await fetch(`${API_BASE}/api/qr/issue`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "image/png",
        },
        body: JSON.stringify({ eventId, studentId, size: 240 }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      qrCache.current.set(eventId, url);

      // gắn vào mảng regs để render ngay
      setRegs((prev) =>
        prev.map((it) =>
          it.eventId === eventId ? { ...it, qrImageUrl: url } : it
        )
      );
      return url;
    } catch (_) {
      return null;
    }
  }

  const fetchRegistrations = async () => {
    if (!accessToken) {
      setRegs([]);
      setRegsLoading(false);
      return;
    }
    setRegsLoading(true);
    setRegsErr("");

    try {
      const uid = user?.id || userId; // nếu readAuth() của bạn trả giá trị này

      // gọi API mới: Page<RegistrationEventItem>
      const geturl = `${API_BASE}/api/registrations/users/${uid}/events?when=ALL&page=0&size=50`;
      const r = await axios.get(geturl, { headers: buildHeaders(accessToken) });

      // BE có thể trả Page hoặc mảng
      const list = Array.isArray(r.data)
        ? r.data
        : Array.isArray(r?.data?.content)
        ? r.data.content
        : [];

      // Map sang cấu trúc UI đang dùng (eventTitle, eventDate, venue, department…)
      const mapped = list.map((it) => ({
        // giữ field cũ để UI không phải đổi nhiều
        id: it.eventId,
        registrationId: undefined, // API mới không trả — bỏ hiển thị chip này
        eventId: it.eventId,
        studentId: uid,
        status: undefined, // API mới không trả — không hiển thị status
        registeredOn: undefined, // API mới không trả

        eventTitle: it.title,
        eventDate: it.startDate || it.date || null,
        venue: it.venue || "",
        department: it.category || "",
        link: `/eventdetail/${it.eventId}`, // tuỳ router của bạn
        mainImageUrl: it.mainImageUrl || null,
        totalSeats: it.totalSeats ?? null,
      }));

      setRegs(mapped);
    } catch (e) {
      setRegsErr(
        e?.response?.data?.message ||
          e?.message ||
          "Lỗi tải sự kiện đã đăng ký."
      );
      setRegs([]);
    } finally {
      setRegsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken && !isTokenExpired(accessToken)) {
      fetchRegistrations();
    } else {
      setRegsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, studentId]);




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
      const da = a.eventDate
        ? new Date(a.eventDate)
        : new Date(a.registeredOn || 0);
      const db = b.eventDate
        ? new Date(b.eventDate)
        : new Date(b.registeredOn || 0);
      return da - db;
    });
    return arr;
  }, [regs, filter, search]);





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
              My Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vé sự kiện &amp; QR đã đăng ký – phục vụ check-in tại khu vực sự
              kiện.
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          {accessToken && (
            <IconButton
              onClick={() => {
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
         

            {/* ======== SỰ KIỆN ĐÃ ĐĂNG KÝ ======== */}
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <InfoOutlinedIcon />
                <Typography variant="h6" fontWeight={700}>
                  Sự kiện đã đăng ký
                </Typography>
              </Stack>

              {/* Bộ lọc dời xuống đây để giữ nguyên trải nghiệm */}
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
                      Sau khi đăng ký thành công, mục này sẽ hiển thị danh sách
                      sự kiện từ hệ thống.
                    </Typography>
                  </Box>
                )}

                {!regsLoading &&
                  filteredRegs.map((item) => (
                    <Paper
                      key={`r-${item.id || item.eventId}`}
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 180px" }, // cột phải chứa QR + nút
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      {/* LEFT: Info */}
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="h6" fontWeight={700}>
                            {item.eventTitle}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          spacing={2}
                          flexWrap="wrap"
                          useFlexGap
                          mt={0.5}
                        >
                          {item.eventDate && (
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
                          )}

                          {item.venue && (
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              <PlaceRoundedIcon fontSize="small" />
                              <Typography variant="body2">
                                {item.venue}
                              </Typography>
                            </Stack>
                          )}

                          <Chip
                            size="small"
                            variant="outlined"
                            label={`Mã sự kiện: ${item.eventId}`}
                          />
                          {item.totalSeats != null && (
                            <Chip
                              size="small"
                              variant="outlined"
                              label={`Số ghế: ${item.totalSeats}`}
                            />
                          )}
                        </Stack>
                      </Box>

                      {/* RIGHT: QR + Actions */}
                      <Stack
                        spacing={1}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Box
                          sx={{
                            width: 140,
                            aspectRatio: "1 / 1",
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
                              onClick={() =>
                                setQrDialog({
                                  open: true,
                                  img: item.qrImageUrl,
                                  title: item.eventTitle || "QR Code",
                                })
                              }
                            />
                          ) : (
                            <Button
                              size="small"
                              onClick={() =>
                                fetchQrFor(item.eventId, item.studentId)
                              }
                            >
                              Hiển thị QR
                            </Button>
                          )}
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              navigate(item.link || `/events/${item.eventId}`)
                            }
                          >
                            Xem chi tiết
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (item.qrImageUrl) {
                                const a = document.createElement("a");
                                a.href = item.qrImageUrl;
                                a.download = `${
                                  item.eventTitle || "event"
                                }-qr.png`;
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                              }
                            }}
                            title="Tải QR"
                            disabled={!item.qrImageUrl}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Stack>
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


    </Container>
  );
}
