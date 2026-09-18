"use client";

import OrderCard from "../OrderCard";
import { Order } from "@/types/order";
import EmptyState from "@/components/ui/emptyState/EmptyState";

interface ReturnedOrdersProps {
  orders: Order[];
}

export default function ReturnedOrders({ orders }: ReturnedOrdersProps) {
  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        tone="violet"
        eyebrow="سفارش‌های مرجوع‌شده"
        title="سفارش مرجوع‌شده‌ای ندارید"
        description="تاریخچه مرجوع کردن کالاها در این قسمت نمایش داده می‌شود."
        icon={<ReturnedIcon />}
      />
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

function ReturnedIcon() {
  return (
    <svg className="size-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
    </svg>
  );
}