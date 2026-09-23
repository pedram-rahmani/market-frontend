"use client";

import React from "react";

export interface Transaction {
  id: string | number;
  title: string;
  amount: number;
  type: "deposit" | "withdraw"; // واریز یا برداشت
  status: "success" | "pending" | "failed";
  date: string;
  refId?: string;
}

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const isDeposit = transaction.type === "deposit";

  const statusConfig = {
    success: { label: "موفق", bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" },
    pending: { label: "در انتظار", bg: "bg-amber-50 text-amber-600 dark:bg-amber-500/10" },
    failed: { label: "ناموفق", bg: "bg-rose-50 text-rose-600 dark:bg-rose-500/10" },
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all hover:border-violet-200 dark:bg-ui-blue-900 dark:border-white/5">
      <div className="flex items-center gap-4">
        {/* آیکون نوع تراکنش */}
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
            isDeposit
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
              : "bg-rose-50 text-rose-600 dark:bg-rose-500/10"
          }`}
        >
          {isDeposit ? (
            <svg viewBox="0 0 24 24" className="size-6">
              <path fill="currentColor" d="M11 6h2v9h3l-4 4l-4-4h3V6m-7 13h16v2H4v-2Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-6">
              <path fill="currentColor" d="M11 18h2V9h3l-4-4l-4 4h3v9m-7-13h16v-2H4v2Z" />
            </svg>
          )}
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-800 dark:text-white">
            {transaction.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-gray-400">{transaction.date}</span>
            {transaction.refId && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-[11px] text-gray-400">کد پیگیری: {transaction.refId}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5">
        <span
          className={`text-sm font-black ${
            isDeposit ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isDeposit ? "+" : "-"} {transaction.amount.toLocaleString("fa-IR")} تومان
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusConfig[transaction.status].bg}`}>
          {statusConfig[transaction.status].label}
        </span>
      </div>
    </div>
  );
}