"use client";

import { useEffect, useRef, useState, useCallback, FormEvent, KeyboardEvent } from "react";
import { useAuth } from "@/store/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";
import { getEcho } from "@/lib/echo";
import { getPersianErrorMessage } from "@/lib/errorMapper";
import { ChatMessageItem } from "@/types/chat";

interface ChatBoxProps {
  conversationId: number | null;
  isAdmin?: boolean;
  onStatusChange?: (status: string) => void;
  onError?: (msg: string) => void;
  onConversationCreated?: (id: number) => void;
}

export default function ChatBox({
  conversationId: initialConvId,
  isAdmin = false,
  onStatusChange,
  onError,
  onConversationCreated,
}: ChatBoxProps) {
  const { user } = useAuth();
  const [conversationId, setConversationId] = useState<number | null>(initialConvId);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("open");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const knownMessageIds = useRef<Set<number>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // auto-sync textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  // sync conversationId if updated from outside
  useEffect(() => {
    setConversationId(initialConvId);
  }, [initialConvId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addMessage = useCallback((message: ChatMessageItem) => {
    if (!message || !message.id) return;
    if (knownMessageIds.current.has(message.id)) return;
    knownMessageIds.current.add(message.id);
    setMessages((prev) => [...prev, message]);
  }, []);

  // fetch conversation history
  const fetchConversation = useCallback(async () => {
    if (!conversationId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const endpoint = isAdmin ? `/admin/chats/${conversationId}` : "/chat/conversation";
      const res = await axiosInstance.get(endpoint, {
        validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
      });

      if (res.status === 404) {
        setConversationId(null);
        setMessages([]);
        return;
      }

      const data = res.data;
      const fetchedMessages: ChatMessageItem[] = data.messages || [];
      knownMessageIds.current = new Set(fetchedMessages.map((m) => m.id));
      setMessages(fetchedMessages);
      if (data.status) {
        setStatus(data.status);
        onStatusChange?.(data.status);
      }
    } catch (error) {
      const errMsg = getPersianErrorMessage(error, "خطا در دریافت گفتگو.");
      onError ? onError(errMsg) : console.error(errMsg);
    } finally {
      setLoading(false);
    }
  }, [conversationId, isAdmin, onStatusChange, onError]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // connect to websocket to receive live messages
  useEffect(() => {
    if (!conversationId) return;
    const echo = getEcho();
    if (!echo) return;

    const channelName = `chat.${conversationId}`;
    const channel = echo.private(channelName);

    const handleIncomingMessage = (payload: any) => {
      const incomingMessage: ChatMessageItem = payload?.message || payload;
      addMessage(incomingMessage);
    };

    channel.listen(".chat.message", handleIncomingMessage);
    channel.listen("chat.message", handleIncomingMessage);

    return () => {
      echo.leave(channelName);
    };
  }, [conversationId, addMessage]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      const endpoint = isAdmin 
        ? `/admin/chats/${conversationId}/messages` 
        : "/chat/messages";
      
      const payload = { message: trimmed };
      const res = await axiosInstance.post(endpoint, payload);
      const newMessage = res.data.message;
      const newConvId = res.data.conversation_id || res.data.id;
      if (newConvId && !conversationId) {
        setConversationId(newConvId);
        onConversationCreated?.(newConvId);
      }

      if (newMessage) {
        addMessage(newMessage);
      }

      if (!conversationId && newConvId) {
        setConversationId(newConvId);
      }

      setText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      const errMsg = getPersianErrorMessage(error, "ارسال پیام با خطا مواجه شد.");
      onError ? onError(errMsg) : console.error(errMsg);
    } finally {
      setSending(false);
    }
  };

  // send with "Enter" and go to a new line with "Shift + Enter"
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-dark-900">
      {/* messages body */}
      <div className="flex-1 overflow-y-auto bg-custom-gray-100/30 pr-3 pl-2 ml-0.5 py-4 dark:bg-dark-900 scrollbar">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <span className="size-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-gray-400">
            هنوز پیامی رد و بدل نشده است. اولین پیام را ارسال کنید.
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            {messages.map((message) => {
              const isOwn = message.user_id === user?.id;

              return (
                <div key={message.id} className={`flex ${isOwn ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs leading-6 shadow-sm ${
                      isOwn
                        ? "rounded-br-md bg-violet-600 text-white"
                        : "rounded-bl-md bg-white text-gray-700 dark:bg-ui-blue-800 dark:text-gray-200"
                    }`}
                  >
                    {!isOwn && (
                      <p className="mb-1 text-[10px] font-bold text-violet-500 dark:text-violet-400">
                        {message.user?.name || (isAdmin ? "کاربر" : "پشتیبانی")}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap break-words">{message.message}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* send message form */}
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-end justify-between gap-2 border-t border-gray-100 bg-white p-3 dark:border-white/10 dark:bg-dark-900"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isAdmin ? "پاسخ خود را بنویسید..." : "پیام خود را بنویسید..."}
          className="max-h-[120px]! min-h-[40px]! flex-1 resize-none! rounded-xl! border! border-gray-200! bg-gray-50! px-3! py-2.5! text-xs leading-5 transition focus:border-violet-400! dark:border-white/10! dark:bg-white/5! dark:text-white! [&::-webkit-scrollbar]:hidden! [-ms-overflow-style:none]! [scrollbar-width:none]!"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 disabled:opacity-50"
        >
          <svg viewBox="0 0 24 24" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
          </svg>
        </button>
      </form>
    </div>
  );
}