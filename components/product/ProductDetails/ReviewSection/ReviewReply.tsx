"use client";

interface ReviewReplyProps {
  reply: {
    id: number;
    comment: string;
    created_at?: string;
    user?: {
      name?: string;
    };
  };
}

export default function ReviewReply({ reply }: ReviewReplyProps) {
  return (
    <div className="p-4 bg-white dark:bg-dark-700/70 rounded-xl border border-custom-gray-100/60 dark:border-dark-600 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center text-[10px] font-bold">
            {reply.user?.name ? reply.user.name.charAt(0) : "ک"}
          </div>
          <span className="text-[11px] font-medium text-text-on-light/80 dark:text-text-on-dark/90">
            {reply.user?.name || "کاربر مهمان"}
          </span>
        </div>
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