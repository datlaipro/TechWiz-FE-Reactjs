import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

export default function QrFromScreen({ onResult }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [selecting, setSelecting] = useState(false);
  const [rect, setRect] = useState(null); // {x,y,w,h} theo px trên khung video (client)
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, []);

  const startCapture = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor", // user | window | monitor
          cursor: "always",
        },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();
    } catch (e) {
      setError(e?.message || String(e));
    }
  };

  const stopCapture = () => {
    try {
      streamRef.current?.getTracks()?.forEach((t) => t.stop());
      streamRef.current = null;
    } catch (e) {}
  };

  // Bắt đầu kéo chọn
  const onMouseDown = (e) => {
    if (!videoRef.current) return;
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
    setRect((r) => ({
      ...r,
      w: curX - r.x,
      h: curY - r.y,
    }));
  };

  const onMouseUp = () => setSelecting(false);

  const captureAndDecode = async () => {
    try {
      setError("");
      const video = videoRef.current;
      if (!video || !rect) return;

      // Kích thước thực của frame
      const vw = video.videoWidth;
      const vh = video.videoHeight;

      // Kích thước hiển thị (client) của thẻ video
      const display = video.getBoundingClientRect();
      const scaleX = vw / display.width;
      const scaleY = vh / display.height;

      // Chuẩn hóa rect (trường hợp kéo ngược)
      const rx = rect.w < 0 ? rect.x + rect.w : rect.x;
      const ry = rect.h < 0 ? rect.y + rect.h : rect.y;
      const rw = Math.abs(rect.w);
      const rh = Math.abs(rect.h);

      // Khu vực cần cắt trên hệ toạ độ video thực
      const sx = Math.max(0, Math.floor(rx * scaleX));
      const sy = Math.max(0, Math.floor(ry * scaleY));
      const sw = Math.max(1, Math.floor(rw * scaleX));
      const sh = Math.max(1, Math.floor(rh * scaleY));

      // Vẽ vào canvas
      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

      // Decode QR
      const result = await QrScanner.scanImage(canvas);
      const text = typeof result === "string" ? result : result.data;
      onResult?.(text);
    } catch (e) {
      setError("Không phát hiện được QR trong vùng đã khoanh. Thử khoanh sát hơn / phóng to QR.");
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 12 }}>
      <h3>Chụp màn hình + Khoanh vùng để quét QR</h3>

      <div
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          background: "#000",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <video
          ref={videoRef}
          style={{ width: "100%", display: "block" }}
          muted
          playsInline
        />
        {/* Khung chọn */}
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

      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={startCapture}>Chia sẻ màn hình</button>
        <button onClick={stopCapture}>Dừng chia sẻ</button>
        <button onClick={captureAndDecode}>Cắt & Quét QR</button>
      </div>

      <small>
        Mẹo: bật chia sẻ **Entire screen** rồi mở ảnh/web có QR; kéo chọn
        vùng QR càng sát càng tốt để tăng tỉ lệ nhận diện.
      </small>

      {error && <p style={{ color: "crimson" }}>Lỗi: {error}</p>}
    </div>
  );
}
