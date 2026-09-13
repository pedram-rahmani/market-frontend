"use client";

import OrderCard from "../OrderCard";
import { Order } from "@/types/order";

interface ReturnedOrdersProps {
  orders: Order[];
}

export default function ReturnedOrders({ orders }: ReturnedOrdersProps) {
  if (!orders || orders.length === 0) {
    return (
      <div>
        <div className="w-16 h-16 rounded-full bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-inner">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">سفارش مرجوع‌شده‌ای ندارید</h3>
          <p className="text-xs text-gray-400">تاریخچه مرجوع کردن کالاها در این قسمت نمایش داده می‌شود.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          statusText="مرجوع شده"
          statusColor="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
          date={new Date(order.created_at).toLocaleDateString("fa-IR")}
          orderCode={order.order_code}
          totalPrice={Number(order.total_price)}
          discount={order.discount ? Number(order.discount) : 0}
          trackingCode={order.tracking_code}
          items={order.items || []}
        />
      ))}
    </div>
  );
}