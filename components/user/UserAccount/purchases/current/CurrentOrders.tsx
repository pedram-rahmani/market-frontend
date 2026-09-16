"use client";

import OrderCard from "../OrderCard";
import { Order } from "@/types/order";

interface CurrentOrdersProps {
  orders: Order[];
}

export default function CurrentOrders({ orders }: CurrentOrdersProps) {
  if (!orders || orders.length === 0) {
    return (
      <div>
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">سفارش جاری فعالی ندارید</h3>
          <p className="text-xs text-gray-400">سفارش‌های در حال پردازش یا ارسال شما اینجا قرار می‌گیرند.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          statusText="در حال پردازش"
          statusColor="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          date={new Date(order.created_at).toLocaleDateString("fa-IR")}
          orderCode={order.order_code}
          totalPrice={Number(order.total_price)}
          discount={order.discount ? Number(order.discount) : 0}
          items={order.items || []}
        />
      ))}
    </div>
  );
}