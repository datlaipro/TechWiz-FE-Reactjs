import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Container, Grid, Paper, Typography, Chip, Avatar, Stack,
  TextField, MenuItem, IconButton, Button, Dialog, DialogContent,
  DialogTitle, DialogActions, Skeleton, Snackbar, Alert
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

// const STORAGE_KEY = "authState_v1";
const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:6868";

// ---- helpers ----
function readAuthFromStorage() {
  try {
    const token = localStorage.getItem("STORAGE_KEY");
    // if (!raw) return { isLoggedIn: false, user: null, accessToken: null };
    // const saved = JSON.parse(raw);
    // cố gắng bắt nhiều tên trường token thường gặp
    // const token =
    //   saved?.jwtToken ||
    //   saved?.token ||
    //   saved?.jwt ||
    //   saved?.user?.accessToken ||
    //   saved?.user?.token ||
    //   saved?.user?.jwt ||
    //   null;
    return { accessToken: token };
  } catch {
    return { isLoggedIn: false, user: null, accessToken: null };
  }
}
const fmt = (s) => {
  const d = new Date(s);
  return Number.isNaN(+d) ? "N/A" : d.toLocaleString("vi-VN");
};
const isUpcoming = (s) => new Date(s).getTime() >= Date.now();

export default function MyAccount() {
  const [{ isLoggedIn, user, accessToken }, setAuth] = useState(readAuthFromStorage());
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("all"); // all | upcoming | past
  const [search, setSearch] = useState("");
  const [qrDialog, setQrDialog] = useState({ open: false, img: "", title: "" });
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });

  // đồng bộ lại auth khi user F5 hoặc tab khác thay đổi localStorage
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "STORAGE_KEY") setAuth(readAuthFromStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const fetchTickets = async () => {
    if (!accessToken) return;
    try {
      setLoading(true);
      setErr("");
      const res = await axios.get(`${API_BASE}/api/qr/my`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setTickets(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Lỗi tải vé/QR.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && accessToken) fetchTickets();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, accessToken]);

  const filtered = useMemo(() => {
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

  const openFullQR = (item) =>
    setQrDialog({ open: true, img: item.qrImageUrl || "", title: item.eventTitle || "QR Code" });

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

  const statusChip = (s) => {
    const map = {
      confirmed: { label: "Đã xác nhận", color: "success" },
      pending: { label: "Chờ duyệt", color: "warning" },
      canceled: { label: "Đã hủy", color: "default" },
    };
    const m = map[s] || { label: s || "Trạng thái", color: "default" };
    return <Chip size="small" color={m.color} label={m.label} />;
  };

  return (
    <Container sx={{ py: 4 }}>
      {/* banner phong cách “cổng sự kiện trường đại học” */}
      <Paper
        elevation={0}
        sx={{
          mb: 3, p: { xs: 2, md: 3 }, borderRadius: 3,
          background: "linear-gradient(135deg, rgba(25,118,210,.1), rgba(56,142,60,.1))",
          border: "1px solid", borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
            <SchoolIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700}>Tài khoản của tôi</Typography>
            <Typography variant="body2" color="text.secondary">
              Vé sự kiện &amp; QR đã đăng ký – phục vụ check-in tại khu vực sự kiện.
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          {isLoggedIn && accessToken && (
            <IconButton onClick={fetchTickets} title="Làm mới">
              <RefreshIcon />
            </IconButton>
          )}
        </Stack>
      </Paper>

      {/* Nếu chưa đăng nhập / chưa có token */}
      { !accessToken ? (
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
          <QrCode2Icon fontSize="large" />
          <Typography variant="h6" mt={1}>Bạn chưa đăng nhập</Typography>
          <Typography color="text.secondary" mb={2}>
            Vui lòng đăng nhập để xem danh sách QR sự kiện đã đăng ký.
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
                <Avatar sx={{ width: 84, height: 84, bgcolor: "secondary.main" }}>
                  {(user?.fullName?.[0] || user?.name?.[0] || "U").toUpperCase()}
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
            <Paper sx={{ p: 2.5, borderRadius: 3 }}>
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
                  InputProps={{ startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, opacity: .6 }} /> }}
                  fullWidth
                />
                <TextField select size="small" label="Lọc" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ minWidth: 180 }}>
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="upcoming">Sắp diễn ra</MenuItem>
                  <MenuItem value="past">Đã diễn ra</MenuItem>
                </TextField>
              </Stack>

              <Stack spacing={2}>
                {loading &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="rounded" height={100} />
                    </Paper>
                  ))}

                {!loading && filtered.length === 0 && (
                  <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
                    <QrCode2Icon />
                    <Typography mt={1}>Chưa có vé/QR nào phù hợp bộ lọc.</Typography>
                  </Box>
                )}

                {!loading &&
                  filtered.map((item) => (
                    <Paper
                      key={item.id}
                      variant="outlined"
                      sx={{
                        p: 2, borderRadius: 2, display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "140px 1fr auto" },
                        gap: 16, alignItems: "center",
                      }}
                    >
                      {/* QR */}
                      <Box
                        sx={{
                          aspectRatio: "1 / 1", width: { xs: "100%", sm: 120 }, borderRadius: 2,
                          border: "1px solid", borderColor: "divider", display: "grid",
                          placeItems: "center", overflow: "hidden", bgcolor: "#fafafa",
                        }}
                      >
                        {item.qrImageUrl ? (
                          <img
                            src={item.qrImageUrl}
                            alt="QR"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <Stack alignItems="center" spacing={1} sx={{ p: 1 }}>
                            <QrCode2Icon />
                            <Typography variant="caption" color="text.secondary" textAlign="center">
                              BE chưa trả ảnh QR
                            </Typography>
                          </Stack>
                        )}
                      </Box>

                      {/* Info */}
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                          <Typography variant="h6" fontWeight={700}>{item.eventTitle}</Typography>
                          {statusChip(item.status)}
                        </Stack>
                        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarMonthRoundedIcon fontSize="small" />
                            <Typography variant="body2">{fmt(item.eventDate)}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <PlaceRoundedIcon fontSize="small" />
                            <Typography variant="body2">{item.venue || "Cập nhật sau"}</Typography>
                          </Stack>
                          {!!item.department && (
                            <Chip size="small" variant="outlined" label={item.department} />
                          )}
                        </Stack>
                      </Box>

                      {/* Actions */}
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton onClick={() => openFullQR(item)} title="Xem lớn">
                          <OpenInFullIcon />
                        </IconButton>
                        <IconButton onClick={() => downloadQR(item)} title="Tải về">
                          <DownloadIcon />
                        </IconButton>
                      </Stack>
                    </Paper>
                  ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Dialog QR lớn */}
      <Dialog
        open={qrDialog.open}
        onClose={() => setQrDialog({ open: false, img: "", title: "" })}
        maxWidth="xs" fullWidth
      >
        <DialogTitle>{qrDialog.title}</DialogTitle>
        <DialogContent dividers>
          {qrDialog.img ? (
            <Box sx={{ display: "grid", placeItems: "center" }}>
              <img
                src={qrDialog.img}
                alt="QR Large"
                style={{ width: "100%", maxWidth: 360, aspectRatio: "1/1", objectFit: "contain" }}
              />
            </Box>
          ) : (
            <Alert severity="info">
              Chưa có <code>qrImageUrl</code>. Hãy cập nhật BE để trả ảnh QR.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialog({ open: false, img: "", title: "" })}>Đóng</Button>
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
