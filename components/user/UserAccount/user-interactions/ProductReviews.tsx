"use client";

import { InteractionItem } from "./UserInteractions";
interface ProductReviewsProps {
  items: InteractionItem[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleApproval: (id: number, currentStatus: number) => void;
  onToggleMediaApproval: (mediaId: number) => void;
}

export default function ProductReviews({
  items,
  onEdit,
  onDelete,
  onToggleApproval,
  onToggleMediaApproval,
}: ProductReviewsProps) {
  const pendingCommentsCount = items.filter((item) => item.is_approved === 0).length;
  
  const pendingMediaCount = items.reduce((total, item) => {
    if (!item.media) return total;
    const pendingInItem = item.media.filter(
      (m: any) => m.is_approved === 0 || m.is_approved === false || m.is_approved === "0"
    ).length;
    return total + pendingInItem;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-dark-800 rounded-2xl border border-gray-200 dark:border-white/5">
        <p className="text-xs text-gray-400">هیچ دیدگاهی ثبت نشده است.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative">
      {/* counter */}
      {(pendingCommentsCount > 0 || pendingMediaCount > 0) && (
        <div className="sticky top-48 sm:top-37 z-10 py-2 bg-gray-50/80 dark:bg-dark-900/80 backdrop-blur-md flex flex-wrap items-center gap-3">
          {pendingCommentsCount > 0 && (
            <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-600 dark:text-amber-400 font-medium shadow-sm">
              <span>دیدگاه‌های در انتظار تایید:</span>
              <span className="px-2 py-0.5 bg-amber-500 text-white rounded-full font-bold text-[10px]">
                {pendingCommentsCount}
              </span>
            </div>
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

      {items.map((item) => {
        const isApproved = item.is_approved === 1;

        return (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/5 space-y-4 shadow-sm"
          >
            {/* header */}
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

            {/* rating */}
            {item.rating && (
              <div className="flex items-center gap-1 text-xs text-amber-500">
                {"⭐".repeat(item.rating)}
                <span className="text-gray-400 text-[10px] mr-1">({item.rating} از ۵)</span>
              </div>
            )}

            {/* comment txt */}
            <p className="text-xs text-gray-600 dark:text-dark-200 leading-relaxed">
              {item.content}
            </p>

            {/* Media Gallery Grid */}
            {item.media && item.media.length > 0 && (
              <div className="pt-3 border-t border-gray-100 dark:border-white/5 space-y-2">
                <span className="text-[11px] text-gray-400 font-medium block">تصاویر و ویدیوهای ارسالی:</span>
                <div className="flex flex-wrap gap-3">
                  {item.media.map((mediaItem: any) => {
                    const isMediaApproved = mediaItem.is_approved === 1 || mediaItem.is_approved === true;
                    const baseUrl = process.env.NEXT_PUBLIC_ASSET_URL ? `${process.env.NEXT_PUBLIC_ASSET_URL}/storage/` : "http://127.0.0.1:8000/storage/";
                    const mediaUrl = mediaItem.file_path.startsWith("http") ? mediaItem.file_path : `${baseUrl}${mediaItem.file_path}`;

                    return (
                      <div key={mediaItem.id} className="flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-dark-900 p-2 gap-2 w-32">
                        <div className="relative w-full h-24 rounded-lg overflow-hidden bg-gray-200 dark:bg-dark-950">
                          {mediaItem.file_type === 'video' ? (
                            <video src={mediaUrl} className="w-full h-full object-cover" />
                          ) : (
                            <img src={mediaUrl} alt="Review Media" className="w-full h-full object-cover" />
                          )}
                          <span className={`absolute top-1.5 right-1.5 text-[8px] px-1.5 py-0.5 rounded font-bold shadow ${isMediaApproved ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                            {isMediaApproved ? 'تایید' : 'انتظار'}
                          </span>
                        </div>

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
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* action btns */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-white/5">
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