"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Select from "@/components/ui/Form/Select";
import Checkbox from "@/components/ui/Form/Checkbox";
import axiosInstance from "@/lib/axiosInstance";
import useLockBodyScroll from "@/store/hooks/useLockBodyScroll";
import { toGregorian, toJalaali } from "jalaali-js";

interface CouponFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingCoupon: any | null;
  setPopup: (popup: { isOpen: boolean; message: string; type: "success" | "error" }) => void;
}

const initialFormState = {
  code: "",
  type: "percent",
  value: "",
  min_order_price: "",
  max_discount: "",
  usage_limit: "",
  expires_at: "",
  user_id: "",
  is_active: false,
};

export default function CouponForm({ isOpen, onClose, onSuccess, editingCoupon, setPopup }: CouponFormProps) {
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState(initialFormState);
  const [displayDate, setDisplayDate] = useState("");

  useLockBodyScroll(isOpen);

  useEffect(() => {
    setMounted(true);
    axiosInstance.get("/users").then((res) => {
      const list = res.data.users || res.data.data || res.data;
      if (Array.isArray(list)) {
        setUsers(list.map((u: any) => ({
          value: u.id,
          label: `${u.name || "بدون نام"} (${u.phone || u.email || "بدون تماس"})`,
        })));
      }
    }).catch((err) => console.error("خطا در دریافت کاربران", err));
  }, []);

  // پر کردن فرم هنگام ویرایش یا ریست کردن موقع بسته شدن/افزودن
  useEffect(() => {
    if (editingCoupon) {
      const exp = editingCoupon.expires_at ? editingCoupon.expires_at.split("T")[0] : "";
      setForm({
        code: editingCoupon.code || "",
        type: editingCoupon.type || "percent",
        value: editingCoupon.value || "",
        min_order_price: editingCoupon.min_order_price || "",
        max_discount: editingCoupon.max_discount || "",
        usage_limit: editingCoupon.usage_limit || "",
        expires_at: exp,
        user_id: editingCoupon.users?.[0]?.id || editingCoupon.user_id || "",
        is_active: Boolean(editingCoupon.is_active),
      });

      if (exp) {
        const [gy, gm, gd] = exp.split("-").map(Number);
        const j = toJalaali(gy, gm, gd);
        setDisplayDate(`${j.jy}/${String(j.jm).padStart(2, "0")}/${String(j.jd).padStart(2, "0")}`);
      } else {
        setDisplayDate("");
      }
    } else {
      setForm(initialFormState);
      displayDate && setDisplayDate("");
    }
  }, [editingCoupon, isOpen]);

  const updateField = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let gregorianFormatted = form.expires_at || null;

    if (displayDate.includes("/")) {
      const [jd, jm, jy] = displayDate.split("/").map(Number);
      try {
        if (jy > 1000) {
          const g = toGregorian(jy, jm, jd);
          gregorianFormatted = `${g.gy}-${String(g.gm).padStart(2, "0")}-${String(g.gd).padStart(2, "0")}`;
        }
      } catch (err) {
        console.error("خطا در تبدیل تاریخ:", err);
      }
    }

    const payload = {
      ...form,
      user_id: form.user_id || null,
      expires_at: gregorianFormatted,
    };

    const request = editingCoupon
      ? axiosInstance.put(`/admin/coupons/${editingCoupon.id}`, payload)
      : axiosInstance.post("/admin/coupons", payload);

    request.then(() => {
      onSuccess();
      setPopup({ isOpen: true, message: editingCoupon ? "با موفقیت ویرایش شد" : "با موفقیت ایجاد شد", type: "success" });
      onClose();
    }).catch((err) => {
      setPopup({ isOpen: true, message: err.response?.data?.message || "خطا در انجام عملیات", type: "error" });
    });
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-dark-800/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-light dark:bg-dark-900 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col text-right">
        <div className="flex justify-between items-center p-6 pb-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {editingCoupon ? "ویرایش کد تخفیف" : "افزودن کد تخفیف جدید"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 cursor-pointer">✕</button>
        </div>

        <div className="overflow-y-auto scrollbar p-6 pt-2">
          <form id="coupon-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] text-gray-400">کد تخفیف (مثال: YALDA1405)</label>
              <input type="text" value={form.code} onChange={e => updateField("code", e.target.value)} className="input-info" required />
            </div>

            <div>
              <label className="text-[11px] text-gray-400 mb-1 block">نوع تخفیف</label>
              <Select options={[{ value: "percent", label: "درصدی (%)" }, { value: "fixed", label: "مبلغ ثابت (تومان)" }]} value={form.type} onChange={val => updateField("type", val)} variant="simple" className="h-10.5" />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] text-gray-400 mb-1 block">مختص کاربر خاص (اختیاری)</label>
              <Select options={[{ value: "", label: "عمومی (قابل استفاده برای همه)" }, ...users]} value={form.user_id} onChange={val => updateField("user_id", val)} variant="simple" className="h-10.5" />
              <span className="text-[10px] text-gray-500 mt-1 block">اگر کاربری انتخاب نکنید، کد تخفیف عمومی خواهد بود.</span>
            </div>

            <div>
              <label className="text-[11px] text-gray-400">مقدار ({form.type === "percent" ? "درصد" : "تومان"})</label>
              <input type="number" min="0" value={form.value} onChange={e => updateField("value", e.target.value)} onKeyDown={e => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()} className="input-info" required />
            </div>

            <div>
              <label className="text-[11px] text-gray-400">حداقل مبلغ سفارش (تومان)</label>
              <input type="number" min="0" value={form.min_order_price} onChange={e => updateField("min_order_price", e.target.value)} onKeyDown={e => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()} className="input-info" />
            </div>

            <div>
              <label className="text-[11px] text-gray-400">سقف تخفیف (مخصوص درصدی)</label>
              <input type="number" min="0" value={form.max_discount} onChange={e => updateField("max_discount", e.target.value)} onKeyDown={e => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()} className="input-info" />
            </div>

            <div>
              <label className="text-[11px] text-gray-400">محدودیت تعداد کل استفاده</label>
              <input type="number" min="0" value={form.usage_limit} onChange={e => updateField("usage_limit", e.target.value)} onKeyDown={e => ["-", "+", "e", "E"].includes(e.key) && e.preventDefault()} className="input-info" />
            </div>

            <div className="md:col-span-2">
              <label className="text-[11px] text-gray-400 block mb-1">تاریخ انقضا (فرمت: سال/ماه/روز)</label>
              <input type="text" placeholder="1406/11/28" value={displayDate} onChange={e => setDisplayDate(e.target.value)} className="input-info min-w-full" />
              <span className="text-[10px] text-gray-500 mt-1 block">تاریخ شمسی به شکل 1406/11/28. خالی بگذارید انقضا ندارد.</span>
            </div>

            <div className="md:col-span-2 pt-2">
              <Checkbox id="is_active" label="کوپن فعال باشد" checked={form.is_active} required={false} activeColor="bg-violet-600 border-violet-600" onInputHandler={(id, checked) => updateField(id, checked)} />
            </div>
          </form>
        </div>

        <div className="p-6 pt-2 border-t border-gray-100 dark:border-dark-800 bg-light dark:bg-dark-900 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-xl text-xs transition cursor-pointer">انصراف</button>
          <button type="submit" form="coupon-form" className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-violet-600/20 cursor-pointer">
            {editingCoupon ? "ذخیره تغییرات" : "ایجاد کد تخفیف"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}