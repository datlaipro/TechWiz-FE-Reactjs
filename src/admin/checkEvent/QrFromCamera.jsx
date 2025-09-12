import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

export default function QrFromCamera({ onResult }) {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | running | stopped
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, []);

  const start = async () => {
    try {
      setError("");
      const videoElem = videoRef.current;
      if (!videoElem) return;
      // Khởi tạo scanner
      const scanner = new QrScanner(
        videoElem,
        (res) => {
          const text = typeof res === "string" ? res : res.data;
          onResult?.(text);
        },
        {
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 8,
        }
      );
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
    } catch (e) {
      // ignore
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 12 }}>
      <h3>Quét QR bằng Camera</h3>
      <div style={{ position: "relative" }}>
        <video
          ref={videoRef}
          style={{
            width: "100%",
            borderRadius: 12,
            background: "#000",
          }}
          muted
          playsInline
        />
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <button onClick={start} disabled={status === "running"}>
          Bắt đầu
        </button>
        <button onClick={stop} disabled={status !== "running"}>
          Dừng
        </button>
      </div>
      {error && <p style={{ color: "crimson" }}>Lỗi: {error}</p>}
      <small>
        Mẹo: Dùng camera sau (điện thoại) hoặc đưa QR gần hơn / sáng hơn nếu khó
        quét.
      </small>
    </div>
  );
}
