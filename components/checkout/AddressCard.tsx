"use client";

import { BaseSkeleton } from "@/components/ui/Skeletons/Skeletons";

interface Address {
  phone?: string;
  postal_address?: string;
}

interface AddressCardProps {
  userInfo?: {
    name?: string;
    phone?: string;
    address?: string;
    addresses?: Address[];
  };
  loading?: boolean;
  onEdit: () => void;
}

export default function AddressCard({ userInfo, loading, onEdit }: AddressCardProps) {
  const defaultAddress = userInfo?.addresses?.[0];
  const displayPhone = defaultAddress?.phone ?? userInfo?.phone ?? "---";
  const displayAddress = defaultAddress?.postal_address ?? userInfo?.address ?? "آدرسی ثبت نشده است";

  if (loading) {
    return (
      <div className="bg-white dark:bg-ui-blue-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
          <BaseSkeleton className="w-36 h-5" />
          <BaseSkeleton className="w-20 h-4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <BaseSkeleton className="w-24 h-3" />
            <BaseSkeleton className="w-32 h-4" />
          </div>
          <div className="space-y-2">
            <BaseSkeleton className="w-24 h-3" />
            <BaseSkeleton className="w-28 h-4" />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <BaseSkeleton className="w-20 h-3" />
            <BaseSkeleton className="w-full h-8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-ui-blue-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-3">
        <h2 className="text-sm font-bold text-gray-800 dark:text-white">
          مشخصات تحویل گیرنده و آدرس
        </h2>
        <button 
          onClick={onEdit}
          className="text-xs text-violet-600 dark:text-violet-400 font-bold hover:underline cursor-pointer"
        >
          ویرایش اطلاعات
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700 dark:text-gray-300">
        <div>
          <span className="text-gray-400 block mb-1">نام و نام خانوادگی:</span>
          <span className="font-bold">{userInfo?.name || "ثبت نشده"}</span>
        </div>
        <div>
          <span className="text-gray-400 block mb-1">شماره موبایل:</span>
          <span className="font-bold">{displayPhone}</span>
        </div>
        <div className="sm:col-span-2">
          <span className="text-gray-400 block mb-1">آدرس پستی:</span>
          <span className="font-bold leading-relaxed">{displayAddress}</span>
        </div>
      </div>
    </div>
  );
}