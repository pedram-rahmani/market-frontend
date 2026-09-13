"use client";

import React, { useRef } from "react";
import useClickOutside from "@/store/hooks/useClickOutside";
import useLockBodyScroll from "@/store/hooks/useLockBodyScroll";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(() => {
    if (isOpen) onClose();
  }, menuRef);

  useLockBodyScroll(isOpen);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        ref={menuRef}
        className={`fixed top-0 right-0 z-[70] w-[85%] max-w-sm h-full bg-white dark:bg-dark-800 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-gray-100 dark:border-white/10">
            <span className="font-black text-sm tracking-widest bg-linear-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
              SHIKSHOP
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

          <nav className="py-6 space-y-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
            
            {/* سفارش‌های من (بر اساس پوشه purchases) */}
            <Link
              href="/my-account/purchases"
              onClick={onClose}
              className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-cyan-400 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-dark-700 flex items-center justify-center text-violet-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              سفارش‌های من
            </Link>

            {/* علاقه‌مندی‌ها */}
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-cyan-400 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-pink-50 dark:bg-dark-700 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              لیست علاقه‌مندی‌ها
            </Link>

            {/* پیشنهادهای شگفت‌انگیز */}
            <Link
              href="/offers"
              onClick={onClose}
              className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-cyan-400 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-dark-700 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              پیشنهادهای شگفت‌انگیز
            </Link>

            {/* مجله و مقالات */}
            <Link
              href="/blog"
              onClick={onClose}
              className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-cyan-400 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-dark-700 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              مجله و مقالات
            </Link>

            <div className="my-3 border-t border-gray-100 dark:border-white/5" />

            {/* درباره ما */}
            <Link
              href="/about-us"
              onClick={onClose}
              className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-cyan-400 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform">
                <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              درباره شیک‌شاپ
            </Link>

            {/* قوانین و مقررات */}
            <Link
              href="/terms"
              onClick={onClose}
              className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-cyan-400 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-gray-500 group-hover:scale-110 transition-transform">
                <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              قوانین و مقررات
            </Link>

            {/* تنظیمات (بر اساس پوشه settings داخل my-account) */}
            <Link
              href="/my-account/settings"
              onClick={onClose}
              className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-cyan-400 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-dark-700 flex items-center justify-center text-violet-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
                <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              تنظیمات
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-white/10 text-center">
          <p className="text-[11px] text-gray-400">
            تمامی حقوق محفوظ است &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </>
  );
}