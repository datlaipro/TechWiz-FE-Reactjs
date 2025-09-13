import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import BreadcrumbsComponent from "../free/BreadcrumbsComponent";
import LatestPosts from "../post/LatestPosts";
import InstagramGallery from "../GroupItems/InstagramGallery";
import InfoProduct from "./InfoProduct";

import CalendarMonthRounded from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import PeopleAltRounded from "@mui/icons-material/PeopleAltRounded";

import readAuth from "../../../admin/auth/getToken";

const FallbackImg = "https://picsum.photos/seed/event/1280/720";
const REG_KEY = "registeredEvents_v1"; // lưu danh sách eventId đã đăng ký trong localStorage
const { token, role, userId } = readAuth();
const studentIdFromAuth = userId ?? null; // giả định userId == studentId khi là student

const authHeaders = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=UTF-8",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};
/* ===== Date helpers (local) ===== */

const makeRegKey = (eventId, studentId) =>
  `${String(eventId).trim()}|${String(studentId).trim()}`;
const parseRegKey = (k) => {
  const s = String(k ?? "").trim();
  if (!s) return { eventId: null, studentId: null };

  // dạng mới "ev|stu"
  if (s.includes("|") && !s.includes("|s=")) {
    const [ev, stu] = s.split("|");
    return { eventId: ev?.trim() || null, studentId: (stu ?? "").trim() || null };
  }

  // dạng cũ "ev|s=stu"
  if (s.includes("|s=")) {
    const [ev, sPart] = s.split("|s=");
    return { eventId: ev?.trim() || null, studentId: (sPart ?? "").trim() || null };
  }

  // legacy: chỉ có eventId
  return { eventId: s, studentId: null };
};


function buildLocalDate(dateStr, timeStr) {
  if (!dateStr) return null;
  try {
    const [y, m, d] = String(dateStr).split("-").map(Number);
    let hh = 0,
      mm = 0,
      ss = 0;
    if (timeStr) {
      const parts = String(timeStr).split(":").map(Number);
      hh = parts[0] ?? 0;
      mm = parts[1] ?? 0;
      ss = parts[2] ?? 0;
    }
    return new Date(y, (m || 1) - 1, d || 1, hh, mm, ss);
  } catch {
    return null;
  }
}
function getEventStart(ev) {
  return (
    buildLocalDate(ev?.startDate, ev?.time) ||
    buildLocalDate(ev?.date, ev?.time) ||
    buildLocalDate(ev?.startDate) ||
    buildLocalDate(ev?.date) ||
    null
  );
}
function getEventEnd(ev) {
  const start =
    buildLocalDate(ev?.startDate, ev?.time) ||
    buildLocalDate(ev?.date, ev?.time) ||
    buildLocalDate(ev?.startDate) ||
    buildLocalDate(ev?.date) ||
    null;

  if (ev?.endDate || ev?.endTime) {
    const endDateStr = ev?.endDate || ev?.startDate || ev?.date;
    const endTimeStr = ev?.endTime || (ev?.endDate ? "23:59:59" : ev?.time);
    return buildLocalDate(endDateStr, endTimeStr) || start;
  }

  if ((ev?.date || ev?.startDate) && !ev?.time && !ev?.endTime) {
    const d = ev?.date || ev?.startDate;
    return buildLocalDate(d, "23:59:59") || start;
  }
  return start;
}
function isEventOver(ev, now = new Date()) {
  const end = getEventEnd(ev);
  if (!end) return false;
  return now.getTime() > end.getTime();
}
function fmtDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("vi-VN");
  } catch {
    return d;
  }
}

/* ===== localStorage helpers ===== */
function loadRegisteredSet(currentStudentId = null) {
  try {
    const raw = localStorage.getItem(REG_KEY);
    const arr = raw ? JSON.parse(raw) : [];

    const out = new Set();
    let migrated = false;

    for (const k of arr) {
      const { eventId, studentId } = parseRegKey(k);
      if (!eventId) continue;

      if (studentId) {
        out.add(makeRegKey(eventId, studentId)); // normalize về "ev|stu"
        if (k.includes("|s=")) migrated = true;  // từ dạng s= -> mới
      } else if (currentStudentId != null) {
        // legacy -> gắn studentId hiện tại
        out.add(makeRegKey(eventId, currentStudentId));
        migrated = true;
      } else {
        // chưa biết studentId -> giữ tạm legacy, sẽ migrate khi biết
        out.add(String(eventId));
      }
    }

    if (migrated) saveRegisteredSet(out);
    return out;
  } catch {
    return new Set();
  }
}

