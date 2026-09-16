"use client";

import React from "react";

interface Ticket {
  id: number | string;
  subject: string;
  department: string;
  status: "open" | "pending" | "closed";
  priority: "low" | "medium" | "high";
  updated_at: string;
}

interface SupportTicketCardProps {
  ticket: Ticket;
  onClick: () => void;
}

export default function SupportTicketCard({ ticket, onClick }: SupportTicketCardProps) {
  const statusStyles = {
    open: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
    pending: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    closed: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  };

  const statusLabels = {
    open: "باز",
    pending: "در انتظار پاسخ",
    closed: "بسته شده",
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400">#{ticket.id}</span>
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            {ticket.subject}
          </h4>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          دپارتمان: <span className="font-medium text-gray-700 dark:text-gray-300">{ticket.department}</span>
        </p>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-800">
        <span className={`text-[11px] px-3 py-1 rounded-full border font-medium ${statusStyles[ticket.status]}`}>
          {statusLabels[ticket.status]}
        </span>
        <span className="text-xs text-gray-400 font-mono">
          {ticket.updated_at}
        </span>
      </div>
    </div>
  );
}