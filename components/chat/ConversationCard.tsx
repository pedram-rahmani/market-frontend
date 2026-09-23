
"use client";

import { Conversation } from "@/types/chat";
import useDate from "@/store/hooks/useDate";

interface ConversationCardProps {
  conversation: Conversation;
  onClick: () => void;
  onDelete?: () => void;
}

export default function ConversationCard({
  conversation,
  onClick,
  onDelete,
}: ConversationCardProps) {
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
      <button
        type="button"
        onClick={onClick}
        className="flex min-w-0 flex-1 items-center gap-3 text-right"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10">
          <svg viewBox="0 0 24 24" className="size-5!">
            <path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-bold text-gray-800 dark:text-white">
              {conversation.user
                ? `${conversation.user.name} (${conversation.user.username})`
                : "کاربر ناشناس"}
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
          <p className="mt-0.5 truncate text-xs text-gray-400">
            {lastMessage?.message || "پیامی ثبت نشده است"}
          </p>
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
          <svg viewBox="0 0 24 24" className="size-4.5!">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9.5 7V4.5h5V7M8 7l.7 12.1a1.5 1.5 0 0 0 1.5 1.4h3.6a1.5 1.5 0 0 0 1.5-1.4L16 7" />
          </svg>
        </button>
      )}
    </div>
  );
}