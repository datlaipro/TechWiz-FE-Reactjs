import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Chip,
} from '@mui/material';
import BreadcrumbsComponent from '../free/BreadcrumbsComponent';
import LatestPosts from '../post/LatestPosts';
import InstagramGallery from '../GroupItems/InstagramGallery';
import InfoProduct from './InfoProduct';
import StarIcon from '@mui/icons-material/Star';
import CalendarMonthRounded from '@mui/icons-material/CalendarMonthRounded';
import PlaceRounded from '@mui/icons-material/PlaceRounded';
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://localhost:6868/api/product/${id}/detail`)
      .then((res) => {
        if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
        return res.json();
      })
      .then((data) => {
        // Map dữ liệu từ API sang "event-style"
        setProduct({
          id: data.id,
          title: data.name,
          price: data.salePrice || data.price,
          oldPrice: data.salePrice ? data.price : null,
          description: data.description,
          stock: data.quantity,
          rating: Math.round(data.rating || 0),
          images: Array.isArray(data.images) && data.images.length > 0
            ? data.images
            : ['/demo/images/placeholder.png'],

          // Các trường dưới đây là tuỳ chọn (nếu back-end có thì hiện, không có thì ẩn)
          startTime: data.startTime,            // ví dụ: "19:30"
          endTime: data.endTime,                // ví dụ: "23:30"
          eventDateText: data.eventDateText,    // ví dụ: "17 Tháng 10, 2025"
          venueName: data.venueName,            // ví dụ: "Trung tâm Triển lãm Việt Nam (VEC)"
          venueAddress: data.venueAddress,      // ví dụ: "3VQ8+24C, Đồng Anh, Hà Nội"
        });
        setLoading(false);
      })
      .catch((err) => {
        setError('Lỗi khi tải sản phẩm');
        setLoading(false);
        console.error('Error:', err);
      });
  }, [id]);

  const truncate = (t, n) => (t && t.length > n ? t.substring(0, n) + '...' : t || '');
  const fmtVND = (n) =>
    typeof n === 'number'
      ? new Intl.NumberFormat('vi-VN').format(n) + ' đ'
      : n;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography color="error">{error || 'Không tìm thấy sản phẩm'}</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          sx={{ mt: 2, borderRadius: '8px', textTransform: 'none' }}
        >
          Về trang chủ
        </Button>
      </Box>
    );
  }

  const {
    title,
    price,
    oldPrice,
    rating,
    images,
    startTime,
    endTime,
    eventDateText,
    venueName,
    venueAddress,
    stock,
    description,
  } = product;

  // Poster lớn (lấy ảnh đầu tiên)
  const poster = images[0];

  return (
    <>
      <BreadcrumbsComponent
        title="Detail"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'ProductDetail' },
          { label: truncate(title, 20) },
        ]}
      />

      {/* Ticket-like wrapper */}
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          pb: 6,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 1.9fr' },
          gap: 0,
          alignItems: 'stretch',
        }}
      >
        {/* LEFT: Info panel (nền tối, bo góc) */}
        <Box
          sx={{
            bgcolor: '#1f2427',
            color: '#e7fbe7',
            p: { xs: 3, md: 4 },
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            borderTopRightRadius: { xs: 16, md: 0 },
            borderBottomRightRadius: { xs: 16, md: 0 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            position: 'relative',
          }}
        >
          {/* Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              lineHeight: 1.25,
              color: 'white',
              textShadow: '0 2px 12px rgba(0,0,0,.35)',
            }}
          >
            {title}
          </Typography>

          {/* Time & Date */}
          {(startTime || endTime || eventDateText) && (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CalendarMonthRounded sx={{ opacity: 0.9 }} />
              <Typography sx={{ opacity: 0.95 }}>
                {startTime && endTime ? `${startTime} - ${endTime}` : ''}
                {eventDateText ? (startTime || endTime ? `, ${eventDateText}` : eventDateText) : ''}
              </Typography>
            </Stack>
          )}

          {/* Extra time row (optional) */}
          {startTime && endTime && (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <AccessTimeRounded sx={{ opacity: 0.9 }} />
              <Typography sx={{ opacity: 0.95 }}>
                Thời lượng: {startTime} – {endTime}
              </Typography>
            </Stack>
          )}

          {/* Location */}
          {(venueName || venueAddress) && (
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <PlaceRounded sx={{ mt: '2px', opacity: 0.9 }} />
              <Box>
                {venueName && (
                  <Typography sx={{ fontWeight: 600, opacity: 0.95 }}>{venueName}</Typography>
                )}
                {venueAddress && (
                  <Typography sx={{ opacity: 0.8 }}>{venueAddress}</Typography>
                )}
              </Box>
            </Stack>
          )}

          {/* Rating (nếu có) */}
          {rating > 0 && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              {Array.from({ length: rating }, (_, i) => (
                <StarIcon key={i} sx={{ color: '#f5d142' }} />
              ))}
              <Chip
                label={`Còn: ${stock ?? 0}`}
                size="small"
                sx={{ ml: 1, bgcolor: 'rgba(255,255,255,.08)', color: 'white' }}
              />
            </Stack>
          )}

          {/* Divider mảnh */}
          <Box sx={{ height: 1, bgcolor: 'rgba(255,255,255,.08)', my: 1 }} />

          {/* Price + CTA giống ảnh */}
          <Box>
            <Typography sx={{ opacity: 0.85, mb: 0.5 }}>Giá từ</Typography>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'white' }}>
                {fmtVND(price)}
              </Typography>
              {oldPrice && (
                <Typography
                  variant="h6"
                  component="del"
                  sx={{ color: 'rgba(255,255,255,.55)' }}
                >
                  {fmtVND(oldPrice)}
                </Typography>
              )}
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#22c55e',
                  color: '#0b2e13',
                  fontWeight: 800,
                  px: 3,
                  py: 1.4,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#16a34a' },
                }}
              >
                Mua vé ngay
              </Button>

              {/* Nút phụ vẫn giữ để không mất chức năng cũ */}
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#0f2e2e',
                  color: 'white',
                  fontWeight: 700,
                  px: 3,
                  py: 1.4,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#183e3e' },
                }}
              >
                Thêm vào giỏ
              </Button>
            </Stack>
          </Box>

          {/* Mô tả (rút gọn) */}
          {description && (
            <Typography sx={{ mt: 1.5, color: 'rgba(255,255,255,.9)' }}>
              {truncate(description, 220)}
            </Typography>
          )}

          {/* “đường đục lỗ” giả lập ở mép phải panel trái (desktop) */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: 0,
              right: -12,
              height: '100%',
              width: 24,
              background:
                'radial-gradient(circle at left center, transparent 10px, #0b0d0e 10px) left/24px 28px repeat-y',
            }}
          />
        </Box>

        {/* RIGHT: Poster lớn */}
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: 280, md: 520 },
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
            overflow: 'hidden',
            backgroundColor: '#0b0d0e',
          }}
        >
          <Box
            component="img"
            src={poster}
            alt={title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Box>
      </Box>

      <InfoProduct />
      <LatestPosts />
      <InstagramGallery />
    </>
  );
};

export default ProductDetail;
