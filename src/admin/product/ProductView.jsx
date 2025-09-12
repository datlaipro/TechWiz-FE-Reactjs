import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Alert,
  Dialog,
  DialogContent,
  Chip,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import CategoryIcon from '@mui/icons-material/Category';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';

// Giới hạn ký tự
const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// ===== Helpers an toàn =====
const fmtNumber = (v, locale = 'vi-VN') => {
  if (v === null || v === undefined || v === '') return '—';
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString(locale) : '—';
};

const fmtDate = (v, locale = 'vi-VN') => {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString(locale);
};

const fmtDateTime = (v, locale = 'vi-VN') => {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString(locale);
};

const fmtTime = (t) => {
  if (!t) return '—';
  // t có thể là "08:30:00" hoặc ISO; xử lý đơn giản
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(t)) return t.slice(0, 5);
  const d = new Date(t);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
  return '—';
};

// map màu trạng thái
const statusColor = (s) => {
  switch (String(s || '').toUpperCase()) {
    case 'APPROVED':
      return { color: 'success', label: 'Đã duyệt' };
    case 'PENDING':
    case 'PENDING_APPROVAL':
      return { color: 'warning', label: 'Chờ duyệt' };
    case 'REJECTED':
    case 'REJECT':
      return { color: 'error', label: 'Từ chối' };
    default:
      return { color: 'default', label: s || '—' };
  }
};

function ProductView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch dữ liệu (GIỮ NGUYÊN API)
  useEffect(() => {
    fetch(`http://localhost:6868/api/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Event not found');
        return res.json();
      })
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError('Không tìm thấy sự kiện');
        setLoading(false);
      });
  }, [id]);

  const handleImageClick = (url) => setSelectedImage(url);
  const handleCloseDialog = () => setSelectedImage(null);

  if (loading) {
    return (
      <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h6" color="text.secondary">Đang tải...</Typography>
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Box sx={{ mt: 8, px: { xs: 2, sm: 4 }, maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h6" color="error.main">{error || 'Không tìm thấy sự kiện'}</Typography>
      </Box>
    );
  }

  // Hỗ trợ cả camelCase và snake_case từ backend
  const eventId = event.eventId ?? event.id ?? '—';
  const title = event.title ?? '—';
  const description = event.description ?? '—';
  const category = event.category ?? '—';
  const date = event.date ?? event.eventDate ?? '—';
  const time = event.time ?? event.eventTime ?? '—';
  const startDate = event.startDate ?? event.start_date ?? '—';
  const endDate = event.endDate ?? event.end_date ?? '—';
  const venue = event.venue ?? '—';
  const organizerId = event.organizerId ?? event.organizer_id ?? '—';
  const status = event.status ?? event.approval_status ?? '—';
  const approvedBy = event.approvedBy ?? event.approved_by ?? '—';
  const approvedAt = event.approvedAt ?? event.approved_at ?? null;
  const totalSeats = event.totalSeats ?? event.total_seats ?? null;
  const mainImageUrl = event.mainImageUrl ?? event.main_image_url ?? '';

  const s = statusColor(status);

  return (
    <Box sx={{ mt: 2, px: { xs: 2, sm: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Hero header giống trang sự kiện */}
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          mb: 3,
          background:
            'linear-gradient(135deg, rgba(33,150,243,0.08), rgba(156,39,176,0.08))',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Chip
                label={category.toString().toUpperCase()}
                icon={<CategoryIcon />}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label={s.label}
                icon={<VerifiedRoundedIcon />}
                color={s.color}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Chip
                label={`Mã #${eventId}`}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            </Stack>

            <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 1 }}>
              {title}
            </Typography>

            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <Chip
                icon={<CalendarMonthRoundedIcon />}
                label={`Ngày: ${fmtDate(date)} • ${fmtDate(startDate)} — ${fmtDate(endDate)}`}
                variant="outlined"
              />
              <Chip
                icon={<AccessTimeRoundedIcon />}
                label={`Giờ: ${fmtTime(time)}`}
                variant="outlined"
              />
              <Chip
                icon={<PlaceRoundedIcon />}
                label={venue}
                variant="outlined"
              />
              <Chip
                icon={<PeopleAltRoundedIcon />}
                label={`Sức chứa: ${fmtNumber(totalSeats)}`}
                variant="outlined"
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                width: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                cursor: mainImageUrl ? 'pointer' : 'default',
              }}
              onClick={() => mainImageUrl && handleImageClick(mainImageUrl)}
            >
              {mainImageUrl ? (
                <img
                  src={mainImageUrl}
                  alt={title}
                  style={{ display: 'block', width: '100%', height: 220, objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    height: 220,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: 'grey.100',
                    color: 'text.secondary',
                  }}
                >
                  Chưa có ảnh chính
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Nội dung / mô tả */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Giới thiệu sự kiện
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Thông tin chi tiết
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CategoryIcon /></ListItemIcon>
                <ListItemText primary="Danh mục" secondary={category} />
              </ListItem>
              <ListItem>
                <ListItemIcon><CalendarMonthRoundedIcon /></ListItemIcon>
                <ListItemText
                  primary="Khoảng thời gian"
                  secondary={`${fmtDate(startDate)} — ${fmtDate(endDate)}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><AccessTimeRoundedIcon /></ListItemIcon>
                <ListItemText primary="Giờ diễn ra" secondary={fmtTime(time)} />
              </ListItem>
              <ListItem>
                <ListItemIcon><PlaceRoundedIcon /></ListItemIcon>
                <ListItemText primary="Địa điểm" secondary={venue} />
              </ListItem>
              <ListItem>
                <ListItemIcon><PeopleAltRoundedIcon /></ListItemIcon>
                <ListItemText primary="Tổng chỗ ngồi" secondary={fmtNumber(totalSeats)} />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Sidebar info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Thông tin sự kiện
            </Typography>
            <Stack spacing={1.25}>
              <Row label="Mã sự kiện" value={`#${eventId}`} />
              <Row label="Trạng thái" value={<Chip size="small" color={s.color} label={s.label} />} />
              <Row label="Ngày" value={fmtDate(date)} />
              <Row label="Bắt đầu" value={fmtDate(startDate)} />
              <Row label="Kết thúc" value={fmtDate(endDate)} />
              <Row label="Giờ" value={fmtTime(time)} />
              <Row label="Địa điểm" value={venue} />
              <Row label="Tổ chức (ID)" value={organizerId} />
              <Row label="Người duyệt (ID)" value={approvedBy ?? '—'} />
              <Row label="Duyệt lúc" value={fmtDateTime(approvedAt)} />
              <Row label="Sức chứa" value={fmtNumber(totalSeats)} />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/admin/product')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                py: 1.2,
              }}
            >
              Quay lại
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog ảnh lớn */}
      <Dialog
        open={!!selectedImage}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            maxWidth: '90vw',
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="event"
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

// Hàng hiển thị label/value gọn gàng
function Row({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
        {typeof value === 'string' || typeof value === 'number' ? value : value || '—'}
      </Typography>
    </Box>
  );
}

export default ProductView;
