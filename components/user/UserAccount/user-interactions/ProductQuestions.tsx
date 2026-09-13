"use client";

import { ProductQuestionItem } from "@/types/interactions";

interface ProductQuestionsProps {
  items: ProductQuestionItem[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleApproval: (id: number, currentStatus: number) => void;
}

export default function ProductQuestions({
  items,
  onEdit,
  onDelete,
  onToggleApproval,
}: ProductQuestionsProps) {
  const pendingQuestionsCount = items.filter(
    (item) => item.is_approved === 0,
  ).length;

  const pendingRepliesCount = items.reduce((total, item) => {
    if (!item.replies) return total;
    return total + item.replies.filter((r) => r.is_approved === 0).length;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-white/5">
        <p className="text-xs text-gray-400">هیچ پرسش و پاسخی ثبت نشده است.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {(pendingQuestionsCount > 0 || pendingRepliesCount > 0) && (
        <div className="sticky top-48 sm:top-37 z-10 py-2 bg-gray-50/80 dark:bg-dark-900/80 backdrop-blur-md flex items-center gap-3 flex-wrap">
          {pendingQuestionsCount > 0 && (
            <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl text-xs text-violet-600 dark:text-violet-400 font-medium shadow-sm">
              <span>پرسش‌های در انتظار تایید:</span>
              <span className="px-2 py-0.5 bg-violet-500 text-white rounded-full font-bold text-[10px]">
                {pendingQuestionsCount}
              </span>
            </div>
          )}

          {pendingRepliesCount > 0 && (
            <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-600 dark:text-blue-400 font-medium shadow-sm">
              <span>پاسخ‌های در انتظار تایید:</span>
              <span className="px-2 py-0.5 bg-blue-500 text-white rounded-full font-bold text-[10px]">
                {pendingRepliesCount}
              </span>
            </div>
          )}
        </div>
      )}

      {items.map((item) => {
        const isApproved = item.is_approved === 1;

        return (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/5 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-gray-800 dark:text-white">
                {item.productName}
              </span>
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
              <p className="text-xs text-text-on-light/80 dark:text-text-on-dark/80 leading-relaxed bg-gray-50 dark:bg-dark-900/40 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                {item.content}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
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
                      className="p-3.5 rounded-xl bg-violet-500/5 dark:bg-dark-850 border border-violet-500/15 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          {reply.is_admin_answer ? "پاسخ ادمین" : "پاسخ کاربر"}
                        </span>

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
                        <p className="text-xs text-text-on-light/80 dark:text-text-on-dark/80 leading-relaxed bg-white/60 dark:bg-dark-800 p-2.5 rounded-lg border border-gray-100 dark:border-white/5">
                          {reply.content}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200/40 dark:border-white/5">
                        <button
                          type="button"
                          onClick={() =>
                            onToggleApproval(reply.id, reply.is_approved)
                          }
                          className={`px-3 py-1 rounded-lg text-[11px] font-medium cursor-pointer ${
                            isReplyApproved
                              ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                          }`}
                        >
                          {isReplyApproved ? "لغو تایید" : "تایید کردن"}
                        </button>

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