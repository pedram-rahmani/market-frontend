"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import CouponRow from "@/components/user/UserAccount/coupon-management/CouponRow";
import CouponForm from "@/components/user/UserAccount/coupon-management/CouponForm";
import DeleteConfirmModal from "@/components/feedback/MessageModal/DeleteConfirmModal";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteCouponCode, setDeleteCouponCode] = useState<string>("");

  const [popup, setPopup] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({ isOpen: false, message: "", type: "success" });

  const fetchCoupons = () => {
    setLoading(true);
    axiosInstance
      .get("/admin/coupons")
      .then((res) => {
        setCoupons(res.data.data || res.data);
      })
      .catch((err) => console.error("خطا در دریافت کوپن‌ها:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await axiosInstance.delete(`/admin/coupons/${deleteId}`);
      setPopup({
        isOpen: true,
        message: "کد تخفیف با موفقیت حذف شد",
        type: "success",
      });
      fetchCoupons();
    } catch {
      setPopup({ isOpen: true, message: "خطا در حذف کد تخفیف", type: "error" });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="مدیریت کدهای تخفیف"
        buttonText={"+ افزودن کد تخفیف"}
        canClick={true}
        isLoading={loading}
        onButtonClick={() => {
          setEditingCoupon(null);
          setIsModalOpen(true);
        }}
      />

      {/* فرم و مودال کوپن به صورت یکجا */}
      <CouponForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCoupon(null);
        }}
        onSuccess={fetchCoupons}
        editingCoupon={editingCoupon}
        setPopup={setPopup}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title={deleteCouponCode}
      />

      <SimplePopup
        isOpen={popup.isOpen}
        onClose={() => setPopup({ ...popup, isOpen: false })}
        message={popup.message}
        type={popup.type}
      />

      <div className="p-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-12 w-full bg-gray-200 dark:bg-dark-800/40 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16 text-xs text-gray-400 dark:text-gray-500">
            هیچ کد تخفیفی ثبت نشده است.
          </div>
        ) : (
          <div className="bg-light dark:bg-dark-900/20 overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden backdrop-blur-md shadow-sm">
            <table className="w-full text-right text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800/80">
                <tr>
                  <th className="p-4 font-medium">کد تخفیف</th>
                  <th className="p-4 font-medium">نوع</th>
                  <th className="p-4 font-medium">مقدار</th>
                  <th className="p-4 font-medium">حداقل خرید</th>
                  <th className="p-4 font-medium">محدودیت تعداد</th>
                  <th className="p-4 font-medium">تاریخ انقضا</th>
                  <th className="p-4 font-medium">وضعیت</th>
                  <th className="p-4 font-medium text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/40">
                {coupons.map((coupon: any) => (
                  <CouponRow
                    key={coupon.id}
                    coupon={coupon}
                    onEdit={() => {
                      setEditingCoupon(coupon);
                      setIsModalOpen(true);
                    }}
                    onDelete={() => {
                      setDeleteId(coupon.id);
                      setDeleteCouponCode(coupon.code);
                      setIsDeleteModalOpen(true);
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
