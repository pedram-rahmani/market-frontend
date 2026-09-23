"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import EmptyState from "@/components/ui/emptyState/EmptyState";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import DeleteConfirmModal from "@/components/feedback/MessageModal/DeleteConfirmModal";
import AdminChatDetailModal from "@/components/chat/AdminChatDetails";
import ConversationCard from "@/components/chat/ConversationCard";
import axiosInstance from "@/lib/axiosInstance";
import { getPersianErrorMessage, SUCCESS_MESSAGES } from "@/lib/errorMapper";
import { usePermissions } from "@/store/hooks/usePermissions";
import { PERMISSIONS } from "@/types/permissions";
import { getEcho } from "@/lib/echo";
import { Conversation } from "@/types/chat";

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

  const [popup, setPopup] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const showError = (message: string) =>
    setPopup({ isOpen: true, message, type: "error" });

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/chats");
      setConversations(response.data || []);
    } catch (error) {
      console.error("خطا در دریافت گفتگوها:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const selectedIdRef = useRef<number | null>(null);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private("staff-chats");

    // Listening to conversation updates on the staff-chats channel
    channel.listen("chat.conversation.updated", (payload: any) => {
      console.log("🔥 Received conversation.updated:", payload);
      if (!payload || !payload.conversation) return;

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

    // Listening to new messages on the staff-chats channel
    channel.listen("chat.message", (payload: any) => {
      console.log("🔥 Received chat.message in staff-chats:", payload);
      
      const conversationId = payload.conversation_id;
      const newMessage = payload.message;
      if (!conversationId || !newMessage) return;

      setConversations((prev) => {
        const exists = prev.some((c) => c.id === conversationId);

        // if this conversation is not in the list, fetch the list again from the server
        if (!exists) {
          fetchConversations();
          return prev;
        }

        // updating the last message and unread count in the corresponding card
        const updated = prev.map((c) => {
          if (c.id !== conversationId) return c;
          
          const isSelected = selectedIdRef.current === c.id;

          return {
            ...c,
            last_message_at: newMessage.created_at || new Date().toISOString(),
            unread_count: isSelected ? 0 : (c.unread_count || 0) + 1,
          };
        });

        // sorting by last-message in descending order
        return [...updated].sort((a, b) => {
          const at = a.last_message_at ? new Date(a.last_message_at).getTime() : 0;
          const bt = b.last_message_at ? new Date(b.last_message_at).getTime() : 0;
          return bt - at;
        });
      });
    });

    return () => {
      echo.leave("staff-chats");
    };
  }, [fetchConversations]);

  const counts = statusTabs.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.value] =
      tab.value === "all"
        ? conversations.length
        : conversations.filter((c) => c.status === tab.value).length;
    return acc;
  }, {});

  const visibleConversations =
    activeTab === "all"
      ? conversations
      : conversations.filter((c) => c.status === activeTab);

  const handleUpdated = (updated: { id: number; status: string }) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === updated.id
          ? {
              ...c,
              status: updated.status as Conversation["status"],
              unread_count: 0,
            }
          : c
      )
    );
  };

  const handleDeleteConfirm = async () => {
    if (!conversationToDelete) return;
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/admin/chats/${conversationToDelete.id}`);
      setConversations((prev) => prev.filter((c) => c.id !== conversationToDelete.id));
      setPopup({
        isOpen: true,
        message: response.data.message || SUCCESS_MESSAGES.deleted,
        type: "success",
      });
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
          <svg viewBox="0 0 24 24" className="size-7!">
            <path d="M3 11.5a8.5 8.5 0 0 1 17 0v3.25a2.25 2.25 0 0 1-2.25 2.25H16l-3.2 3.2a1.125 1.125 0 0 1-1.925-.796V17H6.25A3.25 3.25 0 0 1 3 13.75V11.5Z" />
            <path d="M8 11h.01M12 11h.01M16 11h.01" />
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
        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-4 text-center dark:border-white/10 dark:bg-white/3">
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
            <svg viewBox="0 0 24 24" className="size-12!">
              <path d="M3 11.5a8.5 8.5 0 0 1 17 0v3.25a2.25 2.25 0 0 1-2.25 2.25H16l-3.2 3.2a1.125 1.125 0 0 1-1.925-.796V17H6.25A3.25 3.25 0 0 1 3 13.75V11.5Z" />
              <path d="M8 11h.01M12 11h.01M16 11h.01" />
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
              onDelete={
                can(PERMISSIONS.CHATS_DELETE)
                  ? () => setConversationToDelete(conversation)
                  : undefined
              }
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
        onClose={() => {
          if (!isDeleting) setConversationToDelete(null);
        }}
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