"use client";

import { useState } from "react";
import OrderCard from "../OrderCard";
import CancelledOrderDetails from "./CancelledOrderDetails";
import { Order } from "@/types/order";

interface CancelledOrdersProps {
  orders: Order[];
}

export default function CancelledOrders({ orders }: CancelledOrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!orders || orders.length === 0) {
    return (
      <div>
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-rose-500/10 flex items-center justify-center text-red-600 dark:text-rose-400 shadow-inner">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">سفارش لغو شده‌ای ندارید</h3>
          <p className="text-xs text-gray-400">سفارش‌هایی که لغو می‌کنید در این بخش نمایش داده می‌شوند.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          statusText="لغو شده"
          statusColor="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          date={new Date(order.created_at).toLocaleDateString("fa-IR")}
          orderCode={order.order_code}
          totalPrice={Number(order.total_price)}
          discount={order.discount ? Number(order.discount) : 0}
          items={order.items || []}
          onViewDetails={() => setSelectedOrder(order)}
        />
      ))}

      <CancelledOrderDetails
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}