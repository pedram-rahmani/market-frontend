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
  ownerName?: string;
  onDelete?: () => void;
}

const statusConfig = {
  open: {
    label: "باز",
    badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    rail: "bg-emerald-500",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 0 1-3.5-.633L3 21l1.42-3.79A8.185 8.185 0 0 1 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
  },
  pending: {
    label: "در انتظار پاسخ",
    badge: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    rail: "bg-amber-500",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  closed: {
    label: "بسته شده",
    badge: "bg-gray-500/10 text-gray-500 border-gray-500/20 dark:text-gray-400",
    rail: "bg-gray-400",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
      </svg>
    ),
  },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: { label: "اولویت کم", className: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  medium: { label: "اولویت متوسط", className: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  high: { label: "اولویت زیاد", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
};

const departmentLabels: Record<string, string> = {
  technical: "پشتیبانی فنی",
  financial: "امور مالی و پرداخت",
  sales: "فروش و پشتیبانی خرید",
};

export default function SupportTicketCard({ ticket, onClick, ownerName, onDelete }: SupportTicketCardProps) {
  const status = statusConfig[ticket.status];
  const priority = priorityConfig[ticket.priority];

  return (
    <div
      onClick={onClick}
      className="group relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/5 dark:bg-ui-blue-900 sm:p-5 md:flex-row md:items-center md:justify-between"
    >
      <span className={`absolute inset-y-0 right-0 w-1.5 ${status.rail}`} />

      <div className="flex min-w-0 items-start gap-3 pr-3">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${status.badge}`}>
          {status.icon}
        </span>
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-mono text-gray-400 dark:bg-white/5">
              #{ticket.id}
            </span>
            <h4 className="truncate text-sm font-bold text-gray-900 dark:text-white">
              {ticket.subject}
            </h4>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            {ownerName && (
              <span className="rounded-full bg-violet-500/10 px-2 py-0.5 font-medium text-violet-600 dark:text-violet-400">
                {ownerName}
              </span>
            )}
            <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-600 dark:bg-white/5 dark:text-gray-300">
              {departmentLabels[ticket.department] ?? ticket.department}
            </span>
            {priority && (
              <span className={`rounded-full px-2 py-0.5 font-medium ${priority.className}`}>
                {priority.label}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 pt-3 pr-3 md:justify-end md:border-t-0 md:pt-0 dark:border-white/10">
        <span className={`rounded-full border px-3 py-1 text-[11px] font-bold ${status.badge}`}>
          {status.label}
        </span>
        <span className="text-[11px] text-gray-400">
          {new Date(ticket.updated_at).toLocaleString("fa-IR", { dateStyle: "medium", timeStyle: "short" })}
        </span>
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="حذف تیکت"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-rose-500/10 hover:text-rose-500"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9.5 7V5.5A1.5 1.5 0 0 1 11 4h2a1.5 1.5 0 0 1 1.5 1.5V7m2 0-.65 11.05A2 2 0 0 1 13.86 20h-3.72a2 2 0 0 1-1.99-1.95L7.5 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}