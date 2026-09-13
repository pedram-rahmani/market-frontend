import { SkeletonAvatar, BaseSkeleton } from "@/components/ui/Skeletons/Skeletons";

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

  const currentAvatar = targetUser?.avatar 
    ? `http://127.0.0.1:8000/storage/${targetUser.avatar}` 
    : null;

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

      {/* avatar */}
      <div className="flex flex-col items-start py-2">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-primary to-info flex items-center justify-center text-white font-bold shadow-sm overflow-hidden shrink-0 ring-4 ring-gray-50 dark:ring-white/5 mb-2">
            {isLoading ? (
              <SkeletonAvatar size="w-16 h-16 rounded-2xl" />
            ) : currentAvatar ? (
              <img src={currentAvatar} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl">{fullName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          
          {isLoading ? (
            <BaseSkeleton className="w-24 h-4 mt-1" />
          ) : (
            <span className="text-xs text-gray-400 dark:text-text-on-dark/50 font-medium text-center">
              {fullName}
            </span>
          )}
        </div>
      </div>

      {/* information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-sm">
        <div className="bg-gray-50/50 dark:bg-white/2 sm:bg-transparent p-3! sm:p-0 rounded-xl border border-gray-100 dark:border-white/5 sm:border-0">
          <span className="block dark:text-text-on-dark/50 text-xs mb-1">نام و نام خانوادگی</span>
          {isLoading ? (
            <BaseSkeleton className="w-28 h-5 mt-1" />
          ) : (
            <span className="font-semibold text-gray-800 dark:text-white text-xs sm:text-sm">{fullName}</span>
          )}
        </div>

        <div className="bg-gray-50/50 dark:bg-white/2 sm:bg-transparent p-3! sm:p-0 rounded-xl border border-gray-100 dark:border-white/5 sm:border-0">
          <span className="block dark:text-text-on-dark/50 text-xs mb-1">شماره تماس</span>
          {isLoading ? (
            <BaseSkeleton className="w-32 h-5 mt-1" />
          ) : (
            <span className="font-semibold text-gray-800 dark:text-white text-xs sm:text-sm" dir="ltr">{userPhone}</span>
          )}
        </div>

        <div className="bg-gray-50/50 dark:bg-white/2 sm:bg-transparent p-3! sm:p-0 rounded-xl border border-gray-100 dark:border-white/5 sm:border-0">
          <span className="block dark:text-text-on-dark/50 text-xs mb-1">ایمیل</span>
          {isLoading ? (
            <BaseSkeleton className="w-40 h-5 mt-1" />
          ) : (
            <span className="font-semibold text-gray-800 dark:text-white text-xs sm:text-sm" dir="ltr">{userEmail}</span>
          )}
        </div>

        <div className="sm:col-span-2 lg:col-span-3 bg-gray-50/50 dark:bg-white/2 sm:bg-transparent p-3! sm:p-0 rounded-xl border border-gray-100 dark:border-white/5 sm:border-0">
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