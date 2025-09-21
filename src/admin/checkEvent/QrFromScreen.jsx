import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import readAuth from "../auth/getToken";
/** JWT từ localStorage */

/** Rút {token, eventId} từ nội dung QR (URL/JSON/kv/path) */
function parseTokenAndEventId(qrText) {
  const text = (qrText || "").trim();

  // URL
  try {
    const u = new URL(text);
    const token = u.searchParams.get("token") || u.searchParams.get("t");
    const eid =
      u.searchParams.get("eventId") ||
      u.searchParams.get("eid") ||
      u.searchParams.get("event");
    if (token && eid) {
      return { token: token.trim(), eventId: Number(eid) };
    }
    const m = u.pathname.match(/\/events\/(\d+)/i);
    if (token && m?.[1]) return { token: token.trim(), eventId: Number(m[1]) };
  } catch {}

  // JSON
  try {
    const obj = JSON.parse(text);
    if (obj?.token && (obj.eventId || obj.eid)) {
      return {
        token: String(obj.token).trim(),
        eventId: Number(obj.eventId || obj.eid),
      };
    }
  } catch {}

  // k/v
  {
    const kv = Object.fromEntries(
      text
        .split(/[;,&#\s]+/)
        .map((pair) => pair.split(/[:=]/).map((s) => s.trim()))
        .filter((arr) => arr.length === 2 && arr[0])
    );
    const token = kv.token || kv.t;
    const eid = kv.eventId || kv.eid || kv.event;
    if (token && eid) return { token: token.trim(), eventId: Number(eid) };
  }

  // path
  {
    const m = text.match(/\/events\/(\d+)/i);
    const tkMatch = text.match(/(?:^|[?&#;,:\s])token[:=]([A-Za-z0-9._\-]+)/i);
    if (m?.[1] && tkMatch?.[1]) {
      return { token: tkMatch[1].trim(), eventId: Number(m[1]) };
    }
  }

  return { token: text || null, eventId: null };
}

export default function QrFromImage({ onResult }) {
  const imgRef = useRef(null);
  const [fileUrl, setFileUrl] = useState("");
  const [selecting, setSelecting] = useState(false);
  const [rect, setRect] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const onPickFile = (e) => {
    setError("");
    setRect(null);
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileUrl(url);
  };

  // Kéo chọn
  const onMouseDown = (e) => {
    if (!imgRef.current) return;
    const box = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX - box.left;
    const startY = e.clientY - box.top;
    setSelecting(true);
    setRect({ x: startX, y: startY, w: 0, h: 0 });
  };
  const onMouseMove = (e) => {
    if (!selecting || !rect) return;
    const box = e.currentTarget.getBoundingClientRect();
    const curX = e.clientX - box.left;
    const curY = e.clientY - box.top;
    setRect((r) => ({ ...r, w: curX - r.x, h: curY - r.y }));
  };
  const onMouseUp = () => setSelecting(false);
  const resetSelection = () => setRect(null);

  async function decodeFromImageOrCrop() {
    const img = imgRef.current;
    if (!img || !fileUrl) throw new Error("Hãy chọn một ảnh trước đã.");

    const hasRect = rect && Math.abs(rect.w) > 4 && Math.abs(rect.h) > 4;
    if (!hasRect) {
      const result = await QrScanner.scanImage(img);
      return typeof result === "string" ? result : result?.data;
    }

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const display = img.getBoundingClientRect();
    const scaleX = iw / display.width;
    const scaleY = ih / display.height;

    const rx = rect.w < 0 ? rect.x + rect.w : rect.x;
    const ry = rect.h < 0 ? rect.y + rect.h : rect.y;
    const rw = Math.abs(rect.w);
    const rh = Math.abs(rect.h);

    const sx = Math.max(0, Math.floor(rx * scaleX));
    const sy = Math.max(0, Math.floor(ry * scaleY));
    const sw = Math.max(1, Math.floor(rw * scaleX));
    const sh = Math.max(1, Math.floor(rh * scaleY));

    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

    const result = await QrScanner.scanImage(canvas);
    return typeof result === "string" ? result : result?.data;
  }
  const captureDecodeAndRedeem = async () => {
    try {
      setError("");
      setLoading(true);

      const qrText = await decodeFromImageOrCrop();
      if (!qrText) throw new Error("Không phát hiện QR trong ảnh.");

      // ✅ Gửi NGUYÊN CHUỖI QR cho BE (BE sẽ tự parse token/eventId từ payload)
      // Nếu FE parse được eventId thì gửi kèm để BE cross-check (tùy backend).
      const { eventId } = parseTokenAndEventId(qrText);

      const { token: jwt } = readAuth();

      const resp = await fetch("http://localhost:6868/api/qr/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },

        body: JSON.stringify(
          eventId != null && !Number.isNaN(Number(eventId))
            ? { token: qrText, eventId: Number(eventId) } // QR có E:<id> → gửi kèm
            : { token: qrText } // QR không có E:<id> → chỉ gửi token/payload
        ),
      });

      let data = null;
      try {
        data = await resp.json();
      } catch {}

      if (!resp.ok || (data && data.success === false)) {
        const msg =
          (data && (data.message || data.error || data.detail)) ||
          `Redeem thất bại (HTTP ${resp.status})`;
        throw new Error(msg);
      }

      const textSummary = data
        ? `✅ Redeem OK • eventId=${data.eventId} • studentId=${
            data.studentId
          } • message=${data.message || "OK"}`
        : "✅ Redeem OK";
      onResult?.(textSummary);
    } catch (e) {
      setError(
        e?.message ||
          "Không phát hiện được QR hoặc redeem thất bại. Hãy thử khoanh sát hơn / chọn ảnh rõ nét."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 12 }}>
      <h3>
        Chọn ảnh & (tuỳ chọn) khoanh vùng để QUÉT + REDEEM (tự lấy eventId)
      </h3>

      <div
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}
      >
        <input type="file" accept="image/*" onChange={onPickFile} />
        <button onClick={captureDecodeAndRedeem} disabled={!fileUrl || loading}>
          {loading ? "Đang quét & redeem..." : "Quét & Redeem"}
        </button>
        <button onClick={resetSelection} disabled={!rect || loading}>
          Bỏ chọn vùng
        </button>
      </div>

      <div
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          background: "#000",
          minHeight: 200,
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {fileUrl ? (
          <img
            ref={imgRef}
            src={fileUrl}
            alt="preview"
            style={{ width: "100%", display: "block", userSelect: "none" }}
            draggable={false}
          />
        ) : (
          <div style={{ color: "#999", padding: 24, textAlign: "center" }}>
            Chưa có ảnh — hãy chọn một file ảnh chứa QR để quét.
          </div>
        )}

        {rect && (
          <div
            style={{
              position: "absolute",
              left: Math.min(rect.x, rect.x + rect.w),
              top: Math.min(rect.y, rect.y + rect.h),
              width: Math.abs(rect.w),
              height: Math.abs(rect.h),
              border: "2px solid #4caf50",
              boxShadow: "0 0 0 9999px rgba(0,0,0,.25) inset",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {error && <p style={{ color: "crimson", marginTop: 8 }}>Lỗi: {error}</p>}
      <small>
        QR nên có <code>token</code> và <code>eventId</code> (vd:
        <code>?token=...&eventId=9</code> / JSON{" "}
        <code>{"{token,eventId}"}</code> / chuỗi
        <code>token=...,eventId=9</code>).
      </small>
    </div>
  );
}
