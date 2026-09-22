"use client";
import ContentAuthorBadge from "@/components/product/ProductDetails/ContentAuthorBadge/ContentAuthorBadge";

interface ReviewReplyProps {
  reply: {
    id: number;
    comment: string;
    created_at?: string;
    user?: {
      name?: string;
      role?: string;
    };
  };
  parent: {
    user?: { name?: string };
    comment: string;
  };
}

export default function ReviewReply({ reply, parent }: ReviewReplyProps) {
  return (
    <div className="relative p-4 bg-white dark:bg-dark-700/70 rounded-xl border border-custom-gray-100/60 dark:border-dark-600 space-y-3">
      <div className="rounded-lg border-r-2 border-cyan-500/30 bg-cyan-500/5 px-3 py-2 text-[10px] text-text-on-light/60 dark:text-text-on-dark/60">
        <span className="text-cyan-500 dark:text-cyan-400">در پاسخ به </span>
        <span className="font-semibold">{parent.user?.name || "کاربر"}</span>
        <p className="mt-1 truncate opacity-80">{parent.comment}</p>
      </div>
      <div className="flex items-center justify-between">
        <ContentAuthorBadge
          name={reply.user?.name}
          role={reply.user?.role}
          publicFacing
        />
        {reply.created_at && (
          <span className="text-[9px] text-text-on-light/60 dark:text-text-on-dark/60">
            {new Date(reply.created_at).toLocaleDateString("fa-IR")}
          </span>
        )}
      </div>
      <p className="text-[11px] text-text-on-light/90 dark:text-text-on-dark/90 leading-relaxed">
        {reply.comment}
      </p>
    </div>
  );
}