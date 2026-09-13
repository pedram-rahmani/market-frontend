"use client";

import { useEffect, forwardRef } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/axiosInstance";
import Image from "next/image";
import avatarPlaceHolder from "@/public/images/avatar-placeholder.png";

import SpinnerLoader from "@/components/ui/SpinnerLoader/SpinnerLoader";
import { useAppDispatch, useAppSelector } from "@/store/hooks/storeHooks";
import { useAuth } from "@/store/hooks/useAuth";
import { logoutUser } from "@/store/slices/authSlice";
import { fetchWallet } from "@/store/slices/walletSlice";

interface UserModalProps {
  showProfile: boolean;
  onClose?: () => void;
}

const UserModal = forwardRef<HTMLDivElement, UserModalProps>(
  ({ showProfile }, ref) => {
    const dispatch = useAppDispatch();
    const { user, token } = useAuth();

    // username info
    const username = (user as any)?.user?.name || user?.name || "کاربر مهمان";

    const permissions =
      user?.permissions || (user as any)?.user?.permissions || [];
    const userRole = (user as any)?.user?.role || user?.role;
    const isAdminOrStaff = userRole === "admin" || permissions.length > 0;

    const dashboardLink = isAdminOrStaff
      ? "/my-account/user-management"
      : "/my-account";
    const dashboardLabel = isAdminOrStaff ? "داشبورد مدیریت" : "پیشخوان";

    // account balance
    const { balance, loading } = useAppSelector((state) => state.wallet);

    useEffect(() => {
      if (showProfile && token && balance === null && !loading) {
        dispatch(fetchWallet());
      }
    }, [showProfile, token, balance, loading, dispatch]);

    const handleLogout = async () => {
      try {
        await axiosInstance.post(
          "/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_id");
        dispatch(logoutUser());
        window.location.href = "/";
      }
    };

    return (
      <div
        ref={ref}
        className={`absolute left-0 top-full pt-4 z-50 transition-all duration-300 origin-top ${
          showProfile
            ? "opacity-100 visible translate-y-0 scale-100"
            : "opacity-0 invisible -translate-y-2 scale-95"
        }`}
      >
        {/* triangle */}
        <div className="absolute top-2.5 left-5 w-3 h-3 bg-white/95 dark:bg-[#16161a] border-t border-l border-gray-200 dark:border-white/5 rotate-45 z-10"></div>
        <div
          className="relative w-72 bg-white/95 dark:bg-[#16161a]/95 border border-gray-200 dark:border-white/10 p-5 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden text-right"
          dir="rtl"
        >
          {/* user info section */}
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/5 pb-4 mb-3">
            {/* avatar */}
            <div className="relative shrink-0">
              <Image
                src={avatarPlaceHolder}
                alt={username}
                className="object-cover size-12 rounded-full border-2 border-violet-500/20"
              />
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-[#16161a] rounded-full"></div>
            </div>

            {/* details: name & balance */}
            <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden">
              {/* username */}
              <span className="text-sm font-bold text-gray-800/80 dark:text-text-on-dark/80 truncate">
                {username}
              </span>

              {/* wallet balance */}
              <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span>موجودی:</span>
                {loading ? (
                  <SpinnerLoader variant="multi-color" className="h-3 w-3" />
                ) : (
                  <span className="truncate">
                    {balance?.toLocaleString() || "۰"}{" "}
                    <span className="text-[10px]">تومان</span>
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* modal links */}
          <nav className="space-y-1">
            <Link
              href={dashboardLink}
              className="flex items-center gap-x-3 px-3 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-violet-500/10 hover:text-violet-500 transition-all group"
            >
              <svg viewBox="0 0 24 24" className="size-5! shrink-0">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              <span className="text-sm font-medium">{dashboardLabel}</span>
            </Link>

            <Link
              href="/my-account/purchases"
              className="flex items-center gap-x-3 px-3 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-violet-500/10 hover:text-violet-500 transition-all group"
            >
              <svg viewBox="0 0 24 24" className="size-5! shrink-0">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="text-sm font-medium">خریدهای من</span>
            </Link>

            <Link
              href="/my-account/settings"
              className="flex items-center gap-x-3 px-3 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-violet-500/10 hover:text-violet-500 transition-all group"
            >
              <svg viewBox="0 0 24 24" className="size-5! shrink-0">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-sm font-medium">جزئیات حساب</span>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-x-3 px-3 py-3 mt-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-all border-t border-gray-100 dark:border-white/5 pt-4 cursor-pointer group"
            >
              <svg viewBox="0 0 24 24" className="size-5! shrink-0">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="text-sm font-bold">خروج از حساب</span>
            </button>
          </nav>
        </div>
      </div>
    );
  },
);

UserModal.displayName = "UserModal";
export default UserModal;