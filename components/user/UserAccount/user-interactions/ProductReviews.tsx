"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { InteractionItem } from "./UserInteractions";
import { getImagePath } from "@/lib/utils";
import EmptyState from "@/components/ui/emptyState/EmptyState";
import ContentAuthorBadge from "@/components/product/ProductDetails/ContentAuthorBadge/ContentAuthorBadge";

interface ProductReviewsProps {
  items: InteractionItem[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleApproval: (id: number, currentStatus: number) => void;
  onToggleMediaApproval: (mediaId: number) => void;
  canApproveComments: boolean;
  canApproveCommentMedia: boolean;
  canDeleteAll: boolean;
  onDeleteAll: () => void;
}

export default function ProductReviews({
  items,
  onEdit,
  onDelete,
  onToggleApproval,
  onToggleMediaApproval,
  canApproveComments,
  canApproveCommentMedia,
  canDeleteAll,
  onDeleteAll,
}: ProductReviewsProps) {
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [pendingCursor, setPendingCursor] = useState(0);
  const pendingCommentsCount = items.filter((item) => item.is_approved === 0).length;
  
  const pendingMediaCount = items.reduce((total, item) => {
    if (!item.media) return total;
    const pendingInItem = item.media.filter(
      (m: any) => m.is_approved === 0 || m.is_approved === false || m.is_approved === "0"
    ).length;
    return total + pendingInItem;
  }, 0);

  const pendingTargets = items.flatMap((item) => [
    ...(item.is_approved === 0 ||
    item.media?.some((media) => Number(media.is_approved) === 0)
      ? [item.id]
      : []),
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
        tone="amber"
        eyebrow="دیدگاه‌های محصولات"
        title="هیچ دیدگاهی ثبت نشده است"
        description="دیدگاه‌های ثبت‌شده و وضعیت بررسی آن‌ها در این بخش نمایش داده می‌شوند."
        icon={
          <svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m8-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        }
      />
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* counter */}
      {(pendingCommentsCount > 0 || pendingMediaCount > 0) && (
        <div className="sticky top-49 sm:top-43 z-10 py-2 bg-gray-50/80 dark:bg-dark-900/80 backdrop-blur-md flex flex-wrap items-center gap-3">
          {pendingCommentsCount > 0 && (
            <button
              type="button"
              onClick={scrollToNextPending}
              className="flex items-center justify-between gap-4 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-600 dark:text-amber-400 font-medium shadow-sm cursor-pointer hover:bg-amber-500/15 transition-colors"
            >
              <span>دیدگاه‌های در انتظار تایید:</span>
              <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full font-bold text-[10px]">
                {pendingCommentsCount}
              </span>
            </button>
          )}

          {pendingMediaCount > 0 && (
            <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-xs text-cyan-600 dark:text-cyan-400 font-medium shadow-sm">
              <span>فایل‌های ارسالی در انتظار تایید:</span>
              <span className="px-2 py-0.5 bg-cyan-500 text-white rounded-full font-bold text-[10px]">
                {pendingMediaCount}
              </span>
            </div>
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
            حذف همه دیدگاه‌ها
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
            {/* header */}
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

            {/* rating */}
            {item.rating && (
              <div className="flex items-center gap-1 text-xs text-amber-500">
                {"⭐".repeat(item.rating)}
                <span className="text-gray-400 text-[10px] mr-1">({item.rating} از ۵)</span>
              </div>
            )}

            {/* comment txt */}
            <p className="text-sm text-gray-600 dark:text-dark-200 leading-relaxed">
              {item.content}
            </p>

            {item.replies && item.replies.length > 0 && (
              <div className="mt-5 space-y-3 border-t-2 border-dashed border-gray-200 dark:border-white/10 pt-4">
                <span className="text-[11px] font-bold text-gray-400 block">
                  پاسخ‌ها:
                </span>
                <div className="space-y-3 border-r-2 border-violet-500/20 pr-4">
                  {item.replies.map((reply) => {
                    const isReplyApproved = reply.is_approved === 1;

                    return (
                      <div
                        key={reply.id}
                          ref={(element) => {
                            itemRefs.current[reply.id] = element;
                          }}
                        className="rounded-xl bg-violet-500/5 dark:bg-dark-900/50 border border-violet-500/15 p-3.5 space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <ContentAuthorBadge
                            name={reply.user?.name}
                            role={reply.user?.role}
                          />
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] border ${
                            isReplyApproved
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }`}>
                            {isReplyApproved ? "تایید شده" : "در انتظار تایید"}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                          پاسخ به دیدگاه اصلی:
                        </span>
                        <p className="text-sm text-gray-600 dark:text-dark-200 leading-relaxed bg-white/60 dark:bg-dark-800 p-2.5 rounded-lg border border-gray-100 dark:border-white/5">
                          {reply.content}
                        </p>
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-200/40 dark:border-white/5">
                          {canApproveComments && (
                            <button
                              type="button"
                              onClick={() => onToggleApproval(reply.id, reply.is_approved)}
                              className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px]"
                            >
                              {isReplyApproved ? "لغو تایید" : "تایید کردن"}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onEdit(reply.id)}
                            className="px-3 py-1 rounded-lg bg-violet-500/10 text-violet-600 text-[10px]"
                          >
                            ویرایش
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(reply.id)}
                            className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-500 text-[10px]"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Media Gallery Grid */}
            {item.media && item.media.length > 0 && (
              <div className="pt-3 border-t border-gray-100 dark:border-white/5 space-y-2">
                <span className="text-[11px] text-gray-400 font-medium block">تصاویر و ویدیوهای ارسالی:</span>
                <div className="flex flex-wrap gap-3">
                  {item.media.map((mediaItem: any) => {
                    const isMediaApproved = mediaItem.is_approved === 1 || mediaItem.is_approved === true;
                    // استفاده از تابع متمرکز getImagePath
                    const mediaUrl = getImagePath(mediaItem.file_path);

                    return (
                      <div key={mediaItem.id} className="flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dark-900 p-2 gap-2 w-32">
                        <div className="relative w-full h-24 rounded-lg overflow-hidden bg-gray-200 dark:bg-dark-950">
                          {mediaItem.file_type === 'video' ? (
                            <video src={mediaUrl} className="w-full h-full object-cover" />
                          ) : (
                            <Image src={mediaUrl} alt="Review Media" fill sizes="128px" unoptimized className="w-full h-full object-cover" />
                          )}
                          <span className={`absolute top-1.5 right-1.5 text-[8px] px-1.5 py-0.5 rounded font-bold shadow ${isMediaApproved ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                            {isMediaApproved ? 'تایید' : 'انتظار'}
                          </span>
                        </div>

                        {canApproveCommentMedia && (
                          <button
                            type="button"
                            onClick={() => onToggleMediaApproval(mediaItem.id)}
                            className={`w-full py-1 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                              isMediaApproved
                                ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400'
                                : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400'
                            }`}
                          >
                            {isMediaApproved ? 'لغو تایید' : 'تایید فایل'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* action btns */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-white/5">
              {canApproveComments && (
                <button
                  type="button"
                  onClick={() => onToggleApproval(item.id, item.is_approved)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isApproved
                      ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                  }`}
                >
                  {isApproved ? "لغو تایید متن" : "تایید کردن متن"}
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
          </div>
        );
      })}
    </div>
  );
}