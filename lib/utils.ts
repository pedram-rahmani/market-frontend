// API Base URL management
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// pics paths management
export const getImagePath = (path: string | null) => {
  if (!path) return "/fallback.jpg";

  const rawBaseUrl = process.env.NEXT_PUBLIC_ASSET_URL || API_BASE_URL;
  
  const baseUrl = rawBaseUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

  let cleanPath = path;
  if (path.startsWith("http")) {
    try {
      const urlObj = new URL(path);
      cleanPath = urlObj.pathname;
    } catch (e) {
      cleanPath = path.replace(/^https?:\/\/[^\/]+/, "");
    }
  }

  cleanPath = cleanPath.replace(/^\/storage/, "").replace(/^\/api/, "");
  cleanPath = cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath;

  return baseUrl ? `${baseUrl}/storage/${cleanPath}` : `/storage/${cleanPath}`;
};

// numbers formatting to Persian with thousand separators
export const e2f = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined || num === "") return "۰";

  const value = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(value)) return "۰";

  return value.toLocaleString("fa-IR");
};