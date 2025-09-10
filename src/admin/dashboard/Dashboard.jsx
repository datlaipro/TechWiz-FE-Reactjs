import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Inventory,
  AttachMoney,
  Category,
  Language,
} from '@mui/icons-material';
import { Bar, Line, Pie, Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu sản phẩm
  useEffect(() => {
    fetch('http://localhost:6868/api/product')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Không thể tải dữ liệu sản phẩm');
        setLoading(false);
        console.error('Error:', err);
      });
  }, []);

  // Tính toán thống kê cho card
  const getStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const totalCategories = [...new Set(products.map((p) => p.category))].length;
    const totalLanguages = [...new Set(products.map((p) => p.language))].length;

    return { totalProducts, totalValue, totalCategories, totalLanguages };
  };

  // Xử lý dữ liệu cho biểu đồ
  const getChartData = () => {
    // 1. Biểu đồ cột: Số lượng sản phẩm theo thể loại
    const categories = [...new Set(products.map((p) => p.category))];
    const categoryCounts = categories.map(
      (cat) => products.filter((p) => p.category === cat).length
    );
    const barData = {
      labels: categories,
      datasets: [
        {
          label: 'Số lượng sản phẩm',
          data: categoryCounts,
          backgroundColor: [
            'rgba(33, 150, 243, 0.7)',
            'rgba(76, 175, 80, 0.7)',
            'rgba(156, 39, 176, 0.7)',
            'rgba(255, 193, 7, 0.7)',
          ],
          borderColor: [
            'rgba(33, 150, 243, 1)',
            'rgba(76, 175, 80, 1)',
            'rgba(156, 39, 176, 1)',
            'rgba(255, 193, 7, 1)',
          ],
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: [
            'rgba(33, 150, 243, 0.9)',
            'rgba(76, 175, 80, 0.9)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(255, 193, 7, 0.9)',
          ],
        },
      ],
    };

    // 2. Biểu đồ đường: Tổng giá trị sản phẩm theo ngôn ngữ
    const languages = [...new Set(products.map((p) => p.language))];
    const languageValues = languages.map((lang) =>
      products
        .filter((p) => p.language === lang)
        .reduce((sum, p) => sum + p.price * p.quantity, 0)
    );
    const lineData = {
      labels: languages,
      datasets: [
        {
          label: 'Tổng giá trị (VNĐ)',
          data: languageValues,
          fill: true,
          backgroundColor: 'rgba(33, 150, 243, 0.3)',
          borderColor: 'rgba(33, 150, 243, 1)',
          tension: 0.5,
          pointBackgroundColor: 'rgba(33, 150, 243, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(33, 150, 243, 1)',
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };

    // 3. Biểu đồ tròn: Phân bố trạng thái sản phẩm
    const statusCounts = {
      active: products.filter((p) => p.status).length,
      inactive: products.filter((p) => !p.status).length,
    };
    const pieData = {
      labels: ['Còn bán', 'Ngừng bán'],
      datasets: [
        {
          data: [statusCounts.active, statusCounts.inactive],
          backgroundColor: [
            'rgba(76, 175, 80, 0.7)',
            'rgba(244, 67, 54, 0.7)',
          ],
          borderColor: ['#fff', '#fff'],
          borderWidth: 2,
          hoverBackgroundColor: [
            'rgba(76, 175, 80, 0.9)',
            'rgba(244, 67, 54, 0.9)',
          ],
          hoverBorderColor: ['#fff', '#fff'],
        },
      ],
    };

    // 4. Biểu đồ cột ngang: Top 5 sản phẩm theo số lượng tồn kho
    const topProducts = products
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    const horizontalBarData = {
      labels: topProducts.map((p) => truncateText(p.name, 20)),
      datasets: [
        {
          label: 'Số lượng tồn kho',
          data: topProducts.map((p) => p.quantity),
          backgroundColor: 'rgba(156, 39, 176, 0.7)',
          borderColor: 'rgba(156, 39, 176, 1)',
          borderWidth: 1,
          borderRadius: 8,
          hoverBackgroundColor: 'rgba(156, 39, 176, 0.9)',
        },
      ],
    };

    return { barData, lineData, pieData, horizontalBarData };
  };

  // Hàm giới hạn số ký tự
  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Box sx={{ mt: 2, px: { xs: 1, sm: 2 }, bgcolor: 'grey.50' }}>
        <Grid container spacing={2}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={`card-${index}`}>
              <Skeleton
                variant="rectangular"
                height={100}
                sx={{ borderRadius: '12px' }}
              />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} md={6} key={`chart-${index}`}>
              <Skeleton
                variant="rectangular"
                height={280}
                sx={{ borderRadius: '12px' }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2, px: { xs: 1, sm: 2 }, bgcolor: 'grey.50' }}>
        <Alert
          severity="error"
          sx={{
            borderRadius: '8px',
            bgcolor: 'error.light',
            color: 'error.main',
            '& .MuiAlert-icon': { color: 'error.main' },
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  const { totalProducts, totalValue, totalCategories, totalLanguages } = getStats();
  const { barData, lineData, pieData, horizontalBarData } = getChartData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: 'text.primary',
          padding: 12,
          boxWidth: 20,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12, weight: 'medium' },
        padding: 12,
        cornerRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (context) =>
            `${context.dataset.label}: ${context.parsed.y || context.parsed}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'text.secondary',
          font: { size: 12, weight: 'medium' },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: 'text.secondary',
          font: { size: 12, weight: 'medium' },
        },
        grid: {
          color: 'grey.300',
          borderDash: [4, 4],
          drawBorder: false,
        },
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
      delay: (context) => context.dataIndex * 100,
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: 'text.primary',
          padding: 12,
          boxWidth: 20,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12, weight: 'medium' },
        padding: 12,
        cornerRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        callbacks: {
          label: (context) =>
            `${context.label}: ${context.parsed} (${(
              (context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) *
              100
            ).toFixed(1)}%)`,
        },
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
      animateRotate: true,
      animateScale: true,
    },
  };

  const horizontalBarOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: 'text.primary',
          padding: 12,
          boxWidth: 20,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 12, weight: 'medium' },
        padding: 12,
        cornerRadius: 8,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return products
              .sort((a, b) => b.quantity - a.quantity)
              [index].name;
          },
          label: (context) => `${context.dataset.label}: ${context.parsed.x}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'text.secondary',
          font: { size: 12, weight: 'medium' },
        },
        grid: {
          color: 'grey.300',
          borderDash: [4, 4],
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: 'text.secondary',
          font: { size: 12, weight: 'medium' },
        },
        grid: { display: false },
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
      delay: (context) => context.dataIndex * 100,
    },
  };

  return (
    <Box sx={{ mt: 1, px: { xs: 1, sm: 2 }, bgcolor: 'grey.50' }}>
      {/* <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: 'text.primary',
          letterSpacing: '0.5px',
          mb: 2,
        }}
      >
        Dashboard
      </Typography> */}

      {/* Card thống kê */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              bgcolor: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
              color: 'DarkGrey',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                boxShadow: '0 8px 28px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <Inventory sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                Tổng sản phẩm
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {totalProducts}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              bgcolor: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
              color: 'DarkGrey',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                boxShadow: '0 8px 28px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <AttachMoney sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                Tổng giá trị tồn kho
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {totalValue.toLocaleString()} VNĐ
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              bgcolor: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
              color: 'DarkGrey',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                boxShadow: '0 8px 28px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <Category sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                Tổng số Category
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {totalCategories}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              bgcolor: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
              color: 'DarkGrey',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                boxShadow: '0 8px 28px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <Language sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                Tổng ngôn ngữ
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {totalLanguages}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Biểu đồ */}
      <Grid container spacing={2}>
        {/* Biểu đồ cột: Số lượng sản phẩm theo thể loại */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              bgcolor: 'white',
              '&:hover': {
                boxShadow: '0 8px 28px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 1.5,
              }}
            >
              Số lượng sản phẩm theo thể loại
            </Typography>
            <Box sx={{ height: 260 }}>
              <Bar data={barData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Biểu đồ đường: Tổng giá trị sản phẩm theo ngôn ngữ */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              bgcolor: 'white',
              '&:hover': {
                boxShadow: '0 8px 28px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 1.5,
              }}
            >
              Tổng giá trị sản phẩm theo ngôn ngữ
            </Typography>
            <Box sx={{ height: 260 }}>
              <Line data={lineData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Biểu đồ tròn: Phân bố trạng thái sản phẩm */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              bgcolor: 'white',
              '&:hover': {
                boxShadow: '0 8px 28px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 1.5,
              }}
            >
              Phân bố trạng thái sản phẩm
            </Typography>
            <Box sx={{ height: 260 }}>
              <Pie data={pieData} options={pieOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* Biểu đồ cột ngang: Top 5 sản phẩm theo số lượng tồn kho */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 2,
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              bgcolor: 'white',
              '&:hover': {
                boxShadow: '0 8px 28px rgba(0, 0, 0, 0.15)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 1.5,
              }}
            >
              Top 5 sản phẩm tồn kho
            </Typography>
            <Box sx={{ height: 260 }}>
              <Bar data={horizontalBarData} options={horizontalBarOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;