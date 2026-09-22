"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import EmptyState from "@/components/ui/emptyState/EmptyState";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import DeleteConfirmModal from "@/components/feedback/MessageModal/DeleteConfirmModal";
import AdminChatDetailModal from "@/components/chat/AdminChatDetailModal";
import axiosInstance from "@/lib/axiosInstance";
import { getPersianErrorMessage, SUCCESS_MESSAGES } from "@/lib/errorMapper";
import { usePermissions } from "@/store/hooks/usePermissions";
import { PERMISSIONS } from "@/types/permissions";
import { getEcho } from "@/lib/echo";
import useDate from "@/store/hooks/useDate";

interface ChatUser {
  id: number;
  name: string;
  username?: string;
}

interface LastMessage {
  id: number;
  message: string;
  user_id: number;
  created_at: string;
}

interface Conversation {
  id: number;
  user_id: number;
  status: "open" | "closed";
  last_message_at: string | null;
  user?: ChatUser;
  messages?: LastMessage[];
  unread_count?: number;
}

const statusTabs = [
  { value: "all", label: "همه" },
  { value: "open", label: "باز" },
  { value: "closed", label: "بسته شده" },
];

export default function ChatManagementContent() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { can } = usePermissions();

  const [popup, setPopup] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const showError = (message: string) => setPopup({ isOpen: true, message, type: "error" });

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/chats");
      setConversations(response.data || []);
    } catch (error) {
      // خطای دریافت لیست را فقط لاگ می‌کنیم؛ نمایش خالی بودن به عهده emptyState است
      console.error("خطا در دریافت گفتگوها:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // آپدیت لایو لیست گفتگوها هنگام رسیدن پیام یا تغییر وضعیت
  const selectedIdRef = useRef<number | null>(null);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private("staff-chats");

    channel.listen(".chat.conversation.updated", (payload: { conversation: Conversation }) => {
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === payload.conversation.id);
        const updated = exists
          ? prev.map((c) => (c.id === payload.conversation.id ? { ...c, ...payload.conversation } : c))
          : [payload.conversation, ...prev];
        return [...updated].sort((a, b) => {
          const at = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
          const bt = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
          return bt - at;
        });
      });
    });

    channel.listen(".chat.message", (payload: { message: LastMessage; conversation_id: number }) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== payload.conversation_id) return c;
          const isSelfConversation = selectedIdRef.current === c.id;
          return {
            ...c,
            messages: [payload.message],
            unread_count: isSelfConversation ? 0 : (c.unread_count || 0) + 1,
          };
        })
      );
    });

    return () => {
      echo.leave("staff-chats");
    };
  }, []);

  const counts = statusTabs.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.value] = tab.value === "all" ? conversations.length : conversations.filter((c) => c.status === tab.value).length;
    return acc;
  }, {});

  const visibleConversations = activeTab === "all" ? conversations : conversations.filter((c) => c.status === activeTab);

  const handleUpdated = (updated: { id: number; status: string }) => {
    setConversations((prev) => prev.map((c) => (c.id === updated.id ? { ...c, status: updated.status as Conversation["status"], unread_count: 0 } : c)));
  };

  const handleDeleteConfirm = async () => {
    if (!conversationToDelete) return;
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/admin/chats/${conversationToDelete.id}`);
      setConversations((prev) => prev.filter((c) => c.id !== conversationToDelete.id));
      setPopup({ isOpen: true, message: response.data.message || SUCCESS_MESSAGES.deleted, type: "success" });
      setConversationToDelete(null);
    } catch (error) {
      showError(getPersianErrorMessage(error, "خطا در حذف گفتگو."));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="مدیریت گفتگوهای پشتیبانی"
        description="به گفتگوهای لایو کاربران رسیدگی کنید و به آن‌ها پاسخ دهید."
        icon={
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5a8.5 8.5 0 0 1 17 0v3.25a2.25 2.25 0 0 1-2.25 2.25H16l-3.2 3.2a1.125 1.125 0 0 1-1.925-.796V17H6.25A3.25 3.25 0 0 1 3 13.75V11.5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h.01M12 11h.01M16 11h.01" />
          </svg>
        }
      />

      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === tab.value
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
            }`}
          >
            {tab.label}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${activeTab === tab.value ? "bg-white/20" : "bg-white dark:bg-white/10"}`}>
              {counts[tab.value] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-4 text-center dark:border-white/10 dark:bg-white/[0.03]">
          <span className="mb-3 size-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
          <p className="font-semibold text-gray-700 dark:text-gray-200">در حال دریافت گفتگوها...</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">لطفاً کمی صبر کنید.</p>
        </div>
      ) : visibleConversations.length === 0 ? (
        <EmptyState
          tone="violet"
          eyebrow="مدیریت گفتگوها"
          title="گفتگویی برای نمایش وجود ندارد"
          description="گفتگوهای لایو ثبت‌شده توسط کاربران در این بخش نمایش داده می‌شوند."
          icon={
            <svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5a8.5 8.5 0 0 1 17 0v3.25a2.25 2.25 0 0 1-2.25 2.25H16l-3.2 3.2a1.125 1.125 0 0 1-1.925-.796V17H6.25A3.25 3.25 0 0 1 3 13.75V11.5Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h.01M12 11h.01M16 11h.01" />
            </svg>
          }
        />
      ) : (
        <div className="space-y-3">
          {visibleConversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
              onClick={() => setSelectedId(conversation.id)}
              onDelete={can(PERMISSIONS.CHATS_DELETE) ? () => setConversationToDelete(conversation) : undefined}
            />
          ))}
        </div>
      )}

      <AdminChatDetailModal
        isOpen={selectedId !== null}
        conversationId={selectedId}
        onClose={() => setSelectedId(null)}
        onUpdated={handleUpdated}
        onError={showError}
      />

      <DeleteConfirmModal
        isOpen={!!conversationToDelete}
        onClose={() => { if (!isDeleting) setConversationToDelete(null); }}
        onConfirm={handleDeleteConfirm}
        title={conversationToDelete?.user ? `گفتگو با ${conversationToDelete.user.name}` : "این گفتگو"}
        isDeleting={isDeleting}
      />

      <SimplePopup
        isOpen={popup.isOpen}
        onClose={() => setPopup((prev) => ({ ...prev, isOpen: false }))}
        message={popup.message}
        type={popup.type}
      />
    </div>
  );
}

function ConversationCard({
  conversation,
  onClick,
  onDelete,
}: {
  conversation: Conversation;
  onClick: () => void;
  onDelete?: () => void;
}) {
  const lastMessage = conversation.messages?.[0];
  const dateLabel = useDate(conversation.last_message_at, "short");
  const hasUnread = (conversation.unread_count || 0) > 0;

  return (
    <div
      className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-all dark:bg-ui-blue-900 ${
        hasUnread
          ? "border-violet-200 border-r-4 border-r-violet-600 dark:border-violet-500/30"
          : "border-gray-100 border-r-4 border-r-gray-200 dark:border-white/5 dark:border-r-white/10"
      }`}
    >
      <button type="button" onClick={onClick} className="flex min-w-0 flex-1 items-center gap-3 text-right">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-bold text-gray-800 dark:text-white">
              {conversation.user ? `${conversation.user.name} (${conversation.user.username})` : "کاربر ناشناس"}
            </p>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                conversation.status === "open"
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                  : "bg-gray-100 text-gray-500 dark:bg-white/10"
              }`}
            >
              {conversation.status === "open" ? "باز" : "بسته شده"}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-gray-400">{lastMessage?.message || "پیامی ثبت نشده است"}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {hasUnread && (
            <span className="flex size-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
              {conversation.unread_count}
            </span>
          )}
          <span className="text-[10px] text-gray-400">{dateLabel}</span>
        </div>
      </button>

      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          aria-label="حذف گفتگو"
        >
          <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9.5 7V4.5h5V7M8 7l.7 12.1a1.5 1.5 0 0 0 1.5 1.4h3.6a1.5 1.5 0 0 0 1.5-1.4L16 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
