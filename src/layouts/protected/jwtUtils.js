// xử lý và phân tích token JWT (JSON Web Token) được trả về từ backend

export const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };
  
  export const getEmailFromToken = (token) => {
    const payload = parseJwt(token);
    return payload ? payload.sub : null;
  };
  
  export const getRolesFromToken = (token) => {
    const payload = parseJwt(token);
    return payload ? payload.roles : null;
  };
  
  export const isTokenExpired = (token) => {
    const payload = parseJwt(token);
    if (!payload) return true;
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  };