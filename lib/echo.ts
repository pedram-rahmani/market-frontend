"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axiosInstance from "@/lib/axiosInstance";

interface ChannelAuthData {
  auth: string;
  channel_data?: string;
  shared_secret?: string;
}

declare global {
  interface Window {
    Pusher: typeof Pusher;
    PusherInstance?: Pusher;
  }
}

let echoInstance: Echo<"pusher"> | null = null;

export function getEcho(): Echo<"pusher"> | null {
  if (typeof window === "undefined") return null;

  if (echoInstance) return echoInstance;

  const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  if (!pusherKey) {
    console.warn("NEXT_PUBLIC_PUSHER_APP_KEY تنظیم نشده است؛ چت لایو غیرفعال است.");
    return null;
  }

  window.Pusher = Pusher;

  // فعال‌سازی لاگ برای دیباگ
  //Pusher.logToConsole = true;

  /*
    ========================================================================
    راهنمای تولید (Production / لیارا):
    هنگام انتشار روی سرور، این مقادیر را پویا کنید:
    const isProduction = process.env.NODE_ENV === "production";
    wsHost: isProduction ? "my-market-backend.liara.run" : "localhost",
    wsPort: isProduction ? 443 : 8080,
    forceTLS: isProduction,
    ========================================================================
  */

  echoInstance = new Echo({
    broadcaster: "pusher",
    key: pusherKey,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || "mt1",
    wsHost: "localhost",
    wsPort: 8080,
    // استفاده از پورت wsPort برای جلوگیری از تلاش برای اتصال به 443
    wssPort: 8080, 
    forceTLS: false,
    enabledTransports: ["ws", "wss"],
    authorizer: (channel: { name: string }) => ({
      authorize: (socketId: string, callback: (error: Error | null, data: ChannelAuthData | null) => void) => {
        axiosInstance
          .post("/broadcasting/auth", { socket_id: socketId, channel_name: channel.name })
          .then((response) => {
            callback(null, response.data);
          })
          .catch((error) => {
            console.error(`[Echo Auth Error] Failed to authorize for channel: ${channel.name}`, error);
            callback(error, null);
          });
      },
    }),
  });

  return echoInstance;
}

export function disconnectEcho() {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}