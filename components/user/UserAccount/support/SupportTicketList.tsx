"use client";

import SupportTicketCard from "./SupportTicketCard";

interface SupportTicketListProps {
  tickets: any[];
  onSelectTicket: (ticket: any) => void;
}

export default function SupportTicketList({ tickets, onSelectTicket }: SupportTicketListProps) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8">
        <div className="w-12 h-12 rounded-full bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto mb-3 text-lg">
          🎫
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
          هنوز تیکتی ثبت نکرده‌اید
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          اگر سوال یا مشکلی دارید، می‌توانید از طریق دکمه «ثبت تیکت جدید» با ما در ارتباط باشید.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <SupportTicketCard
          key={ticket.id}
          ticket={ticket}
          onClick={() => onSelectTicket(ticket)}
        />
      ))}
    </div>
  );
}