"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import EmptyState from "@/components/ui/emptyState/EmptyState";

interface UserCoupon {
  id: number;
  code: string;
  title: string;
  discountValue: string;
  expireDate: string;
}

export default function UserCoupons() {
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/user/coupons")
      .then((res) => {
        setCoupons(res.data.data || res.data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setCoupons([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCopy = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-ui-blue-900">
        <span className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-ui-blue-900 sm:p-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-white/10">
        <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-white">
          <span className="size-2 rounded-full bg-violet-500" />
          کدهای تخفیف من
        </h3>
        <span className="text-xs text-gray-400">{coupons.length} کد فعال</span>
      </div>

      {error && <p className="text-xs text-rose-500">{error}</p>}

      {coupons.length === 0 ? (
        <EmptyState
          tone="violet"
          eyebrow="تخفیف‌های اختصاصی"
          title="کد تخفیف فعالی ندارید"
          description="کدهای تخفیف اختصاصی شما در این بخش نمایش داده می‌شوند."
          icon={
            <svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V5.257c0-1.105.895-2 2-2h15c1.105 0 2 .895 2 2Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.75h.008v.008H9V9.75Zm6 4.5h.008v.008H15v-.008Z" />
            </svg>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-white/10 dark:bg-dark-800/40">
              <div className="space-y-1">
                <span className="text-xs font-medium text-violet-600 dark:text-violet-400">{coupon.title || "تخفیف اختصاصی"}</span>
                <div className="text-sm font-bold text-gray-800 dark:text-white">{coupon.discountValue}</div>
                {coupon.expireDate && <p className="text-[11px] text-gray-500">انقضا: {coupon.expireDate}</p>}
              </div>
              
              <button
                onClick={() => handleCopy(coupon.code, coupon.id)}
                className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-600/10 px-3 py-2 text-xs font-mono font-bold text-violet-600 transition hover:bg-violet-600/20 dark:text-violet-300"
              >
                {copiedId === coupon.id ? (
                  <span className="text-emerald-400">کپی شد!</span>
                ) : (
                  <>
                    <span>{coupon.code}</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}