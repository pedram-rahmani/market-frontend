"use client";

import SupportTicketCard from "./SupportTicketCard";
import EmptyState from "@/components/ui/emptyState/EmptyState";

interface SupportTicketListProps {
  tickets: any[];
  onSelectTicket: (ticket: any) => void;
}

export default function SupportTicketList({ tickets, onSelectTicket }: SupportTicketListProps) {
  if (!tickets || tickets.length === 0) {
    return (
      <EmptyState
        tone="violet"
        eyebrow="پشتیبانی"
        title="هنوز تیکتی ثبت نکرده‌اید"
        description="اگر سوال یا مشکلی دارید، می‌توانید از طریق دکمه «ثبت تیکت جدید» با ما در ارتباط باشید."
        icon={
          <svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5a8.5 8.5 0 0 1 17 0v3.25a2.25 2.25 0 0 1-2.25 2.25H16l-3.2 3.2a1.125 1.125 0 0 1-1.925-.796V17H6.25A3.25 3.25 0 0 1 3 13.75V11.5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h.01M12 11h.01M16 11h.01" />
          </svg>
        }
      />
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