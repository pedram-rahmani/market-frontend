export const normalizeText = (str: string): string => {
  return str
    .trim()
    .toLowerCase()
    .replace(/\u200c/g, "")
    .replace(/[كی]/g, (match) => (match === "ك" ? "ک" : "ی"))
    .replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, "");
};