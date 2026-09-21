"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SkeletonAvatar, BaseSkeleton } from "@/components/ui/Skeletons/Skeletons";
import { getImagePath } from "@/lib/utils";

interface UserInfoCardProps {
  user: any;
  onOpenEditModal: () => void;
}

export default function UserInfoCard({ user, onOpenEditModal }: UserInfoCardProps) {
  const isLoading = !user;

  const targetUser = user?.user || user;

  const userEmail = targetUser?.email || "ایمیل ثبت نشده";
  const userPhone = targetUser?.phone || targetUser?.addresses?.[0]?.phone || "شماره تماس ثبت نشده";
  
  const rawAddresses = targetUser?.addresses || user?.addresses;
  const defaultAddressObj = 
    Array.isArray(rawAddresses) 
      ? (rawAddresses.find((addr: any) => addr.is_default === true || addr.is_default === 1) || rawAddresses[0])
      : null;

  const userAddress =
    defaultAddressObj?.postal_address ||
    targetUser?.postal_address ||
    targetUser?.address ||
    user?.postal_address ||
    "آدرسی ثبت نشده است. برای تکمیل اطلاعات کلیک کنید.";

  const fullName = targetUser?.name || "کاربر عزیز";

  const currentAvatar = targetUser?.avatar ? getImagePath(targetUser.avatar) : null;
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    setAvatarFailed(false);
  }, [currentAvatar]);

  return (
    <div className="bg-white dark:bg-dark-900 border border-gray-200/80 dark:border-white/5 p-4 sm:p-6 rounded-2xl shadow-sm space-y-5">
      {/* cart header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
        <h2 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
          اطلاعات حساب کاربری
        </h2>

        <button
          onClick={onOpenEditModal}
          className="text-xs text-cyan-500 hover:text-cyan-400 font-medium cursor-pointer transition-colors bg-cyan-500/10 px-3 py-2 rounded-xl shrink-0"
          type="button"
        >
          ویرایش مشخصات
        </button>
      </div>

      {/* profile summary */}
      <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/70 p-3 dark:border-white/5 dark:bg-white/3 sm:p-4">
        <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-tr from-violet-600 to-cyan-500 font-bold text-white shadow-sm ring-4 ring-white dark:ring-white/5">
            {isLoading ? (
              <SkeletonAvatar size="w-16 h-16 rounded-2xl" />
            ) : currentAvatar && !avatarFailed ? (
              <Image
                src={currentAvatar}
                alt={fullName}
                fill
                sizes="64px"
                unoptimized
                onError={() => setAvatarFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl">{fullName.charAt(0).toUpperCase()}</span>
            )}
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-bold text-gray-900 dark:text-white sm:text-base">{fullName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">اطلاعات حساب کاربری شما</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            حساب کاربری فعال
          </span>
        </div>
      </div>

      {/* information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-sm">
        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3! dark:border-white/5 dark:bg-white/2 sm:border-0 sm:bg-transparent sm:p-3!">
          <span className="block dark:text-text-on-dark/50 text-xs mb-1">نام و نام خانوادگی</span>
          {isLoading ? (
            <BaseSkeleton className="w-28 h-5 mt-1" />
          ) : (
            <span className="font-semibold text-gray-800 dark:text-white text-xs sm:text-sm">{fullName}</span>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3! dark:border-white/5 dark:bg-white/2 sm:border-0 sm:bg-transparent sm:p-3!">
          <span className="block dark:text-text-on-dark/50 text-xs mb-1">شماره تماس</span>
          {isLoading ? (
            <BaseSkeleton className="w-32 h-5 mt-1" />
          ) : (
            <span className="font-semibold text-gray-800 dark:text-white text-xs sm:text-sm" dir="ltr">{userPhone}</span>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3! dark:border-white/5 dark:bg-white/2 sm:border-0 sm:bg-transparent sm:p-3!">
          <span className="block dark:text-text-on-dark/50 text-xs mb-1">ایمیل</span>
          {isLoading ? (
            <BaseSkeleton className="w-40 h-5 mt-1" />
          ) : (
            <span className="font-semibold text-gray-800 dark:text-white text-xs sm:text-sm" dir="ltr">{userEmail}</span>
          )}
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3! dark:border-white/5 dark:bg-white/2 sm:col-span-2 sm:border-0 sm:bg-transparent sm:p-3! lg:col-span-3">
          <span className="block dark:text-text-on-dark/50 text-xs mb-1">آدرس پستی</span>
          {isLoading ? (
            <BaseSkeleton className="w-full h-10 mt-1" />
          ) : (
            <span className="font-medium text-gray-800 dark:text-gray-200 text-xs sm:text-sm leading-relaxed block">
              {userAddress}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}