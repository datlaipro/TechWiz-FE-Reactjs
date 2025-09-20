import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  TextField,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import readAuth from "../auth/getToken";

// === BẬT/TẮT mock data ===
const USE_MOCK = true;

// === DỮ LIỆU GIẢ TẠM ===
const MOCK_EVENTS = [
  {
    id: 101,
    title: "Hội thảo AI cơ bản",
    description: "Giới thiệu máy học, pipeline, demo notebook.",
    img: "https://picsum.photos/seed/ai/200/200",
    category: "Technical",
    date: "2025-09-20",
    start_date: "2025-09-25",
    end_date: "2025-09-26",
    time: "09:00:00",
    venue: "Hội trường A",
    department: "Khoa CNTT",
  },
  {
    id: 102,
    title: "Ngày hội văn hoá",
    description: "Gian hàng các CLB, ẩm thực, âm nhạc.",
    img: "https://picsum.photos/seed/culture/200/200",
    category: "Cultural",
    date: "2025-09-20",
    start_date: "2025-09-25",
    end_date: "2025-09-26",
    time: "09:00:00",
    venue: "Sân trường",
    department: "Phòng CT HSSV",
  },
  {
    id: 103,
    title: "Workshop React nâng cao",
    description: "React performance, memo hoá, lazy routes.",
    img: "https://picsum.photos/seed/react/200/200",
    category: "Technical",
    date: "2025-09-20",
    start_date: "2025-09-25",
    end_date: "2025-09-26",
    time: "09:00:00",
    venue: "P.302 - Nhà E",
    department: "Khoa CNTT",
  },
  {
    id: 104,
    title: "Giải chạy Marathon sinh viên",
    description: "Cung đường nội khu, có huy chương finisher.",
    img: "https://picsum.photos/seed/run/200/200",
    category: "Sports",
    date: "2025-09-20",
    start_date: "2025-09-25",
    end_date: "2025-09-26",
    time: "09:00:00",
    venue: "Cổng chính",
    department: "Đoàn - Hội",
  },
  {
    id: 105,
    title: "Seminar An toàn thông tin",
    description: "Chia sẻ về OWASP Top 10 và demo XSS.",
    img: "https://picsum.photos/seed/security/200/200",
    category: "Seminar",
    date: "2025-09-20",
    start_date: "2025-09-25",
    end_date: "2025-09-26",
    time: "09:00:00",
    venue: "Hội trường B",
    department: "Khoa CNTT",
  },
  {
    id: 106,
    title: "Cuộc thi ảnh “Campus Life”",
    description: "Nhận bài dự thi online, triển lãm ảnh top 20.",
    img: "https://picsum.photos/seed/photo/200/200",
    category: "Competition",
    date: "2025-09-20",
    start_date: "2025-09-25",
    end_date: "2025-09-26",
    time: "09:00:00",
    venue: "Online & Sảnh nhà A",
    department: "Marketing",
  },
];

