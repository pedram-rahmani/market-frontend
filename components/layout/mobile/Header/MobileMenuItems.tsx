"use client";

import React from "react";
import Link from "next/link";

interface MobileMenuItemsProps {
  onClose: () => void;
}

const menuItems = [
  {
    href: "/my-account/purchases",
    label: "سفارش‌های من",
    color: "bg-violet-50 text-violet-600 dark:text-cyan-400",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    ),
  },
  {
    href: "/my-account/wishlist",
    label: "لیست علاقه‌مندی‌ها",
    color: "bg-pink-50 text-pink-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z"
      />
    ),
  },
  {
    href: "/offers",
    label: "پیشنهادهای شگفت‌انگیز",
    color: "bg-amber-50 text-amber-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v13m0-13V6a2 2 0 1 1 2 2h-2zm0 0V5.5A2.5 2.5 0 1 0 9.5 8H12zm-7 4h14M5 12a2 2 0 1 0 0-4h14a2 2 0 1 0 0 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"
      />
    ),
  },
  {
    href: "/blog",
    label: "مجله و مقالات",
    color: "bg-blue-50 text-blue-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    ),
  },
  {
    href: "/about-us",
    label: "درباره شیک‌شاپ",
    color: "bg-gray-100 text-gray-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
      />
    ),
  },
  {
    href: "/terms",
    label: "قوانین و مقررات",
    color: "bg-gray-100 text-gray-500",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"
      />
    ),
  },
  {
    href: "/my-account/settings",
    label: "تنظیمات",
    color: "bg-violet-50 text-violet-600 dark:text-cyan-400",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
      </>
    ),
  },
];

export default function MobileMenuItems({ onClose }: MobileMenuItemsProps) {
  return (
    <nav className="py-6 space-y-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
      {menuItems.map((item, index) => (
        <React.Fragment key={item.href}>
          {index === 4 && <div className="my-3 border-t border-gray-100 dark:border-white/5" />}
          <Link
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-cyan-400 transition-all group"
          >
            <div className={`w-8 h-8 rounded-lg dark:bg-dark-700 flex items-center justify-center group-hover:scale-110 transition-transform ${item.color}`}>
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {item.icon}
              </svg>
            </div>
            {item.label}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  );
}
