"use client";

import OrderCard from "../OrderCard";
import { Order } from "@/types/order";

interface DeliveredOrdersProps {
  orders: Order[];
}

export default function DeliveredOrders({ orders }: DeliveredOrdersProps) {
  if (!orders || orders.length === 0) {
    return (
      <div>
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 shadow-inner">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">سفارش تحویل‌شده‌ای ثبت نشده است</h3>
          <p className="text-xs text-gray-400">سفارش‌هایی که با موفقیت تحویل گرفته‌اید در این بخش بایگانی می‌شوند.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          statusText="تحویل شده"
          statusColor="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
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