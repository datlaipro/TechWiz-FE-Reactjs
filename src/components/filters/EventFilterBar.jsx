import React from "react";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function yyyymmdd(d) {
  const pad = (n) => (n < 10 ? "0" + n : "" + n);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function currentWeekRange() {
  const now = new Date();
  const day = now.getDay(); // 0=CN
  const diffToMon = (day + 6) % 7; // về thứ 2
  const start = new Date(now); start.setDate(now.getDate() - diffToMon);
  const end = new Date(start); end.setDate(start.getDate() + 6);
  return { from: yyyymmdd(start), to: yyyymmdd(end) };
}
function currentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: yyyymmdd(start), to: yyyymmdd(end) };
}

const DEPARTMENTS = ["", "Phòng đào tạo", "Khoa CNTT", "Đoàn - Hội", "Thư viện"];
const EVENT_TYPES = ["", "Workshop", "Seminar", "Hackathon", "Orientation", "Competition"];

export default function EventFilterBar({ filters, setFilters }) {
  const onChange = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));
  const setRange = ({ from, to }) =>
    setFilters((f) => ({ ...f, dateFrom: from, dateTo: to }));

  return (
    <Box sx={{ mb: 2, p: 2, borderRadius: 2, border: "1px solid #eee", bgcolor: "#fff" }}>
      <Grid container spacing={2} alignItems="center">
        {/* Search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder="Tìm kiếm sự kiện…"
            value={filters.searchQuery || ""}
            onChange={onChange("searchQuery")}
            InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
          />
        </Grid>

        {/* Phòng ban */}
        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel>Phòng ban</InputLabel>
            <Select
              label="Phòng ban"
              value={filters.department || ""}
              onChange={onChange("department")}
            >
              {DEPARTMENTS.map((d) => (
                <MenuItem key={d || "all"} value={d}>{d || "Tất cả"}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Loại sự kiện */}
        <Grid item xs={12} sm={6} md={2.5}>
          <FormControl fullWidth size="small">
            <InputLabel>Loại sự kiện</InputLabel>
            <Select
              label="Loại sự kiện"
              value={filters.eventType || ""}
              onChange={onChange("eventType")}
            >
              {EVENT_TYPES.map((t) => (
                <MenuItem key={t || "all"} value={t}>{t || "Tất cả"}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Ngày từ / đến */}
        <Grid item xs={6} md={1.5}>
          <TextField
            fullWidth
            size="small"
            label="Từ ngày"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.dateFrom || ""}
            onChange={onChange("dateFrom")}
          />
        </Grid>
        <Grid item xs={6} md={1.5}>
          <TextField
            fullWidth
            size="small"
            label="Đến ngày"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.dateTo || ""}
            onChange={onChange("dateTo")}
          />
        </Grid>

        {/* Nút nhanh + Sắp xếp */}
        <Grid item xs={12} md={10} lg={8} sx={{ display: { xs: "flex", md: "flex" }, gap: 1 }}>
          <Button variant="outlined" size="small" onClick={() => setRange(currentWeekRange())}>
            Tuần này
          </Button>
          <Button variant="outlined" size="small" onClick={() => setRange(currentMonthRange())}>
            Tháng này
          </Button>
          <Button variant="text" size="small" onClick={() => setRange({ from: "", to: "" })}>
            Xoá ngày
          </Button>
        </Grid>
        <Grid item xs={12} md={2} lg={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Sắp xếp</InputLabel>
            <Select
              label="Sắp xếp"
              value={filters.sort || ""}
              onChange={onChange("sort")}
            >
              <MenuItem value="">Mặc định</MenuItem>
              <MenuItem value="name-asc">Tên A → Z</MenuItem>
              <MenuItem value="name-desc">Tên Z → A</MenuItem>
              <MenuItem value="date-asc">Ngày sớm → muộn</MenuItem>
              <MenuItem value="date-desc">Ngày muộn → sớm</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}
