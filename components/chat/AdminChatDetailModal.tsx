"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axiosInstance from "@/lib/axiosInstance";
import { getPersianErrorMessage } from "@/lib/errorMapper";
import { getEcho } from "@/lib/echo";
import { useAuth } from "@/store/hooks/useAuth";

interface ChatUser {
  id: number;
  name: string;
  username?: string;
  role?: string;
}

interface ChatMessageItem {
  id: number;
  conversation_id: number;
  user_id: number;
  message: string;
  created_at: string;
  user?: ChatUser;
}

interface ConversationDetail {
  id: number;
  user_id: number;
  status: "open" | "closed";
  user?: ChatUser;
  messages: ChatMessageItem[];
}

interface AdminChatDetailModalProps {
  isOpen: boolean;
  conversationId: number | null;
  onClose: () => void;
  onUpdated: (conversation: { id: number; status: string }) => void;
  onError: (message: string) => void;
}

export default function AdminChatDetailModal({
  isOpen,
  conversationId,
  onClose,
  onUpdated,
  onError,
}: AdminChatDetailModalProps) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const knownMessageIds = useRef<Set<number>>(new Set());

  useEffect(() => setMounted(true), []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchConversation = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/admin/chats/${conversationId}`);
      setConversation(res.data);
      knownMessageIds.current = new Set((res.data.messages || []).map((m: ChatMessageItem) => m.id));
      onUpdated({ id: res.data.id, status: res.data.status });
    } catch (error) {
      onError(getPersianErrorMessage(error, "خطا در دریافت گفتگو."));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    if (isOpen && conversationId) {
      fetchConversation();
    } else {
      setConversation(null);
      setText("");
    }
  }, [isOpen, conversationId, fetchConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, scrollToBottom]);

  useEffect(() => {
    if (!isOpen || !conversationId) return;
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`chat.${conversationId}`);
    channel.listen(".chat.message", (payload: { message: ChatMessageItem }) => {
      if (knownMessageIds.current.has(payload.message.id)) return;
      knownMessageIds.current.add(payload.message.id);
      setConversation((prev) => (prev ? { ...prev, messages: [...prev.messages, payload.message] } : prev));
    });

    return () => {
      echo.leave(`chat.${conversationId}`);
    };
  }, [isOpen, conversationId]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !conversationId || sending) return;

    setSending(true);
    try {
      const res = await axiosInstance.post(`/admin/chats/${conversationId}/messages`, { message: trimmed });
      const message: ChatMessageItem = res.data.message;
      if (!knownMessageIds.current.has(message.id)) {
        knownMessageIds.current.add(message.id);
        setConversation((prev) => (prev ? { ...prev, messages: [...prev.messages, message] } : prev));
      }
      setText("");
    } catch (error) {
      onError(getPersianErrorMessage(error, "ارسال پاسخ با خطا مواجه شد."));
    } finally {
      setSending(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!conversation) return;
    const nextStatus = conversation.status === "open" ? "closed" : "open";
    setUpdatingStatus(true);
    try {
      const res = await axiosInstance.patch(`/admin/chats/${conversation.id}/status`, { status: nextStatus });
      setConversation((prev) => (prev ? { ...prev, status: res.data.conversation.status } : prev));
      onUpdated({ id: conversation.id, status: res.data.conversation.status });
    } catch (error) {
      onError(getPersianErrorMessage(error, "خطا در تغییر وضعیت گفتگو."));
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-0 backdrop-blur-sm sm:p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full flex-col bg-white dark:bg-dark-900 sm:h-[36rem] sm:max-w-xl sm:rounded-3xl sm:shadow-2xl"
      >
        {/* هدر */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-4 dark:border-white/10">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-800 dark:text-white">
              {conversation?.user ? `${conversation.user.name} (${conversation.user.username})` : "در حال بارگذاری..."}
            </p>
            <p className="text-[11px] text-gray-400">گفتگوی پشتیبانی</p>
          </div>
          <div className="flex items-center gap-2">
            {conversation && (
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={updatingStatus}
                className={`rounded-xl px-3 py-1.5 text-[11px] font-bold transition disabled:opacity-50 ${
                  conversation.status === "open"
                    ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-white/10"
                }`}
              >
                {updatingStatus ? "..." : conversation.status === "open" ? "باز" : "بسته شده"}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 dark:hover:bg-white/10"
              aria-label="بستن"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* بدنه پیام‌ها */}
        <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-dark-900 [scrollbar-width:thin]">
          {loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="size-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">در حال بارگذاری گفتگو...</p>
            </div>
          ) : !conversation || conversation.messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">پیامی برای نمایش وجود ندارد.</div>
          ) : (
            conversation.messages.map((message) => {
              const isStaff = message.user_id !== conversation.user_id;
              return (
                <div key={message.id} className={`flex ${isStaff ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs leading-6 shadow-sm ${
                      isStaff
                        ? "rounded-bl-md bg-violet-600 text-white"
                        : "rounded-br-md bg-white text-gray-700 dark:bg-ui-blue-800 dark:text-gray-200"
                    }`}
                  >
                    {isStaff && (
                      <p className="mb-1 text-[10px] font-bold text-white/70">
                        {message.user_id === user?.id ? "شما" : message.user?.name || "پشتیبانی"}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap break-words">{message.message}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* فرم پاسخ */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 border-t border-gray-100 bg-white p-3 dark:border-white/10 dark:bg-dark-900 sm:rounded-b-3xl"
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="پاسخ خود را بنویسید..."
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={sending || loading || !text.trim()}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="ارسال پاسخ"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
