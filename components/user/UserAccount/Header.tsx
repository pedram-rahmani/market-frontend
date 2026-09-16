"use client";

import { useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import useTheme from "@/store/hooks/useTheme";
import useClickOutside from "@/store/hooks/useClickOutside";
import BasketModal from "@/components/cart/BasketModal/BasketModal";
import Link from "next/link";

interface HeaderProps {
  onOpenSidebar: () => void;
}

export default function Header({ onOpenSidebar }: HeaderProps) {
  const [theme, toggleTheme] = useTheme();
  const [showBasket, setShowBasket] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const basketRef = useRef<HTMLDivElement>(null!);

  useClickOutside(() => setShowBasket(false), [basketRef]);

  const getPageTitle = () => {
    if (pathname.includes("purchases")) return "خریدهای من";
    if (pathname.includes("settings")) return "تنظیمات حساب";
    if (pathname.includes("support")) return "پشتیبانی";
    return "پنل کاربری";
  };

  return (
    <div className="header sticky top-0 z-30 flex items-center justify-between py-5 px-4 sm:px-8 mb-5 md:mb-8 border-b border-gray-100 dark:border-white/5 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md">
      <div className="flex items-center gap-x-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-xl bg-violet-500/10 text-violet-500 hover:bg-violet-500/20 cursor-pointer"
          aria-label="باز کردن منو"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* backward btn */}
        <button
          type="button"
          onClick={() => router.back()}
          className="group flex items-center justify-center p-2 rounded-xl bg-dark-900/5 dark:bg-white/5 hover:bg-cyan-500/10 text-gray-500 dark:text-gray-400 hover:text-cyan-500 transition-all cursor-pointer border border-gray-200/50 dark:border-white/5"
          title="بازگشت به صفحه قبل"
        >
          <svg viewBox="0 0 24 24" className="size-4! sm:size-5!">
            <path
              fillRule="evenodd"
              d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">
            {getPageTitle()}
          </h1>
          <p className="text-xs text-gray-400 mt-1">مدیریت حساب کاربری شخصی</p>
        </div>
      </div>

      <div className="flex gap-x-2 sm:gap-x-4">
        <div
          className="hidden! sm:flex! h-btn cursor-pointer items-center justify-center"
          onClick={toggleTheme}
        >
          <svg className={` ${theme === "dark" ? "hidden" : "inline"}`}>
            <path d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
          </svg>
          <svg className={`${theme === "dark" ? "inline" : "hidden"}`}>
            <path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
          </svg>
        </div>

        {/* Basket Container */}
        <div
          className="hidden! sm:flex! relative h-btn items-center justify-center"
          ref={basketRef}
        >
          <button
            type="button"
            className="cursor-pointer flex items-center justify-center"
            onClick={() => setShowBasket((prev) => !prev)}
          >
            <svg>
              <path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>

          <BasketModal showBasket={showBasket} />
        </div>

        {/* Home Link */}
        <Link
          href="/"
          className="hidden! sm:flex! h-btn items-center justify-center"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}