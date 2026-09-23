"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axiosInstance from "@/lib/axiosInstance";
import { getPersianErrorMessage } from "@/lib/errorMapper";
import ChatBox from "./ChatBox";
import { Conversation } from "@/types/chat";

interface AdminChatDetailsProps {
  isOpen: boolean;
  conversationId: number | null;
  onClose: () => void;
  onUpdated: (conversation: { id: number; status: string }) => void;
  onError: (message: string) => void;
}

export default function AdminChatDetails({
  isOpen,
  conversationId,
  onClose,
  onUpdated,
  onError,
}: AdminChatDetailsProps) {
  const [mounted, setMounted] = useState(false);
  const [conversationInfo, setConversationInfo] = useState<Conversation | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => setMounted(true), []);

  // Fetch initial conversation info
  useEffect(() => {
    if (isOpen && conversationId) {
      axiosInstance
        .get(`/admin/chats/${conversationId}`)
        .then((res) => {
          setConversationInfo(res.data);
          onUpdated({ id: res.data.id, status: res.data.status });
        })
        .catch((error) => {
          onError(getPersianErrorMessage(error, "خطا در دریافت اطلاعات گفتگو."));
        });
    } else {
      setConversationInfo(null);
    }
  }, [isOpen, conversationId]);

  const handleToggleStatus = async () => {
    if (!conversationInfo) return;
    const nextStatus = conversationInfo.status === "open" ? "closed" : "open";
    setUpdatingStatus(true);
    try {
      const res = await axiosInstance.patch(`/admin/chats/${conversationInfo.id}/status`, {
        status: nextStatus,
      });
      const updatedStatus = res.data.conversation.status;
      setConversationInfo((prev) => (prev ? { ...prev, status: updatedStatus } : prev));
      onUpdated({ id: conversationInfo.id, status: updatedStatus });
    } catch (error) {
      onError(getPersianErrorMessage(error, "خطا در تغییر وضعیت گفتگو."));
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-65 flex items-center justify-center bg-black/50 p-0 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full flex-col bg-white dark:bg-dark-900 sm:h-144 sm:max-w-xl sm:rounded-3xl sm:shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-100! p-4 dark:border-white/10">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-800 dark:text-white">
              {conversationInfo?.user
                ? `${conversationInfo.user.name} (${conversationInfo.user.username})`
                : "در حال بارگذاری..."}
            </p>
            <p className="text-[11px] text-gray-400">گفتگوی پشتیبانی (پنل ادمین)</p>
          </div>

          <div className="flex items-center gap-2">
            {conversationInfo && (
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={updatingStatus}
                className={`rounded-xl px-3 py-1.5 text-[11px] font-bold transition disabled:opacity-50 ${
                  conversationInfo.status === "open"
                    ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-white/10"
                }`}
              >
                {updatingStatus ? "..." : conversationInfo.status === "open" ? "باز" : "بسته شده"}
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

        {/* Chat Box Body */}
        <div className="flex-1 overflow-hidden">
          <ChatBox
            conversationId={conversationId}
            isAdmin={true}
            onError={onError}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}