function ProductList() {
  const { token, role, userId } = readAuth(); // lấy thêm role, userId
  const authHeaders = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Tìm kiếm theo tiêu đề
  const [searchTerm, setSearchTerm] = useState("");

  // Bộ lọc dashboard
  const [filters, setFilters] = useState({
    department: "",
    category: "",
    dateFrom: "",
    dateTo: "",
  });

  // Phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  // helpers
  const fmtDate = (s) => {
    if (!s) return "";
    try {
      const d = new Date(s);
      return isNaN(d.getTime()) ? s : d.toLocaleDateString("vi-VN");
    } catch {
      return s;
    }
  };
  const fmtTime = (t) => (t ? String(t).slice(0, 5) : "");
  const truncate = (txt, n = 80) =>
    !txt ? "" : txt.length <= n ? txt : txt.slice(0, n) + "…";

  // Lấy dữ liệu: dùng MOCK nếu USE_MOCK = true, ngược lại fetch từ BE
  useEffect(() => {
    fetch("http://localhost:6868/api/events")
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : [];
        setEvents(arr);
        setFilteredEvents(arr);
      })
      .catch((err) => {
        console.error("Error fetching events, fallback to mock:", err);
        // fallback mock khi fetch lỗi
        setEvents(MOCK_EVENTS);
        setFilteredEvents(MOCK_EVENTS);
      });
  }, []);

  // Tập giá trị select
  const departmentOptions = useMemo(() => {
    const set = new Set();
    events.forEach((ev) => {
      const dep = ev.department || ev.dept || ev.faculty || "";
      if (dep) set.add(dep);
    });
    return Array.from(set);
  }, [events]);

  const categoryOptions = useMemo(() => {
    const set = new Set();
    events.forEach((ev) => {
      const cat = ev.category || "";
      if (cat) set.add(cat);
    });
    return Array.from(set);
  }, [events]);

  // Áp dụng lọc + tìm kiếm
  useEffect(() => {
    const filtered = events.filter((ev) => {
      const titleMatch = (ev.title || "")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());
      if (!titleMatch) return false;

      const evDept = ev.department || ev.dept || ev.faculty || "";
      if (filters.department && evDept !== filters.department) return false;

      const evCat = ev.category || "";
      if (filters.category && evCat !== filters.category) return false;

      const startRaw =
        ev.start_date || ev.startDate || ev.date || ev.Date || "";
      const endRaw = ev.end_date || ev.endDate || ev.date || ev.Date || "";
      const evStart = startRaw ? new Date(startRaw) : null;
      const evEnd = endRaw ? new Date(endRaw) : evStart;

      if (filters.dateFrom) {
        const from = new Date(filters.dateFrom);
        if (evEnd && evEnd < from) return false;
      }
      if (filters.dateTo) {
        const to = new Date(filters.dateTo);
        if (evStart && evStart > to) return false;
      }
      return true;
    });

    setFilteredEvents(filtered);
    setPage(0);
  }, [events, searchTerm, filters]);

  // handlers
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleFilterChange = (name) => (e) =>
    setFilters((p) => ({ ...p, [name]: e.target.value }));
  const clearFilters = () =>
    setFilters({ department: "", category: "", dateFrom: "", dateTo: "" });

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sự kiện này?")) {
      fetch(`http://localhost:6868/api/organizer/events/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      // Khi dùng mock: chỉ xóa trên state
      setEvents((prev) => prev.filter((ev) => (ev.id ?? ev.event_id) !== id));
    }
  };
  const handleView = (eventId) => navigate(`/admin/eventsview/${eventId}`);
  const handleEdit = (eventId) => navigate(`/admin/editevent/${eventId}`);
  const handleAdd = () => navigate("/admin/addevent");

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      backgroundColor: "background.paper",
      "&:hover fieldset": { borderColor: "primary.main" },
      "&.Mui-focused fieldset": {
        borderColor: "primary.main",
        boxShadow: "0 0 8px rgba(25,118,210,0.2)",
      },
    },
  };

  return (
    <Box sx={{ mt: 2, px: { xs: 2, sm: 4 }, maxWidth: "1400px", mx: "auto" }}>
      {/* Header + Add */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#1a2820", letterSpacing: "0.5px" }}
        >
          DANH SÁCH SỰ KIỆN
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            fontWeight: "medium",
            px: 3,
            py: 1,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            "&:hover": {
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              bgcolor: "primary.dark",
            },
          }}
        >
          Thêm sự kiện
        </Button>
      </Box>

      {/* Bộ lọc */}
      <Paper
        sx={{
          mb: 2,
          p: 2,
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1.5 }}>
            <FilterAltOutlinedIcon />
            <Typography sx={{ fontWeight: 600 }}>Bộ lọc sự kiện</Typography>
          </Box>
          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel>Phòng ban</InputLabel>
            <Select
              label="Phòng ban"
              value={filters.department}
              onChange={handleFilterChange("department")}
              sx={inputSx}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {departmentOptions.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel>Loại sự kiện</InputLabel>
            <Select
              label="Loại sự kiện"
              value={filters.category}
              onChange={handleFilterChange("category")}
              sx={inputSx}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {categoryOptions.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            size="small"
            label="Từ ngày"
            type="date"
            value={filters.dateFrom}
            onChange={handleFilterChange("dateFrom")}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 180, ...inputSx }}
          />
          <TextField
            size="small"
            label="Đến ngày"
            type="date"
            value={filters.dateTo}
            onChange={handleFilterChange("dateTo")}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 180, ...inputSx }}
          />
          <Button variant="outlined" onClick={clearFilters} sx={{ ml: "auto" }}>
            XÓA LỌC
          </Button>
        </Box>
      </Paper>

      {/* Ô tìm kiếm */}
      <TextField
        fullWidth
        label="Tìm kiếm theo tiêu đề"
        value={searchTerm}
        onChange={handleSearchChange}
        margin="normal"
        variant="outlined"
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "background.paper",
            "&:hover fieldset": { borderColor: "primary.main" },
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
              boxShadow: "0 0 8px rgba(25,118,210,0.3)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "text.secondary",
            fontWeight: "medium",
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "primary.main" },
        }}
      />

      {/* Bảng */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="event table">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "grey.100",
                "& th": {
                  fontWeight: "bold",
                  color: "text.primary",
                  py: 2,
                  borderBottom: "2px solid",
                  borderColor: "grey.300",
                },
              }}
            >
              <TableCell>ID</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Thể loại</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Bắt đầu</TableCell>
              <TableCell>Kết thúc</TableCell>
              <TableCell>Giờ</TableCell>
              {/* đổi 2 cột dưới đây */}
              <TableCell align="right">Số lượng đăng ký</TableCell>
              <TableCell align="right">Số lượng check-in</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredEvents
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ev) => {
                const eventId = ev.eventId ?? ev.event_id ?? ev.id; // 👈 ưu tiên eventId
             
                const date = ev.date || ev.Date || "";
                const startDate = ev.start_date || ev.startDate || "";
                const endDate = ev.end_date || ev.endDate || "";
                const time = ev.time || ev.Time || "";
                
                const category = ev.category || "";
                const title = ev.title || "";
                const desc = ev.description || "";

                // thêm 2 biến đếm, fallback nhiều tên field phổ biến
                const registered =
                  ev.registeredCount ??
                  ev.registrationCount ??
                  ev.registrations ??
                  ev.totalRegistrations ??
                  ev.register_count ??
                  0;

                const checkedIn =
                  ev.checkinCount ??
                  ev.checkedIn ??
                  ev.checkins ??
                  ev.attendedCount ??
                  ev.check_in_count ??
                  0;

                return (
                  <TableRow
                    key={eventId}
                    sx={{
                      "&:hover": {
                        backgroundColor: "grey.50",
                        transition: "background-color 0.2s",
                      },
                      "& td": {
                        py: 1.5,
                        borderBottom: "1px solid",
                        borderColor: "grey.200",
                      },
                    }}
                  >
                    <TableCell>{eventId}</TableCell>
                    <TableCell sx={{ fontWeight: "medium" }}>{title}</TableCell>
                    <TableCell>{category}</TableCell>
                    <TableCell sx={{ maxWidth: 260 }}>
                      <Typography variant="body2" color="text.secondary">
                        {truncate(desc, 90)}
                      </Typography>
                    </TableCell>
                    <TableCell>{fmtDate(date)}</TableCell>
                    <TableCell>{fmtDate(startDate)}</TableCell>
                    <TableCell>{fmtDate(endDate)}</TableCell>
                    <TableCell>{fmtTime(time)}</TableCell>
                    <TableCell align="right">{registered}</TableCell>
                    <TableCell align="right">{checkedIn}</TableCell>

                    <TableCell>
                      <IconButton
                        onClick={() => handleView(eventId)}
                        sx={{
                          color: "info.main",
                          "&:hover": {
                            bgcolor: "info.light",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s",
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      {/* <IconButton
                        onClick={() => handleEdit(eventId)}
                        sx={{
                          color: "warning.main",
                          "&:hover": {
                            bgcolor: "warning.light",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s",
                        }}
                      >
                        <EditIcon />
                      </IconButton> */}
                      {/* <IconButton
                        onClick={() => handleDelete(eventId)}
                        sx={{
                          color: "error.main",
                          "&:hover": {
                            bgcolor: "error.light",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s",
                        }}
                      >
                        <DeleteIcon />
                      </IconButton> */}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[6, 12, 24]}
        component="div"
        count={filteredEvents.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Số hàng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} của ${count}`
        }
        sx={{
          mt: 2,
          "& .MuiTablePagination-toolbar": {
            backgroundColor: "grey.50",
            borderRadius: "8px",
            py: 1,
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            { color: "text.secondary", fontWeight: "medium" },
          "& .MuiTablePagination-actions button": {
            borderRadius: "8px",
            "&:hover": { bgcolor: "grey.200" },
          },
        }}
      />
    </Box>
  );
}

export default ProductList;
