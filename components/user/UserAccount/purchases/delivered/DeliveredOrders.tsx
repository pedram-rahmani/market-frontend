"use client";

import OrderCard from "../OrderCard";
import { Order } from "@/types/order";
import EmptyState from "@/components/ui/emptyState/EmptyState";

interface DeliveredOrdersProps {
  orders: Order[];
}

export default function DeliveredOrders({ orders }: DeliveredOrdersProps) {
  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        tone="blue"
        eyebrow="سفارش‌های تحویل‌شده"
        title="سفارش تحویل‌شده‌ای ثبت نشده است"
        description="سفارش‌هایی که با موفقیت تحویل گرفته‌اید در این بخش بایگانی می‌شوند."
        actionLabel="مشاهده محصولات"
        actionHref="/products"
        icon={<DeliveredIcon />}
      />
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

function DeliveredIcon() {
  return (
    <svg className="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}