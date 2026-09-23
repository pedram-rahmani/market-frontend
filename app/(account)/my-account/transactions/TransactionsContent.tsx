"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { BaseSkeleton } from "@/components/ui/Skeletons/Skeletons";
import QuickTransactionForm from "@/components/user/UserAccount/transactions/QuickTransactionForm";
import TransactionLedger from "@/components/user/UserAccount/transactions/TransactionLedger";
import { e2f } from "@/lib/utils";

interface WalletData {
  balance: number;
  status: string;
  last_transaction?: {
    amount: number;
    type: "deposit" | "withdraw" | "purchase";
    status: string;
    description: string;
    ref_id: string;
    date: string;
  } | null;
}

export default function TransactionsContent() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // wallet info
  const fetchWallet = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/wallet");
      setWallet(response.data);
    } catch (error) {
      console.error("خطا در دریافت اطلاعات کیف پول", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        کیف پول و تراکنش‌ها
      </h2>

      {/* wallet balance and quick transaction form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between space-y-4">
            <BaseSkeleton className="w-32 h-4" />
            <BaseSkeleton className="w-48 h-8" />
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <BaseSkeleton className="w-20 h-4" />
              <BaseSkeleton className="w-16 h-4" />
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden bg-linear-to-bl from-blue-600 via-indigo-600 to-violet-700 text-white p-6 rounded-2xl shadow-xl shadow-blue-600/15 flex flex-col justify-between border border-blue-400/20">

            <div className="absolute -left-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
            <div className="absolute -right-10 -bottom-10 size-40 rounded-full bg-black/10 blur-2xl pointer-events-none"></div>

            {/* card header */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-blue-100 text-xs sm:text-sm font-medium">
                موجودی فعلی کیف پول
              </span>
              <div className="flex size-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white">
                <svg className="size-5!" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </div>
            </div>

            {/* balance */}
            <div className="relative z-10 my-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black tracking-tight">
                  {wallet ? e2f(wallet.balance) : "۰"}
                </span>
                <span className="text-sm sm:text-base font-medium text-blue-100">
                  تومان
                </span>
              </div>
            </div>

            {/* card footer */}
            <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs">
              <span className="text-blue-200">وضعیت حساب کاربری:</span>
              <span
                className={`px-3 py-1 rounded-full font-semibold backdrop-blur-md border ${
                  wallet?.status === "active"
                    ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/30"
                    : "bg-amber-500/20 text-amber-200 border-amber-400/30"
                }`}
              >
                {wallet?.status === "active" ? "فعال" : "غیرفعال"}
              </span>
            </div>
          </div>
        )}

        <QuickTransactionForm onSuccess={fetchWallet} />
      </div>

      {/* transaction ledger component */}
      <TransactionLedger
        loading={loading}
        transaction={wallet?.last_transaction}
      />
    </div>
  );
}