import React from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  TextField,
  Button,
  Stack,
} from '@mui/material';

const DEFAULT_DEPARTMENTS = [
  'Phòng CTSV',
  'Khoa CNTT',
  'Khoa Kinh tế',
  'Phòng Truyền thông',
  'Trung tâm Thể thao',
];

const DEFAULT_EVENT_TYPES = [
  'Hội thảo',
  'Workshop',
  'Cuộc thi',
  'Talk',
  'Festival',
  'Thể thao',
];

const ProductFilter = ({
  filters,
  onFilterChange,
  productCount,
  departments = DEFAULT_DEPARTMENTS,
  eventTypes = DEFAULT_EVENT_TYPES,
}) => {
  const patch = (delta) => onFilterChange && onFilterChange(delta);

  const handleSortChange = (event) => {
    patch({ sort: event.target.value });
  };

  const handleDeptChange = (e) => {
    patch({ departments: e.target.value });
  };

  const handleTypeChange = (e) => {
    patch({ eventTypes: e.target.value });
  };

  const handleFromChange = (e) => {
    patch({ dateFrom: e.target.value });
  };

  const handleToChange = (e) => {
    patch({ dateTo: e.target.value });
  };

  const handleQuickWeek = () => {
    const now = new Date();
    const day = now.getDay(); // 0=CN
    const diffToMon = (day === 0 ? -6 : 1) - day;
    const start = new Date(now);
    start.setDate(now.getDate() + diffToMon);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const toYMD = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;

    patch({ dateFrom: toYMD(start), dateTo: toYMD(end) });
  };

  const handleQuickMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const toYMD = (d) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
    patch({ dateFrom: toYMD(start), dateTo: toYMD(end) });
  };

  const handleClearDates = () => patch({ dateFrom: '', dateTo: '' });

  return (
    <Box sx={{ mb: '2rem' }}>
      {/* Hàng trên: tổng số & Sort */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography>
          Showing {productCount} {productCount === 1 ? 'result' : 'results'}
        </Typography>

        <Select
          value={filters.sort ?? ''}
          onChange={handleSortChange}
          displayEmpty
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">Default sorting</MenuItem>
          {/* Giữ các sort cũ */}
          <MenuItem value="name-asc">Name (A - Z)</MenuItem>
          <MenuItem value="name-desc">Name (Z - A)</MenuItem>
          <MenuItem value="price-asc">Price (Low-High)</MenuItem>
          <MenuItem value="price-desc">Price (High-Low)</MenuItem>
          <MenuItem value="rating-highest">Rating (Highest)</MenuItem>
          <MenuItem value="rating-lowest">Rating (Lowest)</MenuItem>
          {/* Bổ sung sort theo ngày cho sự kiện */}
          <MenuItem value="date-asc">Date (Soonest → Latest)</MenuItem>
          <MenuItem value="date-desc">Date (Latest → Soonest)</MenuItem>
        </Select>
      </Box>

      {/* Hàng dưới: Phòng ban | Loại sự kiện | Khoảng ngày */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
      >
        {/* Phòng ban (multi) */}
        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel id="dept-label">Phòng ban</InputLabel>
          <Select
            multiple
            labelId="dept-label"
            value={filters.departments ?? []}
            onChange={handleDeptChange}
            input={<OutlinedInput label="Phòng ban" />}
            renderValue={(selected) =>
              (selected ?? []).length ? selected.join(', ') : 'Tất cả'
            }
          >
            {departments.map((d) => (
              <MenuItem key={d} value={d}>
                <Checkbox
                  checked={(filters.departments ?? []).indexOf(d) > -1}
                />
                <ListItemText primary={d} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Loại sự kiện (multi) */}
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel id="type-label">Loại sự kiện</InputLabel>
          <Select
            multiple
            labelId="type-label"
            value={filters.eventTypes ?? []}
            onChange={handleTypeChange}
            input={<OutlinedInput label="Loại sự kiện" />}
            renderValue={(selected) =>
              (selected ?? []).length ? selected.join(', ') : 'Tất cả'
            }
          >
            {eventTypes.map((t) => (
              <MenuItem key={t} value={t}>
                <Checkbox
                  checked={(filters.eventTypes ?? []).indexOf(t) > -1}
                />
                <ListItemText primary={t} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Phạm vi ngày */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flexWrap: 'wrap' }}
        >
          <TextField
            label="Từ ngày"
            type="date"
            size="small"
            value={filters.dateFrom ?? ''}
            onChange={handleFromChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Đến ngày"
            type="date"
            size="small"
            value={filters.dateTo ?? ''}
            onChange={handleToChange}
            InputLabelProps={{ shrink: true }}
          />
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" onClick={handleQuickWeek}>
              Tuần này
            </Button>
            <Button variant="outlined" size="small" onClick={handleQuickMonth}>
              Tháng này
            </Button>
            <Button variant="text" size="small" onClick={handleClearDates}>
              Xoá ngày
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProductFilter;
