"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { useAppDispatch } from "@/store/hooks/storeHooks";
import { useAuth } from "@/store/hooks/useAuth";
import { logoutUser } from "@/store/slices/authSlice";
import axiosInstance from "@/lib/axiosInstance";
import useDate from "@/store/hooks/useDate";
import { useNotifications } from "@/store/hooks/useNotifications";
import { getSideBarItems } from "./sideBarData";

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideBar({ isOpen, onClose }: SideBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { user, token } = useAuth();
  const permissions =
    user?.permissions || (user as any)?.user?.permissions || [];
  const userRole = (user as any)?.user?.role || user?.role;

  const { notificationCounts, markAsReadByType } = useNotifications();
  const sideBarItems = getSideBarItems(notificationCounts);
  const currentDate = useDate(new Date(), "long");

  const isActive = (link: string) => {
    if (link === "/my-account") return pathname === link;
    return pathname.startsWith(link);
  };

  const filteredItems = sideBarItems.filter((item) => {
    if (userRole === "admin") return true;
    if (item.permission) {
      return permissions.includes(item.permission);
    }
    return true;
  });

  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        "/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_id");
      dispatch(logoutUser());
      router.push("/");
    }
  };

  return (
    <>
      {/* overlay for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed right-0 bottom-0 top-0 w-67 flex flex-col shrink-0 bg-white dark:bg-ui-blue-900 py-4 z-50 shadow-lg border-l border-gray-100 dark:border-white/5 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mx-6 bg-violet-600 text-white rounded-2xl px-4 py-5 shadow-xl shadow-violet-500/20 mb-8 text-center relative">
          <button
            onClick={onClose}
            className="absolute left-3 top-3 text-white/80 hover:text-white md:hidden text-lg"
          >
            <svg viewBox="0 0 24 24" className="size-5!">
              <path d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="flex items-center justify-center font-bold truncate">
            {(user as any)?.user?.username || user?.username || "کاربر مهمان"}
          </span>
          <span className="text-xs mt-2 block opacity-80">{currentDate}</span>
        </div>

        <nav className="account-nav flex-1 overflow-y-auto px-4 space-y-1 ml-1">
          {filteredItems.map((item, index) => {
            const badgeCount = notificationCounts[item.typeKey] || 0;
            return (
              <Link
                key={index}
                href={item.link}
                onClick={() => {
                  if (badgeCount > 0 && item.typeKey)
                    markAsReadByType(item.typeKey);
                  onClose();
                }}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive(item.link)
                    ? "bg-violet-500/10 text-violet-500 font-bold"
                    : "text-text-on-light/90 dark:text-custom-gray-400 hover:bg-ui-purple/5 dark:hover:bg-ui-purple/8"
                }`}
              >
                <div className="flex items-center gap-x-3 [&_svg]:size-5!">
                  <span
                    className={
                      isActive(item.link)
                        ? "text-violet-500"
                        : "text-gray-400 group-hover:text-ui-purple/80"
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm group-hover:text-ui-purple">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {badgeCount > 0 && (
                    <span className="min-w-5 h-5 px-1.5 pt-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {badgeCount}
                    </span>
                  )}
                  {isActive(item.link) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-ui-purple"></div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-auto pt-4 border-t border-gray-200 dark:border-white/5">
          <button
            className="w-full flex items-center gap-x-3 px-4 py-4 rounded-xl text-red-500 hover:bg-ui-red-600/6 dark:hover:bg-ui-red-600/12 transition-all font-bold text-sm cursor-pointer"
            onClick={handleLogout}
          >
            <svg viewBox="0 0 24 24" className="size-5!">
              <path d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
            خروج از حساب
          </button>
        </div>
      </aside>
    </>
  );
}
