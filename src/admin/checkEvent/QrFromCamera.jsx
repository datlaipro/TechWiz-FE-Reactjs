import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import readAuth from "../auth/getToken";

/** Cố gắng rút { token, eventId } từ nhiều định dạng khác nhau */
function parseTokenAndEventId(qrText) {
  const text = (qrText || "").trim();

  // 0) Dạng payload mới: T:<token>|E:<eventId>|S:<studentId>
  if (text.startsWith("T:")) {
    try {
      const parts = text.split("|");
      let token = null;
      let eventId = null;
      for (const p of parts) {
        const idx = p.indexOf(":");
        if (idx > 0) {
          const k = p.slice(0, idx).trim();
          const v = p.slice(idx + 1).trim();
          if (k === "T") token = v;
          if (k === "E") eventId = Number(v);
        }
      }
      if (token) return { token, eventId: Number.isFinite(eventId) ? eventId : null };
    } catch {
      /* ignore */
    }
  }

  // 1) URL có query
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
    // nếu không có query đầy đủ, thử bắt từ path /events/{id}
    const m = u.pathname.match(/\/events\/(\d+)/i);
    if (token && m?.[1]) return { token: token.trim(), eventId: Number(m[1]) };
  } catch {
    // not a URL
  }

  // 2) JSON
  try {
    const obj = JSON.parse(text);
    if (obj?.token && (obj.eventId || obj.eid)) {
      return { token: String(obj.token).trim(), eventId: Number(obj.eventId || obj.eid) };
    }
  } catch {
    // not JSON
  }

  // 3) Chuỗi k/v: token=...,eventId=... hoặc token:..., eventId:...
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

  // 4) Path /events/{id} ở chuỗi thường + token=...
  {
    const m = text.match(/\/events\/(\d+)/i);
    const tkMatch = text.match(/(?:^|[?&#;,:\s])token[:=]([A-Za-z0-9._\-]+)/i);
    if (m?.[1] && tkMatch?.[1]) {
      return { token: tkMatch[1].trim(), eventId: Number(m[1]) };
    }
  }

  // 5) Không tách được eventId — vẫn trả token nếu thấy
  const maybeToken = text || null;
  return { token: maybeToken, eventId: null };
}

export default function QrFromCamera({ onResult }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | running | stopped
  const [error, setError] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    return () => {
      try {
        scannerRef.current?.stop();
        scannerRef.current?.destroy();
      } finally {
        scannerRef.current = null;
      }
    };
  }, []);

  const redeemToken = async (rawQrText, eventIdNumber) => {
    const { token: jwt } = readAuth();
    const body =
      eventIdNumber != null && !Number.isNaN(Number(eventIdNumber))
        ? { token: rawQrText, eventId: Number(eventIdNumber) } // gửi kèm eventId nếu parse được
        : { token: rawQrText }; // không có eventId vẫn gửi được (BE sẽ tự xử lý/đối chiếu)

    const resp = await fetch("http://localhost:6868/api/qr/redeem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      },
      body: JSON.stringify(body),
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
    return data;
  };

  const onScan = async (res) => {
    if (redeeming) return;
    const rawText = typeof res === "string" ? res : res?.data;
    if (!rawText) return;

    // Không bắt buộc eventId nữa: gửi nguyên chuỗi QR cho BE
    const { eventId } = parseTokenAndEventId(rawText);

    try {
      setError("");
      setRedeeming(true);
      await scannerRef.current?.pause?.();

      const data = await redeemToken(rawText, eventId);
      const summary = data
        ? `✅ Redeem OK • eventId=${data.eventId} • studentId=${data.studentId} • message=${data.message || "OK"}`
        : "✅ Redeem OK";
      onResult?.(summary);
    } catch (e) {
      setError(e?.message || "Redeem thất bại.");
    } finally {
      setRedeeming(false);
      if (status === "running") {
        try {
          await scannerRef.current?.resume?.();
        } catch {}
      }
    }
  };

  const start = async () => {
    try {
      setError("");
      const videoElem = videoRef.current;
      if (!videoElem) return;

      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
          scannerRef.current.destroy();
        } catch {}
        scannerRef.current = null;
      }

      const scanner = new QrScanner(videoElem, onScan, {
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 8,
      });
      scannerRef.current = scanner;
      await scanner.start();
      setStatus("running");
    } catch (e) {
      setError(e?.message || String(e));
      setStatus("idle");
    }
  };

  const stop = async () => {
    try {
      await scannerRef.current?.stop();
      setStatus("stopped");
    } catch {}
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 12 }}>
      <h3>Quét & Redeem QR bằng Camera (gửi nguyên chuỗi QR cho BE)</h3>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <button onClick={start} disabled={status === "running"}>
          {status === "running" ? "Đang chạy..." : "Bắt đầu"}
        </button>
        <button onClick={stop} disabled={status !== "running"}>
          Dừng
        </button>
      </div>

      <div style={{ position: "relative" }}>
        <video
          ref={videoRef}
          style={{ width: "100%", borderRadius: 12, background: "#000" }}
          muted
          playsInline
        />
        {redeeming && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 12,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Đang redeem...
          </div>
        )}
      </div>

      {error && <p style={{ color: "crimson", marginTop: 8 }}>Lỗi: {error}</p>}
      <small>
        Hỗ trợ nhiều định dạng QR:
        <ul style={{ marginTop: 6 }}>
          <li><code>T:&lt;token&gt;|E:&lt;eventId&gt;|S:&lt;studentId&gt;</code> (khuyến nghị)</li>
          <li>URL: <code>?token=...&amp;eventId=9</code></li>
          <li>JSON: <code>{"{token,eventId}"}</code></li>
          <li>KV: <code>token=...,eventId=9</code></li>
        </ul>
        FE sẽ gửi nguyên chuỗi QR lên BE; nếu tách được <code>eventId</code> thì gửi kèm.
      </small>
    </div>
  );
}
