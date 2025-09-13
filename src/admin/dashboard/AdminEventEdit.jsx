import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  FormControlLabel,
  Checkbox,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import readAuth from "../auth/getToken";

function AdminEventEdit() {
  const navigate = useNavigate();
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sự kiện này?")) {
      fetch(`http://localhost:6868/api/organizer/events/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      alert("Sự kiện đã được xóa.");
      navigate("/admin");
      // Khi dùng mock: chỉ xóa trên state
      //   setEvents((prev) => prev.filter((ev) => (ev.id ?? ev.event_id) !== id));
    }
  };
  const { id } = useParams();

  // ===== Event state =====
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // ===== Options =====
  const categories = [
    "technical",
    "workshop",
    "competition",
    "cultural",
    "orientation",
    "sports",
  ];
  const approvalStatuses = [
    "APPROVED",
    "PENDING_APPROVAL",
    "REJECTED",
    "DRAFT",
  ];

  // ===== Helpers =====
  const toDateInput = (v) => {
    if (!v) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  };

  const toTimeInput = (v) => {
    if (!v) return "";
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(v)) return v.slice(0, 5);
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const toDateTimeLocalInput = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day}T${hh}:${mm}`;
  };

  // ===== Auth =====
  const { token, role, userId } = readAuth();
  const authHeaders = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const API = "http://localhost:6868";

  // ===== Fetch event =====
  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/admin/pending/${id}`, { headers: authHeaders })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const mapped = {
          eventId: data.eventId ?? data.id ?? "",
          title: data.title ?? "",
          description: data.description ?? "",
          category: data.category ?? "",
          date: data.date ?? data.eventDate ?? "",
          time: data.time ?? data.eventTime ?? "",
          startDate: data.startDate ?? data.start_date ?? "",
          endDate: data.endDate ?? data.end_date ?? "",
          venue: data.venue ?? "",

          organizerId: userId ?? data.organizerId ?? data.organizer_id ?? "",
          approvalStatus:
            data.approvalStatus ??
            data.approval_status ??
            data.status ??
            "PENDING_APPROVAL",
          approvedBy: data.approvedBy ?? data.approved_by ?? "",
          approvedAt: data.approvedAt ?? data.approved_at ?? "",
          totalSeats: data.totalSeats ?? data.total_seats ?? "",
          mainImageUrl: data.mainImageUrl ?? data.main_image_url ?? "",
          publish: data.publish ?? true,
        };
        setEvent(mapped);
        setLoading(false);
      })
      .catch((e) => {
        setError(`Không tải được dữ liệu: ${e.message}`);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ===== Handle change =====
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  // ===== Validate =====
  const isValid = () => {
    if (!event) return false;
    if (!event.title || !event.category || !event.venue) return false;
    const hasSingleDay = !!event.date;
    const hasRange = !!event.startDate && !!event.endDate;
    if (!hasSingleDay && !hasRange) return false;

    const seats = parseInt(event.totalSeats, 10);
    if (Number.isNaN(seats) || seats < 0) return false;

    return true;
  };

  // ===== Confirm dialog open/close =====
  const handleOpenConfirmDialog = (e) => {
    e.preventDefault();

    if (!userId) {
      setError(
        "Phiên đăng nhập hết hạn hoặc token không có userId. Vui lòng đăng nhập lại."
      );
      return;
    }
    if (!isValid()) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc của sự kiện");
      return;
    }
    setOpenConfirmDialog(true);
  };
  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

  // ===== SAVE (PUT /organizer/events/{id}) =====
  const handleSubmit = async () => {
    if (!event) return;
    const normalizedDate =
      event.date || event.startDate || event.endDate || null;
    const normalizedTime = event.time
      ? /^\d{2}:\d{2}$/.test(event.time)
        ? `${event.time}:00`
        : event.time
      : "00:00:00";

    const payload = {
      eventId: event.eventId,
      title: event.title,
      description: event.description,
      category: event.category,
      date: normalizedDate,
      time: normalizedTime,
      startDate: event.startDate || null,
      endDate: event.endDate || null,
      venue: event.venue,

      organizerId: userId, // lấy từ JWT
      // QUAN TRỌNG: dùng approvalStatus thay vì status để đúng kiểu dữ liệu
      approvalStatus: event.approvalStatus,
      approvedBy: event.approvedBy ? parseInt(event.approvedBy, 10) : null,
      approvedAt: event.approvedAt
        ? new Date(event.approvedAt).toISOString()
        : null,
      totalSeats: event.totalSeats ? parseInt(event.totalSeats, 10) : 0,
      mainImageUrl: event.mainImageUrl || "",
      publish: !!event.publish,
    };

    try {
      const res = await fetch(`${API}/api/organizer/events/${id}`, {
        method: "PUT",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const text = await res.text();
          msg += text ? ` – ${text}` : "";
        } catch {}
        setError(`Cập nhật thất bại: ${msg}`);
        return;
      }
      setOpenConfirmDialog(false);
      navigate("/admin/product");
    } catch (err) {
      console.error("Error:", err);
      setError("Lỗi khi cập nhật sự kiện");
      setOpenConfirmDialog(false);
    }
  };

  // ===== APPROVE / REJECT (POST /admin/events/{id}/approve|reject) =====
  const postModeration = async (action) => {
    try {
      const res = await fetch(`${API}/api/admin/events/${id}/${action}`, {
        method: "POST",
        headers: authHeaders,
      });
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const t = await res.text();
          msg += t ? ` – ${t}` : "";
        } catch {}
        setError(
          `${action === "approve" ? "Duyệt" : "Từ chối"} thất bại: ${msg}`
        );
        return;
      }
      setEvent((prev) => ({
        ...prev,
        approvalStatus: action === "approve" ? "APPROVED" : "REJECTED",
        approvedBy:
          action === "approve" ? userId ?? prev.approvedBy : prev.approvedBy,
        approvedAt:
          action === "approve" ? new Date().toISOString() : prev.approvedAt,
      }));
    } catch (e) {
      setError(
        `${action === "approve" ? "Duyệt" : "Từ chối"} thất bại: ${e.message}`
      );
    }
  };
  const handleApprove = () => postModeration("approve");
  const handleReject = () => postModeration("reject");

  // ===== UI =====
  if (loading) {
    return (
      <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h6" color="text.secondary">
          Đang tải...
        </Typography>
      </Box>
    );
  }
  if (error && !event) {
    return (
      <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h6" color="error.main">
          {error}
        </Typography>
      </Box>
    );
  }

  const statusChip = (() => {
    const s = String(event?.approvalStatus || "").toUpperCase();
    if (s === "APPROVED")
      return (
        <Chip
          icon={<VerifiedRoundedIcon />}
          label="Đã duyệt"
          color="success"
          size="small"
        />
      );
    if (s === "PENDING_APPROVAL")
      return (
        <Chip
          icon={<VerifiedRoundedIcon />}
          label="Chờ duyệt"
          color="warning"
          size="small"
        />
      );
    if (s === "REJECTED")
      return (
        <Chip
          icon={<VerifiedRoundedIcon />}
          label="Từ chối"
          color="error"
          size="small"
        />
      );
    if (s === "DRAFT")
      return (
        <Chip
          icon={<VerifiedRoundedIcon />}
          label="Nháp"
          color="default"
          size="small"
        />
      );
    return (
      <Chip icon={<VerifiedRoundedIcon />} label={s || "—"} size="small" />
    );
  })();

  return (
    <Box sx={{ mt: 2, px: { xs: 2, sm: 4 }, maxWidth: 1200, mx: "auto" }}>
      {/* Header theo phong cách trang sự kiện */}
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          mb: 3,
          background:
            "linear-gradient(135deg, rgba(33,150,243,0.08), rgba(156,39,176,0.08))",
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <Chip label="Chỉnh sửa sự kiện" size="small" />
          <Chip
            label={event?.category?.toUpperCase() || "—"}
            icon={<CategoryIcon />}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
          {statusChip}
          <Chip
            label={`Mã #${event?.eventId || id}`}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
          {event?.title || "—"}
        </Typography>
        <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mt: 1 }}>
          <Chip
            icon={<CalendarMonthRoundedIcon />}
            label={`Ngày: ${toDateInput(event?.date) || "—"}`}
            variant="outlined"
          />
          <Chip
            icon={<AccessTimeRoundedIcon />}
            label={`Giờ: ${toTimeInput(event?.time) || "—"}`}
            variant="outlined"
          />
          <Chip
            icon={<PlaceRoundedIcon />}
            label={event?.venue || "—"}
            variant="outlined"
          />
          <Chip
            icon={<PeopleAltRoundedIcon />}
            label={`Sức chứa: ${event?.totalSeats ?? "—"}`}
            variant="outlined"
          />
        </Stack>
      </Paper>

      <Paper
        sx={{
          p: 4,
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Box component="form" onSubmit={handleOpenConfirmDialog}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: "8px",
                bgcolor: "error.light",
                color: "error.main",
                "& .MuiAlert-icon": { color: "error.main" },
              }}
            >
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Cột trái */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tiêu đề sự kiện"
                name="title"
                value={event.title}
                onChange={handleChange}
                margin="normal"
                required
                sx={fieldSx}
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel sx={labelSx}>Danh mục</InputLabel>
                <Select
                  name="category"
                  value={event.category}
                  onChange={handleChange}
                  sx={selectSx}
                  label="Danh mục"
                >
                  {categories.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="date"
                label="Ngày (sự kiện 1 ngày)"
                name="date"
                value={toDateInput(event.date)}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Bắt đầu (nhiều ngày)"
                    name="startDate"
                    value={toDateInput(event.startDate)}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Kết thúc (nhiều ngày)"
                    name="endDate"
                    value={toDateInput(event.endDate)}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                type="time"
                label="Giờ"
                name="time"
                value={toTimeInput(event.time)}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{ shrink: true }}
                sx={fieldSx}
              />

              <TextField
                fullWidth
                type="number"
                label="Organizer ID"
                value={userId ?? ""}
                margin="normal"
                sx={fieldSx}
                InputProps={{ readOnly: true }}
                helperText="Tự động lấy từ token — không thể chỉnh tay"
              />

              <TextField
                fullWidth
                label="Địa điểm"
                name="venue"
                value={event.venue}
                onChange={handleChange}
                margin="normal"
                required
                sx={fieldSx}
              />

              <TextField
                fullWidth
                type="number"
                label="Tổng chỗ ngồi"
                name="totalSeats"
                value={event.totalSeats}
                onChange={handleChange}
                margin="normal"
                required
                sx={fieldSx}
              />
            </Grid>

            {/* Cột phải */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mô tả ngắn"
                name="description"
                value={event.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
                required
                sx={fieldSx}
              />

              <TextField
                fullWidth
                label="Ảnh chính (URL)"
                name="mainImageUrl"
                value={event.mainImageUrl}
                onChange={handleChange}
                margin="normal"
                sx={fieldSx}
                helperText="Dán URL ảnh (PNG/JPG). Nhấn vào ảnh preview để mở lớn."
              />

              {/* Preview ảnh */}
              <Box
                sx={{
                  mt: 1.5,
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "grey.200",
                  bgcolor: "grey.50",
                  display: "grid",
                  placeItems: "center",
                  minHeight: 160,
                  cursor: event.mainImageUrl ? "pointer" : "default",
                }}
                onClick={() => {
                  if (event.mainImageUrl) {
                    window.open(
                      event.mainImageUrl,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }
                }}
              >
                {event.mainImageUrl ? (
                  <img
                    src={event.mainImageUrl}
                    alt="main"
                    style={{
                      width: "100%",
                      maxHeight: 260,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography color="text.secondary">Chưa có ảnh</Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <FormControl fullWidth margin="normal" required>
                <InputLabel sx={labelSx}>Trạng thái duyệt</InputLabel>
                <Select
                  name="approvalStatus"
                  value={event.approvalStatus}
                  onChange={handleChange}
                  sx={selectSx}
                  label="Trạng thái duyệt"
                >
                  {approvalStatuses.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Approved At"
                    name="approvedAt"
                    value={toDateTimeLocalInput(event.approvedAt)}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>

              <FormControlLabel
                control={
                  <Checkbox
                    name="publish"
                    checked={!!event.publish}
                    onChange={handleChange}
                    sx={{
                      color: "primary.main",
                      "&.Mui-checked": { color: "primary.main" },
                    }}
                  />
                }
                label="Hiển thị trên trang sự kiện"
                sx={{ mt: 1, color: "text.secondary", fontWeight: "medium" }}
              />
            </Grid>
          </Grid>

          {/* Nút hành động */}
          <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={buttonPrimarySx}
            >
              Lưu
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/admin/product")}
              sx={buttonOutlineSx}
            >
              Hủy
            </Button>

            {/* Duyệt / Từ chối ngay trong trang Sửa */}
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleRoundedIcon />}
              onClick={handleApprove}
              disabled={
                String(event.approvalStatus).toUpperCase() === "APPROVED"
              }
            >
              Duyệt
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelRoundedIcon />}
              onClick={() => {
                handleDelete(id);
              }}
              disabled={
                String(event.approvalStatus).toUpperCase() === "REJECTED"
              }
            >
              Xóa
            </Button>
          </Box>
        </Box>

        {/* Modal xác nhận LƯU */}
        <Dialog
          open={openConfirmDialog}
          onClose={handleCloseConfirmDialog}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
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
            Xác nhận lưu thay đổi
          </DialogTitle>
          <DialogContent sx={{ py: 3 }}>
            <DialogContentText
              sx={{ color: "text.secondary", fontWeight: "medium" }}
            >
              Bạn có chắc muốn lưu các thay đổi cho sự kiện #
              {event?.eventId || id}?
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
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
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

// ===== Styles =====
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "background.paper",
    "&:hover fieldset": { borderColor: "primary.main" },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
      boxShadow: "0 0 8px rgba(25,118,210,0.3)",
    },
  },
  "& .MuiInputLabel-root": { color: "text.secondary", fontWeight: "medium" },
  "& .MuiInputLabel-root.Mui-focused": { color: "primary.main" },
};

const selectSx = {
  borderRadius: "8px",
  backgroundColor: "background.paper",
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "primary.main",
    boxShadow: "0 0 8px rgba(25,118,210,0.3)",
  },
};

const labelSx = {
  color: "text.secondary",
  fontWeight: "medium",
  "&.Mui-focused": { color: "primary.main" },
};

const buttonPrimarySx = {
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: "medium",
  px: 4,
  py: 1,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
    bgcolor: "primary.dark",
  },
};

const buttonOutlineSx = {
  borderRadius: "8px",
  textTransform: "none",
  fontWeight: "medium",
  px: 4,
  py: 1,
  borderColor: "grey.400",
  color: "text.primary",
  "&:hover": { bgcolor: "grey.100", borderColor: "grey.500" },
};

export default AdminEventEdit;
