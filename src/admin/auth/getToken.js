// src/auth/getToken.js
const STORAGE_KEY = "authState_v1";

function b64urlDecode(str) {
  try {
    const pad = (s) => s + "=".repeat((4 - (s.length % 4)) % 4);
    const b64 = pad(str.replace(/-/g, "+").replace(/_/g, "/"));
    return decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return "";
  }
}

export default function readAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, role: null, userId: null };

    const obj = JSON.parse(raw);
    const token = obj.accessToken || obj.token || obj.jwt || null;

    let role =
      obj.role ||
      (Array.isArray(obj.roles) ? obj.roles[0] : null) ||
      null;

    // cố gắng suy ra userId nếu object trong storage có sẵn
    let userId = obj.userId || obj.uid || obj.id || null;

    // fallback lấy từ JWT
    if (token && token.split(".").length === 3) {
      try {
        const payload = JSON.parse(b64urlDecode(token.split(".")[1]));

        if (!role) {
          role =
            payload.role ||
            (Array.isArray(payload.roles) ? payload.roles[0] : null) ||
            (Array.isArray(payload.authorities)
              ? payload.authorities[0]
              : null) ||
            null;
        }

        if (!userId) {
          // các key thường gặp trong JWT
          userId =
            payload.userId ??
            payload.user_id ??
            payload.uid ??
            payload.id ??
            payload.sub ??
            null;
        }

        // nếu userId là chuỗi số → convert number
        if (typeof userId === "string" && /^\d+$/.test(userId)) {
          userId = parseInt(userId, 10);
        }
      } catch {}
    }

    return { token, role, userId: userId ?? null };
  } catch {
    return { token: null, role: null, userId: null };
  }
}
