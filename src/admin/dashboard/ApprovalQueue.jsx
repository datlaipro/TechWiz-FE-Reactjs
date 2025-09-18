import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  Divider,
  Chip,
  Alert,
  IconButton,
  Skeleton,
  Tooltip

} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import FilterAlt from "@mui/icons-material/FilterAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import readAuth from "../auth/getToken";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";

import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
const PENDING_URL = "http://localhost:6868/api/admin/events/pending-approve";
const STORAGE_KEY = "authState_v1";

const fmtDate = (s) => (s ? String(s).slice(0, 10) : "");
const fmtTime = (s) => (s ? String(s).slice(0, 5) : "");
const normStatus = (s) => String(s || "").toUpperCase();

function inRange(start, end, fromStr, toStr) {
  if (!fromStr && !toStr) return true;
  const s = start ? new Date(start) : null;
  const e = end ? new Date(end) : s;
  if (!s) return false;
  const from = fromStr ? new Date(`${fromStr}T00:00:00`) : null;
  const to = toStr ? new Date(`${toStr}T23:59:59`) : null;
  if (from && e < from) return false;
  if (to && s > to) return false;
  return true;
}


export default function ApprovalQueue({ onView, onEdit }) {
  const navigate = useNavigate();

  const handleView = (eventId) => navigate(`/admin/adminview/${eventId}`);
  const handleEdit = (eventId) => navigate(`/admin/editview/${eventId}`);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [rowsRaw, setRowsRaw] = useState([]); // dữ liệu thô từ API (news)

  const fetchPending = async () => {
    try {
      setLoading(true);
      setErr("");
      const { token } = readAuth();
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const res = await fetch(PENDING_URL, { headers });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRowsRaw(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (e) {
      setErr("Không thể tải danh sách sự kiện chờ duyệt");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  // map news -> rows (giữ nguyên logic, đổi department -> category)
  const rows = useMemo(() => {
    return (rowsRaw || [])
      .map((e) => {
        const idRaw = e.eventId ?? e.id ?? e.uuid;
        if (idRaw == null) return null;

        const start = e.startDate ?? e.date ?? "";
        const end = e.endDate ?? e.date ?? "";
        const time = fmtTime(e.time);
        const scheduled =
          start && end && start !== end
            ? `${fmtDate(start)} → ${fmtDate(end)}${time ? ` ${time}` : ""}`
            : `${fmtDate(start || end)}${time ? ` ${time}` : ""}`;

        return {
          id: `EVT-${idRaw}`,
          type: "Sự kiện",
          eventId: idRaw,
          title: e.title || "—",
          category: e.category || "—", // Thể loại
          status: normStatus(e.status || "PENDING_APPROVAL"),
          scheduledAt: scheduled,
          venue: e.venue || "",
          // để lọc theo thời gian
          _start: start || null,
          _end: end || null,
        };
      })
      .filter(Boolean);
  }, [rowsRaw]);

  // ===== Filters =====
  const [qTitle, setQTitle] = useState("");
  const [filters, setFilters] = useState({
    category: "Tất cả",
    status: "Tất cả",
    startDate: "",
    endDate: "",
  });

  const categoryOptions = useMemo(() => {
    const s = new Set(["Tất cả"]);
    rows.forEach((r) => r.category && s.add(r.category));
    return Array.from(s);
  }, [rows]);

  const statusOptions = useMemo(
    () => ["Tất cả", "PENDING_APPROVAL", "IN_REVIEW", "PUBLISHED", "REJECTED"],
    []
  );

  // áp filter
  const filteredRows = useMemo(() => {
    const normalize = (v) =>
      String(v || "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();
    const q = normalize(qTitle.trim());

    return rows.filter((r) => {
      const okTitle = !q || normalize(r.title).includes(q);
      const okCat =
        filters.category === "Tất cả" || r.category === filters.category;
      const okStatus =
        filters.status === "Tất cả" || r.status === filters.status;
      const okDate = inRange(
        r._start,
        r._end,
        filters.startDate,
        filters.endDate
      );
      return okTitle && okCat && okStatus && okDate;
    });
  }, [
    rows,
    qTitle,
    filters.category,
    filters.status,
    filters.startDate,
    filters.endDate,
  ]);

  const resetFilters = () =>
    setFilters({
      category: "Tất cả",
      status: "Tất cả",
      startDate: "",
      endDate: "",
    });

  return (
    <Paper sx={{ p: 2, borderRadius: "12px" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Tooltip title="Quay lại">
              <IconButton size="small" onClick={() => navigate("/admin")}>
                <ArrowBackIosNew fontSize="small" />
              </IconButton>
            </Tooltip>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          Hàng chờ duyệt
        </Typography>
        <IconButton onClick={fetchPending} title="Tải lại">
          <RefreshIcon />
        </IconButton>
      </Stack>

      {/* Loading / Error */}
      {loading && (
        <Box sx={{ mb: 2 }}>
          <Skeleton
            variant="rectangular"
            height={56}
            sx={{ borderRadius: 1, mb: 1 }}
          />
          <Skeleton
            variant="rectangular"
            height={420}
            sx={{ borderRadius: 1 }}
          />
        </Box>
      )}
      {!!err && (
        <Box sx={{ mb: 2 }}>
          <Alert severity="error" sx={{ mb: 1 }}>
            {err}
          </Alert>
          <Button onClick={fetchPending} startIcon={<RefreshIcon />}>
            Thử lại
          </Button>
        </Box>
      )}

      {!loading && !err && (
        <>
          {/* Bộ lọc */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <FilterAlt />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Bộ lọc
              </Typography>
            </Stack>

            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Tìm kiếm theo tiêu đề"
                placeholder="Nhập từ khoá tiêu đề…"
                value={qTitle}
                onChange={(e) => setQTitle(e.target.value)}
              />
            </Box>

            <Box sx={{ flex: 1 }} />

            <TextField
              select
              size="small"
              label="Thể loại"
              value={filters.category}
              onChange={(e) =>
                setFilters((f) => ({ ...f, category: e.target.value }))
              }
              sx={{ minWidth: 180 }}
            >
              {categoryOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              size="small"
              label="Trạng thái"
              value={filters.status}
              onChange={(e) =>
                setFilters((f) => ({ ...f, status: e.target.value }))
              }
              sx={{ minWidth: 180 }}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              size="small"
              type="date"
              label="Từ ngày"
              InputLabelProps={{ shrink: true }}
              value={filters.startDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, startDate: e.target.value }))
              }
            />
            <TextField
              size="small"
              type="date"
              label="Đến ngày"
              InputLabelProps={{ shrink: true }}
              value={filters.endDate}
              onChange={(e) =>
                setFilters((f) => ({ ...f, endDate: e.target.value }))
              }
            />

            <Button variant="outlined" onClick={resetFilters}>
              Xóa lọc
            </Button>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ height: 420 }}>
            <DataGrid
              rows={filteredRows}
              columns={[
                { field: "type", headerName: "Loại", width: 90 },
                {
                  field: "title",
                  headerName: "Tiêu đề",
                  flex: 1,
                  minWidth: 160,
                },
                { field: "category", headerName: "Thể loại", width: 150 },
                {
                  field: "status",
                  headerName: "Trạng thái",
                  width: 150,
                  renderCell: (p) => (
                    <Chip
                      size="small"
                      label={(p.value || "").toUpperCase()}
                      color={
                        (p.value || "").toUpperCase() === "PENDING"
                          ? "warning"
                          : "info"
                      }
                      variant="outlined"
                    />
                  ),
                },
                { field: "scheduledAt", headerName: "Lịch", width: 160 },
                {
                  field: "actions",
                  headerName: "Thao tác",
                  width: 200,
                  sortable: false,
                  renderCell: (p) => (
                   <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleView(p.row.eventId)}
                        >
                          Xem
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(p.row.eventId)}
                        >
                          Sửa
                        </Button>
                      </Stack>
                  ),
                },
              ]}
              hideFooterSelectedRowCount
              pageSizeOptions={[5, 10]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5, page: 0 } },
              }}
            />
          </Box>

          <Divider sx={{ my: 1.5 }} />
          <Typography variant="body2" color="text.secondary">
            *Thao tác duyệt/hủy hiện chỉ cập nhật UI. Khi có API, gọi endpoint
            tương ứng rồi refetch.
          </Typography>
        </>
      )}
    </Paper>
  );
}
