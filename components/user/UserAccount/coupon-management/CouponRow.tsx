"use client";

import React from "react";
import { toJalaali } from "jalaali-js";

interface CouponRowProps {
  coupon: any;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CouponRow({
  coupon,
  onEdit,
  onDelete,
}: CouponRowProps) {
  // jalali to gregorian conversion
  const formatPersianDate = (dateString: string) => {
    if (!dateString) return "بدون انقضا";
    try {
      const parts = dateString.split("T")[0].split("-");
      if (parts.length === 3) {
        const gy = parseInt(parts[0], 10);
        const gm = parseInt(parts[1], 10);
        const gd = parseInt(parts[2], 10);
        const jDate = toJalaali(gy, gm, gd);
        return `${jDate.jy}/${String(jDate.jm).padStart(2, "0")}/${String(jDate.jd).padStart(2, "0")}`;
      }
    } catch (error) {
      return dateString;
    }
    return dateString;
  };

  return (
    <tr className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
      {/* Coupon Code */}
      <td className="p-4 font-mono font-bold text-violet-400 whitespace-nowrap">
        {coupon.code}
      </td>

      {/* Discount Type */}
      <td className="p-4 whitespace-nowrap">
        {coupon.type === "percent" ? "درصدی (%)" : "مبلغ ثابت"}
      </td>

      {/* Discount Value */}
      <td className="p-4 font-bold whitespace-nowrap">
        {coupon.type === "percent"
          ? `${coupon.value}%`
          : `${Number(coupon.value).toLocaleString()} تومان`}
      </td>

      {/* Minimum Order Price */}
      <td className="p-4 text-gray-400 whitespace-nowrap">
        {coupon.min_order_price
          ? `${Number(coupon.min_order_price).toLocaleString()} تومان`
          : "بدون محدودیت"}
      </td>

      {/* Usage Limit */}
      <td className="p-4 text-gray-400 whitespace-nowrap">
        {coupon.usage_limit ? `${coupon.usage_limit} بار` : "نامحدود"}
      </td>

      {/* Expiration Date */}
      <td className="p-4 text-gray-400 whitespace-nowrap">
        {formatPersianDate(coupon.expires_at)}
      </td>

      {/* Active Status Badge */}
      <td className="p-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-xl text-[10px] font-medium ${
            coupon.is_active
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
          {coupon.is_active ? "فعال" : "غیرفعال"}
        </span>
      </td>

      {/* Action Buttons Group */}
      <td className="p-4 whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="btn-edit flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer"
            type="button"
          >
            <svg
              className="size-3.5!"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            ویرایش
          </button>

          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="btn-delete flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs cursor-pointer"
            type="button"
          >
            <svg
              className="size-3.5!"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            حذف
          </button>
        </div>
      </td>
    </tr>
  );
}