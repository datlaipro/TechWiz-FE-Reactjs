import React from 'react';
import Slider from 'react-slick';
import ProductCard from './ProductCard';
import { styled } from '@mui/system';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaceIcon from '@mui/icons-material/Place';
import { Box, Card, CardMedia, CardContent, Typography, Stack, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
// Đảm bảo slider container có chiều rộng 100% và căn chỉnh hợp lý
const SliderContainer = styled('div')({
  padding: '0 20px',
  position: 'relative',
  maxWidth: '85%',
  margin: '0 auto',
  '@media (max-width: 800px)': {
    maxWidth: '80%',
  },
  '& .slick-list': {
    margin: '0 -5px',
  },
  '& .slick-slide': {
    padding: '0 5px',
    height: '450px !important',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .slick-track': {
    height: '480px !important',
    display: 'flex',
    alignItems: 'center',
  },
  '& .slick-prev, & .slick-next': {
    zIndex: 1,
    color: 'black',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  '& .slick-prev': {
    left: '-50px',
    '@media (max-width: 600px)': {
      left: '-20px',
    },
  },
  '& .slick-next': {
    right: '-50px',
    '@media (max-width: 600px)': {
      right: '-20px',
    },
  },
});

// Giữ nguyên wrapper cũ
const ProductCardWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  maxWidth: '320px',
  height: 'auto',
});

// ---- Helpers cho Event ----
const fmtRange = (startDate, endDate) => {
  try {
    const s = new Date(startDate);
    const e = endDate ? new Date(endDate) : null;
    const dOpt = { dateStyle: 'medium', timeStyle: 'short' };

    if (!e) return `Bắt đầu: ${s.toLocaleString('vi-VN', dOpt)}`;

    const sameDay =
      s.getFullYear() === e.getFullYear() &&
      s.getMonth() === e.getMonth() &&
      s.getDate() === e.getDate();

    return sameDay
      ? `${s.toLocaleString('vi-VN', dOpt)} – ${e.toLocaleTimeString('vi-VN', { timeStyle: 'short' })}`
      : `${s.toLocaleString('vi-VN', dOpt)} → ${e.toLocaleString('vi-VN', dOpt)}`;
  } catch {
    return '';
  }
};

const isEvent = (item) => !!item?.startDate;

// ---- Component chính ----
const ProductSlider = ({ products, imgH = { xs: 160, sm: 180, md: 200 } }) => {
  const navigate = useNavigate();
  const settings = {
    maxHeight: 420,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,            // GIỮ NGUYÊN
    slidesToScroll: 1,
    nextArrow: (
      <button className="slick-next">
        <ArrowForward style={{ fontSize: '30px', color: 'black' }} />
      </button>
    ),
    prevArrow: (
      <button className="slick-prev">
        <ArrowBack style={{ fontSize: '30px', color: 'black' }} />
      </button>
    ),
    responsive: [               // GIỮ NGUYÊN
      { breakpoint: 1268, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 700,  settings: { slidesToShow: 1 } },
      { breakpoint: 480,  settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <SliderContainer>
      <Slider {...settings}>
        {products.map((item) => {
          const key = item.id ?? item.title ?? Math.random();

          // Nếu là EVENT thì render card sự kiện, ngược lại dùng ProductCard cũ
          if (isEvent(item)) {
            return (
              <ProductCardWrapper key={key}>
                <Card
                  variant="outlined"
                  sx={{
                    width: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    '&:hover': { boxShadow: 6, translate: '0 -2px' },
                    transition: 'all .2s ease',
                  }}
                >
                  {item.image && (
                    <CardMedia
                     
                      component="img"
                      image={item.image}
                      alt={item.title}
                      sx={{
                        height: {
                          xs: imgH.xs ?? 160,
                          sm: imgH.sm ?? 180,
                          md: imgH.md ?? 200,
                        },
                        objectFit: 'cover',
                      }}
                    />
                  )}

                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 700,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: 48,
                      }}
                      title={item.title}
                    >
                      {item.title}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 1 }}>
                      <CalendarMonthIcon fontSize="small" />
                      <Typography variant="body2">
                        {fmtRange(item.startDate, item.endDate)}
                      </Typography>
                    </Stack>

                    {item.location && (
                      <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mt: 0.5 }}>
                        <PlaceIcon fontSize="small" />
                        <Typography variant="body2">{item.location}</Typography>
                      </Stack>
                    )}

                    <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
                      {item.link ? (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={()=>{
                            navigate(item.link);
                          }}
                          
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                         Visit Now
                        </Button>
                      ) : (
                        <Button size="small" variant="outlined" disabled>
                          Registration is about to open
                        </Button>
                      )}
                      {/* <Button size="small" variant="text">Chi tiết</Button> */}
                    </Stack>
                  </CardContent>
                </Card>
              </ProductCardWrapper>
            );
          }

          // Fallback: card sản phẩm cũ
          return (
            <ProductCardWrapper key={key}>
              <ProductCard product={item} />
            </ProductCardWrapper>
          );
        })}
      </Slider>
    </SliderContainer>
  );
};

export default ProductSlider;
