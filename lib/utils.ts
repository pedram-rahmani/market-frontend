//pics paths management
export const getImagePath = (path: string | null) => {
  if (!path) return "/fallback.jpg";
  if (path.startsWith("http")) return path;

  const baseUrl = "http://127.0.0.1:8000";

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return `${baseUrl}/storage/${cleanPath}`;
};

//numbers formatting to Persian with thousand separators
export const e2f = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined || num === "") return "۰";

  // change to number if it's a string, and handle non-numeric strings
  const value = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(value)) return "۰";

  // persian formatting with thousand separators
  return value.toLocaleString("fa-IR");
};
