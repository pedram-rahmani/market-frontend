import Image from "next/image";
import Link from "next/link";
import { useNotifications } from "@/store/hooks/useNotifications";

interface DashboardGreetingProps {
  userName: string;
  userAvatar?: string;
}

export default function DashboardGreeting({
  userName,
  userAvatar,
}: DashboardGreetingProps) {
  const { notificationCounts } = useNotifications();
  const unreadCount = Object.values(notificationCounts).reduce(
    (total, count) => total + count,
    0,
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm dark:border-white/5 dark:bg-ui-blue-900 sm:p-6">
      <div className="pointer-events-none absolute -left-20 -top-20 size-48 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-20 -right-20 size-48 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="flex items-center justify-between relative z-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-tr from-violet-600 to-cyan-500 text-sm font-bold text-white shadow-sm sm:size-12 sm:text-base">
            {userAvatar ? (
              <Image
                src={userAvatar}
                alt={userName || "کاربر"}
                fill
                sizes="48px"
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              userName ? userName.charAt(0).toUpperCase() : "کاربر"
            )}
          </div>

          <div>
            <span className="block text-[11px] text-gray-400 dark:text-gray-300/60 sm:text-xs">
              پنل مدیریت حساب
            </span>

            <h1 className="text-sm font-bold tracking-tight text-gray-800 dark:text-white sm:text-lg">
              سلام، {userName} عزیز
            </h1>
          </div>
        </div>

        <Link
          href="/my-account/notifications"
          aria-label="مشاهده اعلان‌ها"
          className={`group flex shrink-0 items-center gap-2 rounded-xl border px-2.5 py-2 transition-all sm:px-3 ${
            unreadCount > 0
              ? "border-violet-300 bg-violet-50 text-violet-700 shadow-sm shadow-violet-500/10 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300"
              : "border-gray-100 bg-gray-50 text-gray-500 hover:border-violet-200 hover:text-violet-600 dark:border-white/5 dark:bg-dark-800 dark:text-gray-300 dark:hover:border-violet-500/30 dark:hover:text-violet-400"
          }`}
        >
          <span className={`relative flex size-8 items-center justify-center rounded-lg shadow-sm ${
            unreadCount > 0
              ? "bg-violet-600 text-white"
              : "bg-white text-violet-500 dark:bg-white/5"
          }`}>
            <svg viewBox="0 0 24 24" fill="none" className="size-4.5!">
              <path
                d="M12.02 2.91c-3.5 0-6.17 2.67-6.17 6.17v2.33c0 .5-.25 1.17-.5 1.67l-1 1.67c-.67 1.17.17 2.67 1.5 2.67h14.34c1.33 0 2.17-1.5 1.5-2.67l-1-1.67c-.25-.5-.5-1.17-.5-1.67V9.08c0-3.5-2.67-6.17-6.17-6.17zM10.02 21.08c.5.67 1.33 1.08 2 1.08s1.5-.42 2-1.08"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                {unreadCount > 99 ? "۹۹+" : unreadCount}
              </span>
            )}
          </span>
          <span className="hidden text-xs font-bold sm:block">
            {unreadCount > 0 ? "پیام جدید دارید" : "اعلان‌ها"}
          </span>
        </Link>
      </div>
    </div>
  );
}