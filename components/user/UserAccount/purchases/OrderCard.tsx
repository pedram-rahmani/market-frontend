"use client";

import { OrderItem } from "@/types/order";

interface OrderCardProps {
  statusText: string;
  statusColor: string;
  date: string;
  orderCode: string;
  totalPrice: number;
  discount?: number;
  items: OrderItem[];
  trackingCode?: string;
  onViewDetails?: () => void;
}

export default function OrderCard({
  statusText,
  statusColor,
  date,
  orderCode,
  totalPrice,
  discount = 0,
  items,
  trackingCode,
  onViewDetails,
}: OrderCardProps) {
  const finalPrice = totalPrice - discount;

  return (
    <div className="bg-white dark:bg-[#131b2e] border border-gray-100 dark:border-white/5 rounded-2xl p-6 space-y-4 shadow-sm dark:shadow-xl transition-all">
      {/* cart header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-white/5 text-xs">
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full font-medium ${statusColor}`}>
            {statusText}
          </span>
          <span className="text-gray-400 dark:text-gray-400">تاریخ ثبت: {date}</span>
        </div>
        <div className="text-gray-500 dark:text-gray-300">
          کد سفارش: <span className="font-bold text-gray-900 dark:text-white">{orderCode}</span>
        </div>
      </div>

      {/* cart body */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100 dark:border-white/5">
                <img
                  src={item.image || "/images/placeholder.png"}
                  alt={item.title || "محصول"}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{item.title || "محصول بدون نام"}</h4>
                <span className="text-xs text-gray-400">شناسه کالا: {item.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* cart footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-white/5 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">مبلغ کل:</span>
          <span className="font-bold text-gray-900 dark:text-white text-sm">
            {finalPrice.toLocaleString()} تومان
          </span>
          {trackingCode && (
            <span className="text-gray-400 mr-4">
              کد رهگیری: <strong className="text-gray-900 dark:text-white">{trackingCode}</strong>
            </span>
          )}
        </div>

        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 px-4 py-2 rounded-xl cursor-pointer"
          >
            <span>جزئیات سفارش</span>
            <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}