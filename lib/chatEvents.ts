// نام رویداد سراسری برای باز کردن ویجت چت لایو از هر جای دیگر برنامه
export const OPEN_LIVE_CHAT_EVENT = "open-live-chat";

export function openLiveChat() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(OPEN_LIVE_CHAT_EVENT));
  }
}
