"use client";

import { InteractionItem } from "@/types/interactions";

interface InteractionRowProps {
  item: InteractionItem;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function InteractionRow({ item, onEdit, onDelete }: InteractionRowProps) {
  return (
    <div className="p-5 bg-light/80 dark:bg-dark-700/70 rounded-2xl border border-white/5 space-y-3 transition-all hover:border-cyan-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg">
            {item.productName}
          </span>
          {item.rating && (
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg text-amber-400 text-xs font-bold">
              <span>★</span>
              <span>{item.rating}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${
              item.status === "approved"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            }`}
          >
            {item.status === "approved" ? "تایید شده" : "در انتظار تایید"}
          </span>
          <span className="text-[10px] text-gray-400">{item.date}</span>
        </div>
      </div>

      <p className="text-xs text-text-on-light/90 dark:text-text-on-dark/90 leading-relaxed">
        {item.content}
      </p>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
        {onEdit && (
          <button
            onClick={() => onEdit(item.id)}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs transition-all cursor-pointer"
          >
            ویرایش
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(item.id)}
            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs transition-all cursor-pointer"
          >
            حذف
          </button>
        )}
      </div>
    </div>
  );
}