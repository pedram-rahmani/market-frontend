"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";

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
      <div className="bg-gray-900/50 border border-gray-800/80 p-6 rounded-3xl flex justify-center py-10 backdrop-blur-md">
        <span className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800/80 p-6 rounded-3xl space-y-4 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-600" />
          کدهای تخفیف من
        </h3>
        <span className="text-xs text-gray-400">{coupons.length} کد فعال</span>
      </div>

      {error && <p className="text-xs text-rose-500">{error}</p>}

      {coupons.length === 0 ? (
        <p className="text-xs text-gray-500 text-center py-6">کد تخفیف فعالی برای شما ثبت نشده است.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs text-violet-400 font-medium">{coupon.title || "تخفیف اختصاصی"}</span>
                <div className="text-white font-bold text-sm">{coupon.discountValue}</div>
                {coupon.expireDate && <p className="text-[11px] text-gray-500">انقضا: {coupon.expireDate}</p>}
              </div>
              
              <button
                onClick={() => handleCopy(coupon.code, coupon.id)}
                className="bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 px-3 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
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