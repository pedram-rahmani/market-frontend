"use client";

import { useRef, useState } from "react";
import { ProductQuestionItem } from "@/types/interactions";
import EmptyState from "@/components/ui/emptyState/EmptyState";
import ContentAuthorBadge from "@/components/product/ProductDetails/ContentAuthorBadge";

interface ProductQuestionsProps {
  items: ProductQuestionItem[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleApproval: (id: number, currentStatus: number, isReply?: boolean) => void;
  canApproveQuestions: boolean;
  canApproveAnswers: boolean;
  canDeleteAll: boolean;
  onDeleteAll: () => void;
}

export default function ProductQuestions({
  items,
  onEdit,
  onDelete,
  onToggleApproval,
  canApproveQuestions,
  canApproveAnswers,
  canDeleteAll,
  onDeleteAll,
}: ProductQuestionsProps) {
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [pendingCursor, setPendingCursor] = useState(0);
  const pendingQuestionsCount = items.filter(
    (item) => item.is_approved === 0,
  ).length;

  const pendingRepliesCount = items.reduce((total, item) => {
    if (!item.replies) return total;
    return total + item.replies.filter((r) => r.is_approved === 0).length;
  }, 0);

  const pendingTargets = items.flatMap((item) => [
    ...(item.is_approved === 0 ? [item.id] : []),
    ...(item.replies || [])
      .filter((reply) => reply.is_approved === 0)
      .map((reply) => reply.id),
  ]);

  const scrollToNextPending = () => {
    if (pendingTargets.length === 0) return;

    const targetId = pendingTargets[pendingCursor % pendingTargets.length];
    itemRefs.current[targetId]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setPendingCursor((cursor) => (cursor + 1) % pendingTargets.length);
  };

  if (items.length === 0) {
    return (
      <EmptyState
        tone="blue"
        eyebrow="پرسش و پاسخ‌ها"
        title="هیچ پرسش و پاسخی ثبت نشده است"
        description="پرسش‌ها و پاسخ‌های ثبت‌شده کاربران در این بخش نمایش داده می‌شوند."
        icon={
          <svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h4m8-2a8 8 0 1 1-16 0c0 1.85.63 3.55 1.69 4.9L5 21l3.1-1.55A8 8 0 0 0 20 12Z" />
          </svg>
        }
      />
    );
  }

  return (
    <div className="space-y-4 relative">
      {(pendingQuestionsCount > 0 || pendingRepliesCount > 0) && (
        <div className="sticky top-49 sm:top-43 z-10 py-2 bg-gray-50/80 dark:bg-dark-900/80 backdrop-blur-md flex items-center gap-3 flex-wrap">
          {pendingQuestionsCount > 0 && (
            <button
              type="button"
              onClick={scrollToNextPending}
              className="flex items-center justify-between gap-4 px-4 py-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-xs text-violet-600 dark:text-violet-400 font-medium shadow-sm cursor-pointer hover:bg-violet-500/15 transition-colors"
            >
              <span>پرسش‌های در انتظار تایید:</span>
              <span className="px-2 py-0.5 bg-violet-500 text-white rounded-full font-bold text-[10px]">
                {pendingQuestionsCount}
              </span>
            </button>
          )}

          {pendingRepliesCount > 0 && (
            <button
              type="button"
              onClick={scrollToNextPending}
              className="flex items-center justify-between gap-4 px-4 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-600 dark:text-blue-400 font-medium shadow-sm cursor-pointer hover:bg-blue-500/15 transition-colors"
            >
              <span>پاسخ‌های در انتظار تایید:</span>
              <span className="px-2 py-0.5 bg-blue-500 text-white rounded-full font-bold text-[10px]">
                {pendingRepliesCount}
              </span>
            </button>
          )}
        </div>
      )}

      {canDeleteAll && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onDeleteAll}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 text-xs font-medium hover:bg-rose-500/20 transition-colors"
          >
            حذف همه پرسش‌ها و پاسخ‌ها
          </button>
        </div>
      )}

      {items.map((item) => {
        const isApproved = item.is_approved === 1;

        return (
          <div
            key={item.id}
            ref={(element) => {
              itemRefs.current[item.id] = element;
            }}
            className="p-5 rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/5 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <span className="font-bold text-sm text-gray-800 dark:text-white block">
                  {item.productName}
                </span>
                <ContentAuthorBadge name={item.user?.name} role={item.user?.role} />
              </div>
              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] border font-medium ${
                  isApproved
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }`}
              >
                {isApproved ? "تایید شده" : "در انتظار تایید"}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400">
                سوال:
              </span>
              <p className="text-sm text-text-on-light/80 dark:text-text-on-dark/80 leading-relaxed bg-gray-50 dark:bg-dark-900/40 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                {item.content}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
              {canApproveQuestions && (
                <button
                  type="button"
                  onClick={() => onToggleApproval(item.id, item.is_approved)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isApproved
                      ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                  }`}
                >
                  {isApproved ? "لغو تایید" : "تایید کردن"}
                </button>
              )}

              <button
                type="button"
                onClick={() => onEdit(item.id)}
                className="px-3.5 py-1.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-medium hover:bg-violet-500/20 transition-colors cursor-pointer"
              >
                ویرایش
              </button>

              <button
                type="button"
                onClick={() => onDelete(item.id)}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-medium hover:bg-rose-500/20 transition-colors cursor-pointer"
              >
                حذف
              </button>
            </div>

            {item.replies && item.replies.length > 0 && (
              <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 dark:border-white/10 space-y-3">
                <span className="text-[11px] font-bold text-gray-400 block">
                  پاسخ‌ها:
                </span>

                {item.replies.map((reply) => {
                  const isReplyApproved = reply.is_approved === 1;

                  return (
                    <div
                      key={reply.id}
                      ref={(element) => {
                        itemRefs.current[reply.id] = element;
                      }}
                      className="p-3.5 rounded-xl bg-violet-500/5 dark:bg-dark-850 border border-violet-500/15 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <ContentAuthorBadge
                          name={reply.user?.name}
                          role={reply.user?.role}
                        />

                        <span
                          className={`px-2 py-0.5 rounded-lg text-[9px] border font-medium ${
                            isReplyApproved
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}
                        >
                          {isReplyApproved ? "تایید شده" : "در انتظار تایید"}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          جواب:
                        </span>
                        <p className="text-sm text-text-on-light/80 dark:text-text-on-dark/80 leading-relaxed bg-white/60 dark:bg-dark-800 p-2.5 rounded-lg border border-gray-100 dark:border-white/5">
                          {reply.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200/40 dark:border-white/5">
                        {canApproveAnswers && (
                          <button
                            type="button"
                            onClick={() =>
                              onToggleApproval(reply.id, reply.is_approved, true)
                            }
                            className={`px-3 py-1 rounded-lg text-[11px] font-medium cursor-pointer ${
                              isReplyApproved
                                ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            }`}
                          >
                            {isReplyApproved ? "لغو تایید" : "تایید کردن"}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onEdit(reply.id)}
                          className="px-3 py-1 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[11px] font-medium hover:bg-violet-500/20 cursor-pointer"
                        >
                          ویرایش
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(reply.id)}
                          className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-500 text-[11px] font-medium hover:bg-rose-500/20 cursor-pointer"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}