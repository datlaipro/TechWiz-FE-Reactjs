import React, { useState } from "react";
import QrFromCamera from "../checkEvent/QrFromCamera";
import QrFromScreen from "../checkEvent/QrFromCamera";

export default function QrKit() {
  const [lastResult, setLastResult] = useState("");

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2>QR Tools (Camera + Screen)</h2>

      <QrFromCamera onResult={(text) => setLastResult(text)} />
      <QrFromScreen onResult={(text) => setLastResult(text)} />

      <div style={{ marginTop: 8 }}>
        <h4>Kết quả gần nhất:</h4>
        <pre
          style={{
            background: "#f7f7f8",
            padding: 12,
            borderRadius: 8,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {lastResult || "Chưa có kết quả..."}
        </pre>
        {lastResult && (
          <div
            style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            <button onClick={() => navigator.clipboard.writeText(lastResult)}>
              Copy
            </button>
            {/^https?:\/\//i.test(lastResult) && (
              <a href={lastResult} target="_blank" rel="noreferrer">
                Mở link
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
