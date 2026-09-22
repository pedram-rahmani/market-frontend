"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/store/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";
import { getEcho } from "@/lib/echo";
import { OPEN_LIVE_CHAT_EVENT } from "@/lib/chatEvents";
import { getPersianErrorMessage } from "@/lib/errorMapper";

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

export default function ChatWidget() {
  const { user, isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasFetchedRef = useRef(false);
  const knownMessageIds = useRef<Set<number>>(new Set());

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addMessage = useCallback((message: ChatMessageItem) => {
    if (knownMessageIds.current.has(message.id)) return;
    knownMessageIds.current.add(message.id);
    setMessages((prev) => [...prev, message]);
  }, []);

  const fetchConversation = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await axiosInstance.get("/chat/conversation");
      const conversation = res.data;
      setConversationId(conversation.id);
      const fetchedMessages: ChatMessageItem[] = conversation.messages || [];
      knownMessageIds.current = new Set(fetchedMessages.map((m) => m.id));
      setMessages(fetchedMessages);
      setUnreadCount(0);
    } catch (error) {
      console.error("خطا در دریافت گفتگو:", error);
      setErrorMessage(getPersianErrorMessage(error, "خطا در دریافت گفتگو. لطفاً دوباره تلاش کنید."));
    } finally {
      setLoading(false);
    }
  }, []);

  // باز کردن ویجت از هر جای دیگر برنامه (مثلاً کارت داشبورد)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener(OPEN_LIVE_CHAT_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_LIVE_CHAT_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (isOpen && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchConversation();
    }
  }, [isOpen, fetchConversation]);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  // اشتراک در کانال خصوصی گفتگو برای دریافت پیام‌های لایو
  useEffect(() => {
    if (!isLoggedIn || !conversationId) return;

    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`chat.${conversationId}`);
    channel.listen(".chat.message", (payload: { message: ChatMessageItem; conversation_id: number }) => {
      const incoming = payload.message;
      const isOwnMessage = incoming.user_id === user?.id;
      addMessage(incoming);
      if (!isOwnMessage && !isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      echo.leave(`chat.${conversationId}`);
    };
  }, [isLoggedIn, conversationId, isOpen, user?.id, addMessage]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setErrorMessage("");
    try {
      const res = await axiosInstance.post("/chat/messages", { message: trimmed });
      addMessage(res.data.message);
      setText("");
    } catch (error) {
      setErrorMessage(getPersianErrorMessage(error, "ارسال پیام با خطا مواجه شد."));
    } finally {
      setSending(false);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <>
      {/* دکمه شناور چت */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="گفتگوی پشتیبانی"
        className="fixed bottom-20 left-4 z-40 flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-600/40 transition-transform hover:scale-105 md:bottom-6"
      >
        {unreadCount > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-dark-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        {isOpen ? (
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-dark-900 sm:bottom-24 sm:left-4 sm:right-auto sm:top-auto sm:h-[32rem] sm:w-96 sm:rounded-3xl sm:shadow-2xl sm:border sm:border-gray-100 sm:dark:border-white/10 sm:inset-auto">
          {/* هدر پنل */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-violet-600 px-4 py-3.5 text-white sm:rounded-t-3xl dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-white/15">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-bold">پشتیبانی آنلاین</p>
                <p className="text-[11px] text-white/70">معمولاً در چند دقیقه پاسخ داده می‌شود</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex size-8 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white"
              aria-label="بستن گفتگو"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* بدنه پیام‌ها */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 px-3 py-4 dark:bg-dark-900 [scrollbar-width:thin]">
            {loading ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <span className="size-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">در حال بارگذاری تاریخچه گفتگو...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-500 dark:bg-violet-500/10">
                  <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5a8.5 8.5 0 0 1 17 0v3.25a2.25 2.25 0 0 1-2.25 2.25H16l-3.2 3.2a1.125 1.125 0 0 1-1.925-.796V17H6.25A3.25 3.25 0 0 1 3 13.75V11.5Z" />
                  </svg>
                </span>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">گفتگویی شروع نشده است</p>
                <p className="text-xs text-gray-400">سوال یا مشکل خود را برای ما بنویسید تا در اسرع وقت پاسخ دهیم.</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.user_id === user?.id;
                return (
                  <div key={message.id} className={`flex ${isOwn ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs leading-6 shadow-sm ${
                        isOwn
                          ? "rounded-bl-md bg-white text-gray-700 dark:bg-ui-blue-800 dark:text-gray-200"
                          : "rounded-br-md bg-violet-600 text-white"
                      }`}
                    >
                      {!isOwn && (
                        <p className="mb-1 text-[10px] font-bold text-white/70">
                          {message.user?.name || "پشتیبانی"}
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

          {errorMessage && (
            <p className="border-t border-red-100 bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10">
              {errorMessage}
            </p>
          )}

          {/* فرم ارسال پیام */}
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
              placeholder="پیام خود را بنویسید..."
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={sending || loading || !text.trim()}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="ارسال پیام"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
