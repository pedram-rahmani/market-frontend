"use client";

import React, { useState } from "react";
import WalletSummaryCard from "./WalletSummaryCard";
import TransactionItem, { Transaction } from "./TransactionItem";

// داده‌های تستی (برای شروع و تست ظاهر صفحه)
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    title: "شارژ کیف پول (درگاه زرین‌پال)",
    amount: 500000,
    type: "deposit",
    status: "success",
    date: "۱ مهر ۱۴۰۵ - ۱۴:۳۰",
    refId: "ZP-1405-9821",
  },
  {
    id: 2,
    title: "خرید محصول آموزشی لاراول پیشرفته",
    amount: 250000,
    type: "withdraw",
    status: "success",
    date: "۳۰ شهریور ۱۴۰۵ - ۱۱:۱۵",
    refId: "ORD-8821",
  },
  {
    id: 3,
    title: "برداشت وجه به حساب بانکی",
    amount: 100000,
    type: "withdraw",
    status: "pending",
    date: "۲۸ شهریور ۱۴۰۵ - ۰۹:۲۰",
  },
];

export default function TransactionsContent() {
  const [balance, setBalance] = useState(1250000);
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const handleDeposit = () => {
    alert("مبدال افزایش موجودی (می‌توانید مودم یا درگاه وصل کنید)");
  };

  const handleWithdraw = () => {
    alert("مدال درخواست برداشت وجه");
  };

  return (
    <div className="space-y-6">
      {/* کارت خلاصه کیف پول */}
      <WalletSummaryCard
        balance={balance}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
      />

      {/* لیست تراکنش‌ها */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white">
            تاریخچه تراکنش‌ها
          </h3>
          <span className="text-xs text-gray-400">
            مجموع: {transactions.length} تراکنش
          </span>
        </div>

        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 dark:bg-ui-blue-900 dark:border-white/5">
            <p className="text-sm text-gray-400">تراکنشی ثبت نشده است.</p>
          </div>
        )}
      </div>
    </div>
  );
}