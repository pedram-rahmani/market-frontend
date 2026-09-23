"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEcho } from "@/lib/echo";
import { useAuth } from "@/store/hooks/useAuth";

interface ChatToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
  conversationId: number | null;
}

export default function ChatToggleButton({ isOpen, onClick, conversationId }: ChatToggleButtonProps) {
  const { user, isLoggedIn } = useAuth();
  const [hasUnread, setHasUnread] = useState(false);
  const router = useRouter();

  // بررسی نقش کاربر با احتیاط کامل از خطاهای تایپ‌اسکریپت
  const userRole = typeof user?.role === "string" ? user.role : "";
  const isAdminOrStaff = userRole === "admin" || userRole === "co-admin";

  // notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio("https://cdn.freesound.org/previews/536/536108_11861866-lq.mp3");
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch {
      // error
    }
  };

  // listen to websocket for new messages
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const echo = getEcho();
    if (!echo) return;

    const channelName = isAdminOrStaff ? "staff-chats" : (conversationId ? `chat.${conversationId}` : null);
    if (!channelName) return;

    const channel = echo.private(channelName);

    const handleIncomingMessage = (payload: any) => {
      const incoming = payload?.message || payload;
      const senderId = incoming?.user_id;
      
      // if the message is not from the user themselves, trigger the notification
      if (senderId && senderId !== user.id && !isOpen) {
        setHasUnread(true);
        playNotificationSound();
      }
    };

    channel.listen(".chat.message", handleIncomingMessage);
    channel.listen("chat.message", handleIncomingMessage);

    return () => {
      echo.leave(channelName);
    };
  }, [isLoggedIn, user, conversationId, isOpen, isAdminOrStaff]);

  // handle click on the floating button
  const handleClick = () => {
    if (isAdminOrStaff) {
      setHasUnread(false);
      router.push("/my-account/chat-management");
    } else {
      if (!isOpen) {
        setHasUnread(false);
      }
      onClick();
    }
  };

  if (!isLoggedIn) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="گفتگوی پشتیبانی"
      className="fixed bottom-20 left-4 z-45 flex size-14 items-center justify-center rounded-full bg-linear-to-br from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-600/40 transition-transform hover:scale-105 md:bottom-6"
    >
      {/* unread message indicator */}
      {hasUnread && (
        <span className="absolute -top-1 -right-1 flex size-5! items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse dark:ring-dark-900" />
      )}

      {isOpen && !isAdminOrStaff ? (
        <svg viewBox="0 0 24 24" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-7!">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
      )}
    </button>
  );
}