function saveRegisteredSet(set) {
  try {
    localStorage.setItem(REG_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [registered, setRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  // function getNormToken(raw) {
  //   if (!raw) return null;
  //   let t = String(raw);

  //   // loại bỏ BOM/zero-width if any
  //   t = t.replace(/[\u200B-\u200D\uFEFF]/g, "");

  //   // bỏ tiền tố "Bearer "
  //   t = t.replace(/^Bearer\s+/i, "");

  //   // trim khoảng trắng 2 đầu
  //   t = t.trim();

  //   // gỡ lặp các cặp nháy hoặc backtick nếu bị bọc nhiều lớp
  //   while (
  //     (t.startsWith("'") && t.endsWith("'")) ||
  //     (t.startsWith('"') && t.endsWith('"')) ||
  //     (t.startsWith("`") && t.endsWith("`"))
  //   ) {
  //     t = t.slice(1, -1).trim();
  //   }

  //   return t;
  // }

  // function isJwtExpired(token) {
  //   try {
  //     const payload = JSON.parse(
  //       decodeURIComponent(
  //         atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
  //           .split("")
  //           .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
  //           .join("")
  //       )
  //     );
  //     return (payload?.exp ?? 0) * 1000 < Date.now() - 10_000; // lệch 10s
  //   } catch {
  //     return true;
  //   }
  // }

  // derive numeric/string eventId for API & localStorage key
const eventKey = useMemo(() => {
  const base = event?.eventId ?? event?.id ?? id;
  return base && studentIdFromAuth ? makeRegKey(base, studentIdFromAuth) : "";
}, [event, id, studentIdFromAuth]);


  useEffect(() => {
    fetch(`http://localhost:6868/api/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không tìm thấy sự kiện");
        return res.json();
      })
      .then((data) => {
        const startDate = data.startDate || data.date || null;
        const endDate = data.endDate || null;
        const timeRaw = data.time ? String(data.time) : null; // "06:00:00"
        const timeText =
          timeRaw && timeRaw.includes(":") ? timeRaw.slice(0, 5) : timeRaw;

        setEvent({
          id: data.eventId ?? data.id ?? id,
          eventId: data.eventId ?? data.id ?? id,
          title: data.title ?? data.name ?? "Sự kiện",
          description: data.description ?? "",
          category:
            typeof data.category === "string"
              ? data.category
              : data?.category?.name || data?.categoryName || "",
          startDate,
          endDate,
          time: timeText || null,
          endTime: data.endTime || null,
          date: data.date || null,
          venue: data.venue || "",
          location: data.location || data.venue || "",
          organizerId: data.organizerId,
          status: data.status || data.approval_status,
          totalSeats: data.totalSeats,
          mainImageUrl: data.mainImageUrl || FallbackImg,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Lỗi khi tải sự kiện");
        setLoading(false);
      });
  }, [id]);

  // mark registered from localStorage on load
  useEffect(() => {
  const s = loadRegisteredSet(studentIdFromAuth); // <— truyền studentId để migrate
  const base = event?.eventId ?? event?.id ?? id;
  const legacy = base ? String(base) : ""; // fallback lần đầu

  setRegistered(
    (!!eventKey && s.has(eventKey)) || (!!legacy && s.has(legacy))
  );
}, [eventKey, event, id, studentIdFromAuth]);


  const over = useMemo(() => (event ? isEventOver(event) : false), [event]);

  const handleRegister = async () => {
    if (!event) return;
    if (over || registered) return;

    setRegistering(true);
    try {
      const payload = { eventId: event.eventId ?? event.id };
      const res = await fetch("http://localhost:6868/api/registrations", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      // ====== THÀNH CÔNG: lấy eventId & studentId từ JSON BE ======
      if (res.ok) {
        let data = null;
        try {
          data = await res.json();
        } catch {}
        const evId = data?.eventId ?? event.eventId ?? event.id;
        const stId = data?.studentId ?? studentIdFromAuth; // fallback nếu BE không trả studentId
        const key = makeRegKey(evId, stId);

        const s = loadRegisteredSet();
        s.add(key);
        saveRegisteredSet(s);

        setRegistered(true);
        setToast({
          open: true,
          severity: "success",
          message: "Bạn đã đăng ký thành công!",
        });
        return;
      }

      // ====== ĐÃ ĐĂNG KÝ TRƯỚC (409): cũng cố gắng đọc JSON để lấy cặp ======
      if (res.status === 409) {
        let data = null;
        try {
          data = await res.json(); // nếu BE trả JSON với eventId, studentId
        } catch {}
        const evId = data?.eventId ?? event.eventId ?? event.id;
        const stId = data?.studentId ?? studentIdFromAuth;

        const key = makeRegKey(evId, stId);
        const s = loadRegisteredSet();
        s.add(key);
        saveRegisteredSet(s);

        setRegistered(true);
        setToast({
          open: true,
          severity: "info",
          message: "Bạn đã đăng ký sự kiện này trước đó.",
        });
        return;
      }

      // ====== 401/403 ======
      if (res.status === 401 || res.status === 403) {
        setToast({
          open: true,
          severity: "warning",
          message:
            "Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.",
        });
        return;
      }

      // ====== LỖI KHÁC ======
      let msg = "Đăng ký không thành công. Vui lòng thử lại.";
      try {
        const t = await res.text();
        if (t) msg = t;
      } catch {}
      setToast({ open: true, severity: "error", message: msg });
    } catch (e) {
      setToast({
        open: true,
        severity: "error",
        message: "Lỗi mạng. Vui lòng thử lại.",
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error || !event) {
    return (
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Typography color="error">
          {error || "Không tìm thấy sự kiện"}
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2, borderRadius: 1.5, textTransform: "none" }}
          onClick={() => navigate("/")}
        >
          Về trang chủ
        </Button>
      </Box>
    );
  }

  const { title, startDate, endDate, time, totalSeats, mainImageUrl } = event;
  const isDisabled = over || registered || registering;

  return (
    <>
      <BreadcrumbsComponent
        title="Detail"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "EventDetail" },
          { label: title },
        ]}
      />

      <Box
        sx={{
          maxWidth: 1300,
          mx: "auto",
          px: { xs: 1.5, md: 2 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
            bgcolor: "#1f2427",
            alignItems: "stretch",
          }}
        >
          {/* LEFT */}
          <Grid item xs={12} md={5} order={{ xs: 2, md: 1 }}>
            <Box sx={{ p: { xs: 2, md: 3 }, color: "#e6f3e6", minHeight: 200 }}>
              <Typography sx={{ opacity: 0.8 }}>
                Chi tiết sự kiện ở bên dưới.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "#22c55e",
                  color: "#0b2e13",
                  fontWeight: 800,
                  px: 2.6,
                  py: 1.1,
                  borderRadius: 1.5,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#16a34a" },
                }}
                disabled={isDisabled}
                onClick={handleRegister}
              >
                {over
                  ? "ĐÃ KẾT THÚC"
                  : registered
                  ? "ĐÃ ĐĂNG KÝ"
                  : registering
                  ? "ĐANG ĐĂNG KÝ..."
                  : "Register"}
              </Button>
            </Box>
          </Grid>

          {/* RIGHT: Poster + overlay */}
          <Grid
            item
            xs={12}
            md={7}
            order={{ xs: 1, md: 2 }}
            sx={{ position: "relative", bgcolor: "#0c0f12" }}
          >
            <Box
              component="img"
              src={mainImageUrl || FallbackImg}
              alt={title}
              onError={(e) => (e.currentTarget.src = FallbackImg)}
              sx={{
                width: "100%",
                height: "100%",
                minHeight: { xs: 260, sm: 340, md: 460 },
                objectFit: "cover",
                display: "block",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                left: { xs: 12, md: 18 },
                right: { xs: 12, md: 18 },
                bottom: { xs: 12, md: 18 },
                color: "white",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 18, md: 22 },
                  fontWeight: 800,
                  mb: 1,
                  textShadow: "0 2px 10px rgba(0,0,0,.6)",
                }}
              >
                {title}
              </Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  icon={<CalendarMonthRounded />}
                  label={
                    startDate && endDate
                      ? `${fmtDate(startDate)} – ${fmtDate(endDate)}`
                      : fmtDate(startDate) || "Ngày: TBA"
                  }
                  sx={{ bgcolor: "rgba(255,255,255,.15)", color: "white" }}
                />
                <Chip
                  icon={<AccessTimeRounded />}
                  label={time ? `Giờ: ${time}` : "Giờ: TBA"}
                  sx={{ bgcolor: "rgba(255,255,255,.15)", color: "white" }}
                />
                {typeof totalSeats === "number" && (
                  <Chip
                    icon={<PeopleAltRounded />}
                    label={`Chỗ ngồi: ${totalSeats}`}
                    sx={{ bgcolor: "rgba(255,255,255,.15)", color: "white" }}
                  />
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Truyền object event cho InfoProduct */}
      <InfoProduct event={event} />
      <LatestPosts />
      <InstagramGallery />

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductDetail;
