import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const STORAGE_KEY = "authState_v1"; // ✅ key chuẩn

// ---- Helpers: đọc token/roles từ localStorage ----
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
function getAuthFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, roles: [] };
    const saved = JSON.parse(raw);
    const token = saved?.token || null;

    // roles ưu tiên từ saved.user.roles; fallback decode từ token
    let rolesStr = saved?.user?.roles || "";
    if (!rolesStr && token) {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(b64urlDecode(parts[1] || "") || "{}");
        rolesStr = payload?.roles || "";
      }
    }
    const roles = (rolesStr || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    return { token, roles };
  } catch {
    return { token: null, roles: [] };
  }
}

// ✅ Gom state mặc định để reset form nhanh
const INITIAL_EVENT = {
  eventId: null, // tùy chọn
  title: "",
  description: "",
  mainImageUrl: "",  // ✅ khớp BE
  category: "",
  date: "",          // yyyy-mm-dd (sự kiện 1 ngày)
  startDate: "",     // yyyy-mm-dd (nhiều ngày)
  endDate: "",       // yyyy-mm-dd (nhiều ngày)
  time: "",          // hh:mm
  venue: "",
};

function AddEvent() {
  const navigate = useNavigate();

  // Auth (memo để không decode JWT mỗi lần render)
  const { token, roles } = useMemo(getAuthFromStorage, []);
  const isAdmin = roles.includes("ROLE_ADMIN");
  const isOrganizer = roles.includes("ROLE_ORGANIZER");
  const canCreate = isAdmin || isOrganizer;

  // State
  const [event, setEvent] = useState(INITIAL_EVENT);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // Danh mục gợi ý
  const categories = [
    "Technical",
    "Cultural",
    "Sports",
    "Workshop",
    "Seminar",
    "Competition",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  // Validate
  const isDateOrderValid = () => {
    if (event.startDate && event.endDate) {
      return new Date(event.endDate) >= new Date(event.startDate);
    }
    return true;
  };
  const isValid = () => {
    const hasAnyDate = Boolean(event.date || event.startDate);
    return (
      event.title &&
      event.category &&
      hasAnyDate &&
      event.time &&
      event.venue &&
      isDateOrderValid()
    );
  };

  const handleOpenConfirmDialog = (e) => {
    e.preventDefault();

    if (!token) {
      setError("Bạn chưa đăng nhập hoặc không tìm thấy token!");
      return;
    }
    if (!canCreate) {
      setError("Bạn cần quyền Admin hoặc Organizer để tạo sự kiện.");
      return;
    }
    if (!isValid()) {
      const baseMsg =
        "Vui lòng điền đủ: Tiêu đề, Thể loại, Thời gian, Địa điểm, và ít nhất một trong Ngày hoặc Ngày bắt đầu.";
      const orderMsg = !isDateOrderValid()
        ? " Ngày kết thúc phải lớn hơn hoặc bằng Ngày bắt đầu."
        : "";
      setError(baseMsg + orderMsg);
      return;
    }
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

  const handleSubmit = async () => {
    const normalizedTime = event.time; // nếu BE cần "HH:mm:ss" -> `${event.time}:00`

    const payload = {
      title: event.title?.trim(),
      description: event.description?.trim() || null,
      mainImageUrl: event.mainImageUrl?.trim() || null, // ✅ gửi đúng tên field
      category: event.category || null,
      venue: event.venue || null,
      time: normalizedTime || null,
      date: event.date || null,
      startDate: event.startDate || null,
      endDate: event.endDate || null,
    };

    // yêu cầu phải có date hoặc startDate
    if (!payload.date && !payload.startDate) {
      setError("Vui lòng chọn Ngày (1 ngày) hoặc Ngày bắt đầu (nhiều ngày).");
      return;
    }

    if (!token) {
      setError("Bạn chưa đăng nhập hoặc không tìm thấy token!");
      setOpenConfirmDialog(false);
      return;
    }
    if (!canCreate) {
      setError("Bạn cần quyền Admin hoặc Organizer để tạo sự kiện.");
      setOpenConfirmDialog(false);
      return;
    }

    // 🔀 Chọn endpoint theo role:
    // - ADMIN: POST /api/events
    // - ORGANIZER (không phải admin): POST /api/organizer/events
    const url = isAdmin
      ? "http://localhost:6868/api/events"
      : "http://localhost:6868/api/organizer/events";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ quan trọng
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        if (res.status === 401)
          throw new Error("401 - Chưa xác thực (thiếu/invalid token).");
        if (res.status === 403)
          throw new Error(
            "403 - Không đủ quyền. Cần Admin hoặc Organizer (đúng endpoint)."
          );
        throw new Error(txt || `Request failed (${res.status})`);
      }

      // ✅ Thành công
      setOpenConfirmDialog(false);
      setEvent(INITIAL_EVENT); // reset
      setError("");
      setSuccess("Thêm sự kiện thành công!");
      // navigate("/admin/event"); // nếu muốn điều hướng
    } catch (err) {
      console.error("Error:", err);
      setError(err?.message || "Lỗi khi thêm sự kiện");
      setOpenConfirmDialog(false);
    }
  };

  // Style chung cho TextField
  const tfSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "background.paper",
      "&:hover fieldset": { borderColor: "primary.main" },
      "&.Mui-focused fieldset": {
        borderColor: "primary.main",
        boxShadow: "0 0 8px rgba(25, 118, 210, 0.3)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "text.secondary",
      fontWeight: "medium",
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "primary.main" },
  };

  return (
    <Box sx={{ mt: 2, px: { xs: 2, sm: 4 }, maxWidth: "1200px", mx: "auto" }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1a2820", letterSpacing: "0.5px" }}
      >
        THÊM SỰ KIỆN MỚI
      </Typography>

      {!canCreate && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Bạn đang đăng nhập với quyền không đủ (cần Admin hoặc Organizer) —
          bạn vẫn có thể điền form, nhưng sẽ không thể gửi.
        </Alert>
      )}

      <Paper
        sx={{
          p: 4,
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Box component="form" onSubmit={handleOpenConfirmDialog}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: "8px",
                bgcolor: "error.light",
                color: "error.main",
                "& .MuiAlert-icon": { color: "error.main" },
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 2,
                borderRadius: "8px",
              }}
            >
              {success}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Cột trái */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mã sự kiện (tùy chọn)"
                name="eventId"
                type="number"
                value={event.eventId ?? ""}
                onChange={handleChange}
                margin="normal"
                sx={tfSx}
              />

              <TextField
                fullWidth
                label="Tiêu đề"
                name="title"
                value={event.title}
                onChange={handleChange}
                margin="normal"
                required
                sx={tfSx}
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel
                  sx={{
                    color: "text.secondary",
                    fontWeight: "medium",
                    "&.Mui-focused": { color: "primary.main" },
                  }}
                >
                  Thể loại
                </InputLabel>
                <Select
                  name="category"
                  value={event.category}
                  onChange={handleChange}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "background.paper",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                      boxShadow: "0 0 8px rgba(25,118,210,0.3)",
                    },
                  }}
                >
                  {categories.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Ảnh chính (URL) */}
              <TextField
                fullWidth
                label="Ảnh chính (URL)"
                name="mainImageUrl"
                value={event.mainImageUrl}
                onChange={handleChange}
                margin="normal"
                sx={tfSx}
                placeholder="https://..."
              />
            </Grid>

            {/* Cột phải */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                value={event.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={5}
                sx={tfSx}
              />

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ngày (1 ngày)"
                    name="date"
                    type="date"
                    value={event.date}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    sx={tfSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Thời gian"
                    name="time"
                    type="time"
                    value={event.time}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={tfSx}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ngày bắt đầu (nhiều ngày)"
                    name="startDate"
                    type="date"
                    value={event.startDate}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    sx={tfSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ngày kết thúc (nhiều ngày)"
                    name="endDate"
                    type="date"
                    value={event.endDate}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    sx={tfSx}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Địa điểm"
                name="venue"
                value={event.venue}
                onChange={handleChange}
                margin="normal"
                required
                sx={tfSx}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!canCreate} // ⛔ nếu không có quyền thì disable
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "medium",
                px: 4,
                py: 1,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                  bgcolor: "primary.dark",
                },
              }}
            >
              Thêm
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate("/admin/event")}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "medium",
                px: 4,
                py: 1,
                borderColor: "grey.400",
                color: "text.primary",
                "&:hover": { bgcolor: "grey.100", borderColor: "grey.500" },
              }}
            >
              Hủy
            </Button>
          </Box>
        </Box>

        {/* Modal xác nhận */}
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              borderBottom: "1px solid",
              borderColor: "grey.200",
              py: 2,
            }}
          >
            Xác nhận thêm sự kiện
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <DialogContentText sx={{ color: "text.secondary", fontWeight: "medium" }}>
              Bạn có chắc muốn thêm sự kiện này?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button
              onClick={handleCloseConfirmDialog}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                color: "text.primary",
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "medium",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  bgcolor: "primary.dark",
                },
              }}
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

export default AddEvent;
