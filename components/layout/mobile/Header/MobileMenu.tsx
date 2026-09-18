"use client";

import { useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import useClickOutside from "@/store/hooks/useClickOutside";
import useLockBodyScroll from "@/store/hooks/useLockBodyScroll";
import { RootState } from "@/store";
import MobileMenuItems from "./MobileMenuItems";
import { useSettings } from "@/store/hooks/useSettings";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const isLoggedIn = useSelector((state: RootState) => !!state.auth.user);
  const { siteName, footerText, loading } = useSettings();

  useClickOutside(() => {
    if (isOpen) onClose();
  }, menuRef);

  useLockBodyScroll(isOpen);

  return (
    <>
      <div
        className={`fixed inset-0 z-60 bg-black/60 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        ref={menuRef}
        className={`fixed right-0 top-0 z-70 flex h-full w-[85%] max-w-sm flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-dark-800 lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 shrink-0 border-b border-gray-100 bg-white/95 px-6 pb-5 pt-6 backdrop-blur-xl dark:border-white/10 dark:bg-dark-800/95">
          <div className="flex items-center justify-between">
            <span className="max-w-[12rem] truncate bg-linear-to-r from-violet-600 to-cyan-500 bg-clip-text text-sm font-black tracking-[0.12em] text-transparent">
              {loading ? "..." : siteName}
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Close Menu"
            >
              <svg viewBox="0 0 24 24" className="size-5!" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 scrollbar">
          {isLoggedIn ? (
            <Link
              href="/my-account"
              onClick={onClose}
              className="mt-5 flex items-center gap-3 rounded-2xl bg-violet-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-white/15">
                <UserIcon />
              </span>
              ورود به حساب کاربری
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="mt-5 flex items-center justify-between rounded-2xl bg-green-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/15">
                  <UserIcon />
                </span>
                ورود و عضویت
              </span>
              <span className="text-xs text-white/75">ورود به حساب</span>
            </Link>
          )}

          <MobileMenuItems onClose={onClose} />
        </div>

        <div className="shrink-0 border-t border-gray-100 px-6 pb-6 pt-4 text-center dark:border-white/10">
          <p className="text-[11px] leading-6 text-gray-400" dir="rtl">
            {footerText} &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}
