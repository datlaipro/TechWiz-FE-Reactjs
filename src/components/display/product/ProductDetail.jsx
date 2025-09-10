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
        setProduct({
          id: data.id,
          title: data.name,
          price: data.salePrice || data.price,
          oldPrice: data.salePrice ? data.price : null,
          description: data.description,
          stock: data.quantity,
          rating: Math.round(data.rating || 0),
          images:
            Array.isArray(data.images) && data.images.length > 0
              ? data.images
              : ['/demo/images/placeholder.png'],

          // Nếu backend có thì hiện, không có sẽ tự ẩn
          startTime: data.startTime,
          endTime: data.endTime,
          eventDateText: data.eventDateText,
          venueName: data.venueName,
          venueAddress: data.venueAddress,
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
    typeof n === 'number' ? new Intl.NumberFormat('vi-VN').format(n) + ' đ' : n;

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

      {/* Giảm toàn khối ~50%: thu hẹp maxWidth, giảm padding, font, height */}
      <Box
        sx={{
          width: '100%',  
          maxWidth: 980,          // ↓ trước rộng toàn màn, giờ giới hạn
          mx: 'auto',
          px: { xs: 1.5, md: 2 }, // ↓ padding ngang
          pb: 4,                  // ↓ padding dưới
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1.4fr' }, // ↓ tỷ lệ cột
          gap: 0,
          alignItems: 'stretch',
        }}
      >
        {/* LEFT PANEL – nhỏ lại */}
        <Box
          sx={{
            bgcolor: '#1f2427',
            height: '70%',
         
            color: '#e7fbe7',
            p: { xs: 2, md: 3 },         // ↓ padding
            borderTopLeftRadius: 12,      // ↓ radius
            borderBottomLeftRadius: 12,
            borderTopRightRadius: { xs: 12, md: 0 },
            borderBottomRightRadius: { xs: 12, md: 0 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,                       // ↓ spacing
            position: 'relative',
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              lineHeight: 1.3,
              color: 'white',
              fontSize: { xs: 18, md: 20 },  // ↓ font
            }}
          >
            {title}
          </Typography>

          {(startTime || endTime || eventDateText) && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthRounded fontSize="small" sx={{ opacity: 0.9 }} />
              <Typography sx={{ opacity: 0.95, fontSize: 14 }}>
                {startTime && endTime ? `${startTime} - ${endTime}` : ''}
                {eventDateText ? (startTime || endTime ? `, ${eventDateText}` : eventDateText) : ''}
              </Typography>
            </Stack>
          )}

          {startTime && endTime && (
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeRounded fontSize="small" sx={{ opacity: 0.9 }} />
              <Typography sx={{ opacity: 0.95, fontSize: 14 }}>
                Thời lượng: {startTime} – {endTime}
              </Typography>
            </Stack>
          )}

          {(venueName || venueAddress) && (
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <PlaceRounded fontSize="small" sx={{ mt: '1px', opacity: 0.9 }} />
              <Box>
                {venueName && (
                  <Typography sx={{ fontWeight: 600, opacity: 0.95, fontSize: 14 }}>
                    {venueName}
                  </Typography>
                )}
                {venueAddress && (
                  <Typography sx={{ opacity: 0.8, fontSize: 13 }}>{venueAddress}</Typography>
                )}
              </Box>
            </Stack>
          )}

          {rating > 0 && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              {Array.from({ length: rating }, (_, i) => (
                <StarIcon key={i} sx={{ color: '#f5d142', fontSize: 18 }} />
              ))}
              <Chip
                label={`Còn: ${stock ?? 0}`}
                size="small"
                sx={{ ml: 1, bgcolor: 'rgba(255,255,255,.08)', color: 'white', height: 22 }}
              />
            </Stack>
          )}

          <Box sx={{ height: 1, bgcolor: 'rgba(255,255,255,.08)', my: 1 }} />

          <Box>
            <Typography sx={{ opacity: 0.85, mb: 0.25, fontSize: 13 }}>Giá từ</Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography sx={{ fontWeight: 900, color: 'white', fontSize: 22 }}>
                {fmtVND(price)}
              </Typography>
              {oldPrice && (
                <Typography component="del" sx={{ color: 'rgba(255,255,255,.55)', fontSize: 14 }}>
                  {fmtVND(oldPrice)}
                </Typography>
              )}
            </Stack>

            <Stack direction="row" spacing={1.2} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#22c55e',
                  color: '#0b2e13',
                  fontWeight: 800,
                  px: 2.2,
                  py: 1.1,            // ↓ nút nhỏ hơn
                  fontSize: 14,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#16a34a' },
                }}
              >
                Register
              </Button>

              
            </Stack>
          </Box>

          {description && (
            <Typography sx={{ mt: 1, color: 'rgba(255,255,255,.9)', fontSize: 13.5 }}>
              {truncate(description, 160)} {/* ↓ bớt ký tự cho gọn */}
            </Typography>
          )}

          {/* đường đục lỗ – thu nhỏ */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: 0,
              right: -9,              // ↓
              height: '100%',
              width: 18,              // ↓
            
            }}
          />
        </Box>

        {/* RIGHT – Poster: chiều cao nhỏ hơn */}
        <Box
          sx={{
            position: 'relative',
            minHeight: { xs: 150, md: 150 }, // ↓ từ 520 → 360
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={poster}
            alt={title}
            sx={{
              width: '100%',
             height: '75%',
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
