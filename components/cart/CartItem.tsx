"use client";

import Image from "next/image";
import { CartItemProps } from "@/types/cart";

export default function CartItem({
  title,
  price,
  quantity,
  image,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white dark:bg-ui-blue-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm gap-4 transition-all">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 dark:bg-white/5 shrink-0 border border-gray-100 dark:border-white/5 flex items-center justify-center">
          {image ? (
            <Image src={image} alt={title} fill className="object-cover" />
          ) : (
            <span className="text-xs text-gray-400">کالا</span>
          )}
        </div>
        <div className="space-y-1.5 flex-1">
          <h3 className="font-bold text-xs sm:text-sm text-gray-800 dark:text-white line-clamp-2">
            {title}
          </h3>
          <span className="text-xs font-bold text-violet-600 dark:text-violet-400 block">
            {price.toLocaleString()} تومان
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-white/5 gap-4">
        {/* counter controller */}
        <div className="flex items-center bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden">
          <button
            onClick={onIncrease}
            className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="size-3!">
              <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <span className="px-3 pt-1 text-xs font-bold text-gray-800 dark:text-white cursor-default">
            {quantity}
          </span>
          <button
            onClick={onDecrease}
            className="px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="size-3!">
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>

        <button
          onClick={onRemove}
          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-xl transition-colors cursor-pointer"
          title="حذف کالا"
        >
          <svg viewBox="0 0 24 24" className="size-5! fill-current!">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
