"use client";

import { useState } from "react";
import { CartSummaryProps } from "@/types/cart";
import axiosInstance from "@/lib/axiosInstance";
import useDiscount from "@/store/hooks/useDiscount";

interface ExtendedCartSummaryProps extends CartSummaryProps {
  totalQuantity?: number;
  isLoading?: boolean;
  onApplyDiscount?: (discountAmount: number, couponId: number, code: string) => void;
  appliedDiscountAmount?: number;
  totalDiscount?: number;
}

export default function CartSummary({
  totalPrice,
  totalDiscount = 0,
  totalQuantity = 0,
  isLoading = false,
  onCheckout,
  onApplyDiscount,
  appliedDiscountAmount = 0,
}: ExtendedCartSummaryProps) {
  const [couponCode, setCouponCode] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // calculate grand total discount (product discount + applied discount code)
  const grandTotalDiscount = Number(totalDiscount) + Number(appliedDiscountAmount);

  // total price after applying all discounts
  const discountHook = useDiscount(totalPrice, grandTotalDiscount, false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setLoadingCoupon(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axiosInstance.post("/coupons/apply", {
        code: couponCode.trim(),
        total_price: totalPrice - totalDiscount,
      });

      const { discount_amount, coupon_id, message } = response.data;
      
      setSuccessMessage(message);
      if (onApplyDiscount) {
        onApplyDiscount(discount_amount, coupon_id, couponCode.trim());
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "خطایی در اعمال کد تخفیف رخ داد."
      );
    } finally {
      setLoadingCoupon(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl space-y-5 shadow-xl shadow-violet-500/5 dark:shadow-none relative overflow-hidden transition-all">
      
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <h3 className="text-gray-800 dark:text-white font-bold text-base flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
          خلاصه سفارش
        </h3>
        {totalQuantity > 0 && (
          <span className="text-[11px] font-medium bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 px-2.5 py-1 rounded-full border border-violet-100 dark:border-violet-900/50">
            {totalQuantity} کالا
          </span>
        )}
      </div>

      <form onSubmit={handleApply} className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="کد تخفیف"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 bg-gray-50 dark:bg-gray-800/50 border! border-gray-200! dark:border-gray-700! rounded-xl px-3! py-2! text-xs text-text-on-light dark:text-text-on-dark focus:border-violet-500!"
          />
          <button
            type="submit"
            disabled={loadingCoupon}
            className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-medium transition cursor-pointer flex items-center justify-center min-w-15"
          >
            {loadingCoupon ? (
              <span className="w-3.5 h-3.5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              "اعمال"
            )}
          </button>
        </div>
        {errorMessage && (
          <p className="text-[11px] text-rose-500">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-[11px] text-emerald-500">{successMessage}</p>
        )}
      </form>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>مبلغ کل محصولات</span>
          <span>{Math.floor(totalPrice).toLocaleString("fa-IR")} تومان</span>
        </div>

        {totalDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>تخفیف کالاها</span>
            <span>{Math.floor(totalDiscount).toLocaleString("fa-IR")} - تومان</span>
          </div>
        )}

        {appliedDiscountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>کد تخفیف اعمال شده</span>
            <span>{Math.floor(appliedDiscountAmount).toLocaleString("fa-IR")} - تومان</span>
          </div>
        )}

        {grandTotalDiscount > 0 && (
          <div className="bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 flex items-center justify-between text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              سود شما از این خرید
            </span>
            <span className="font-bold">{discountHook.discountAmount.toLocaleString("fa-IR")} تومان</span>
          </div>
        )}

        <div className="flex items-center justify-between font-bold text-base text-gray-800 dark:text-white pt-4 border-t border-gray-100 dark:border-gray-800">
          <span>مبلغ قابل پرداخت</span>
          <div className="flex items-center gap-1 text-violet-600 dark:text-violet-400">
            <span className="text-base font-extrabold">{discountHook.finalPrice}</span>
            <span className="text-xs font-medium">تومان</span>
          </div>
        </div>
      </div>

      <button
        onClick={onCheckout}
        disabled={isLoading}
        className="w-full py-3 sm:py-4 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 cursor-pointer flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
        type="button"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>در حال پردازش...</span>
          </>
        ) : (
          "ادامه فرایند خرید"
        )}
      </button>
    </div>
  );
}