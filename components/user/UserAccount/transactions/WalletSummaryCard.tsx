"use client";

import React from "react";

interface WalletSummaryCardProps {
  balance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export default function WalletSummaryCard({
  balance,
  onDeposit,
  onWithdraw,
}: WalletSummaryCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-6 text-white shadow-xl shadow-violet-500/20">
      {/* المان‌های دکوراتیو پس‌زمینه */}
      <div className="absolute -left-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl"></div>
      <div className="absolute -right-10 -bottom-10 size-40 rounded-full bg-black/10 blur-2xl"></div>

      <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-violet-200">
            <svg viewBox="0 0 24 24" className="size-5">
              <path fill="currentColor" d="M21 18v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1h-2V5a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1h2M12 12a2 2 0 1 0 2-2a2 2 0 0 0-2 2Z"/>
            </svg>
            <span className="text-xs font-medium">موجودی فعلی کیف پول</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight sm:text-4xl">
              {balance.toLocaleString("fa-IR")}
            </span>
            <span className="text-xs font-bold text-violet-200">تومان</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onDeposit}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-white text-violet-700 font-bold text-sm shadow-md hover:bg-violet-50 transition active:scale-95"
          >
            + افزایش موجودی
          </button>
          <button
            type="button"
            onClick={onWithdraw}
            className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-white/10 text-white border border-white/20 font-bold text-sm hover:bg-white/20 transition active:scale-95"
          >
            برداشت وجه
          </button>
        </div>
      </div>
    </div>
  );
}