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
  }
}

let echoInstance: Echo<"pusher"> | null = null;

// یک نمونه‌ی Echo مشترک می‌سازد؛ چون اپ از Sanctum Token (نه کوکی) استفاده می‌کند،
// authorize کانال‌های خصوصی به‌جای cookie از axiosInstance (هدر Authorization) استفاده می‌کند.
export function getEcho(): Echo<"pusher"> | null {
  if (typeof window === "undefined") return null;

  if (echoInstance) return echoInstance;

  const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  if (!pusherKey) {
    console.warn("NEXT_PUBLIC_PUSHER_APP_KEY تنظیم نشده است؛ چت لایو غیرفعال است.");
    return null;
  }

  window.Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: "pusher",
    key: pusherKey,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER || "mt1",
    forceTLS: true,
    authorizer: (channel: { name: string }) => ({
      authorize: (socketId: string, callback: (error: Error | null, data: ChannelAuthData | null) => void) => {
        axiosInstance
          .post("/broadcasting/auth", { socket_id: socketId, channel_name: channel.name })
          .then((response) => callback(null, response.data))
          .catch((error) => callback(error, null));
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
