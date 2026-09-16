"use client";

import { Order } from "@/types/order";

interface CancelledOrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function CancelledOrderDetails({
  isOpen,
  onClose,
  order,
}: CancelledOrderDetailsProps) {
  if (!isOpen || !order) return null;

  const totalPrice = Number(order.total_price);
  const discount = order.discount ? Number(order.discount) : 0;
  const shippingCost = 0;
  const finalPrice = totalPrice - discount + shippingCost;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      dir="rtl"
    >
      {/* modal container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#131b2e] border border-gray-100 dark:border-white/5 rounded-3xl p-6 space-y-6 shadow-2xl">
        {/* modal-header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/5">
          <span className="text-sm font-bold text-gray-800 dark:text-white">
            جزئیات سفارش (لغو شده)
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="size-5!">
              <path d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* order-info */}
        <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 space-y-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-gray-100 dark:border-white/5">
            <div>
              <span className="text-gray-400 ml-1">کد پیگیری سفارش:</span>
              <span className="font-bold text-gray-800 dark:text-white">
                {order.order_code}
              </span>
            </div>
            <div>
              <span className="text-gray-400 ml-1">تاریخ ثبت سفارش:</span>
              <span className="font-bold text-gray-800 dark:text-white">
                {new Date(order.created_at).toLocaleDateString("fa-IR")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-gray-400 ml-1">مبلغ کل:</span>
              <span className="font-bold text-gray-800 dark:text-white">
                {finalPrice.toLocaleString()} تومان
              </span>
            </div>
          </div>
        </div>

        {/* order items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/5">
            <span className="font-bold text-gray-800 dark:text-white text-xs">
              اقلام سفارش
            </span>
            <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full">
              لغو شده
            </span>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-white/5 max-h-60 overflow-y-auto">
            {order.items && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div
                  key={index}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100 dark:border-white/5">
                      <img
                        src={item.image || "/images/placeholder.png"}
                        alt={item.title || "کالا"}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-gray-800 dark:text-white">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-400">
                        شناسه: {item.id}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-gray-800 dark:text-white">
                    {Number(item.price).toLocaleString()} تومان
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">
                کالایی برای این سفارش ثبت نشده است.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
