// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
// Backend Domain without /api 
export const BACKEND_DOMAIN = (
  process.env.NEXT_PUBLIC_ASSET_URL || API_BASE_URL.replace(/\/api\/?$/, "")
).replace(/\/$/, "");
export const FALLBACK_IMAGE_PATH = "/images/avatar-placeholder.png";

// pics paths management
export const getImagePath = (path: string | null, cacheKey?: string | number | null) => {
  if (!path) return FALLBACK_IMAGE_PATH;

  let cleanPath = path;
  if (path.startsWith("/images/")) {
    return cacheKey ? `${path}?v=${encodeURIComponent(String(cacheKey))}` : path;
  }

  if (/^https?:\/\//i.test(path)) {
    try {
      const urlObj = new URL(path);
      const pathname = urlObj.pathname
        .replace(/^\/api(?=\/)/i, "")
        .replace(/\/{2,}/g, "/");
        
      if (/^\/storage\//i.test(pathname)) {
        const query = cacheKey
          ? `${urlObj.search ? `${urlObj.search}&` : "?"}v=${encodeURIComponent(String(cacheKey))}`
          : urlObj.search;
        // Storage URLs can be persisted with the local development host.
        // Always serve backend storage from the configured deployment domain.
        return `${BACKEND_DOMAIN}${pathname}${query}${urlObj.hash}`;
      }

      cleanPath = pathname;
    } catch {
      cleanPath = path.replace(/^https?:\/\/[^\/]+/, "");
    }
  }

  cleanPath = cleanPath
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/^api\/+/i, "")
    .replace(/^storage\/+/i, "");

  const imageUrl = BACKEND_DOMAIN
    ? `${BACKEND_DOMAIN}/storage/${cleanPath}`
    : `/storage/${cleanPath}`;
  return cacheKey
    ? `${imageUrl}?v=${encodeURIComponent(String(cacheKey))}`
    : imageUrl;
};

// numbers formatting to Persian with thousand separators
export const e2f = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined || num === "") return "۰";
  const value = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(value)) return "۰";
  return value.toLocaleString("fa-IR");
};