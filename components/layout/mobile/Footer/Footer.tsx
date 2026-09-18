"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import { mobileNavItems } from "./mobileNavItems";
import MobileCategoriesDrawer from "../categories/MobileCategoriesDrawer";

interface FooterProps {
  categories: any[];
}

export default function Footer({ categories = [] }: FooterProps) {
  const pathname = usePathname();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const homeItem = mobileNavItems.find((item) => item.href === "/");
  const otherItems = mobileNavItems.filter((item) => item.href !== "/");

  const midIndex = Math.ceil(otherItems.length / 2);
  const leftItems = otherItems.slice(0, midIndex);
  const rightItems = otherItems.slice(midIndex);

  const renderItem = (item: any) => {
    if (!item.href) {
      const isActive = isCategoriesOpen;
      return (
        <button
          key={item.label}
          onClick={() => setIsCategoriesOpen(true)}
          className={`flex flex-1 flex-col items-center justify-center rounded-xl py-1.5 text-[10px] transition-all sm:text-xs ${
            isActive
              ? "bg-violet-500/10 font-bold text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
              : "text-gray-500 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:bg-white/5"
          }`}
        >
          {item.icon.default}
          <span className="mt-1 whitespace-nowrap">{item.label}</span>
        </button>
      );
    }

    const isActive = pathname === item.href;
    return (
      <NavItem
        key={item.label}
        label={item.label}
        href={item.href}
        icon={item.icon}
        active={isActive}
      />
    );
  };

  return (
    <>
      <div className="fixed bottom-0 left-1/2 z-30 flex w-full -translate-x-1/2 items-center justify-center px-3 pb-0.5 lg:hidden">
        <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-full bg-linear-to-t from-slate-900/15 to-transparent dark:from-black/40" />

        <div className="relative flex w-full max-w-md items-center justify-center">
         {homeItem && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
              {(() => {
                const isActive = pathname === homeItem.href || pathname === "/";
                return (
                  <a
                    href={homeItem.href}
                    className={`relative flex size-14 items-center justify-center rounded-full border-[5px] border-gray-50 bg-white shadow-xl shadow-violet-900/15 transition-transform dark:border-dark-900 dark:bg-dark-800 sm:size-16 ${
                      isActive
                        ? "text-ui-blue-500 scale-95"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <div className={`absolute inset-0 flex items-center justify-center [&_svg]:size-7! sm:[&_svg]:size-7! ${isActive ? "" : ""}`}>
                      {isActive ? homeItem.icon.active : homeItem.icon.default}
                    </div>
                  </a>
                );
              })()}
            </div>
          )}

          {/* navbar */}
          <nav className="relative flex w-full items-center justify-between rounded-[1.35rem] border border-gray-200/90 bg-white/[0.97] px-3 py-2.5 shadow-2xl shadow-slate-900/20 backdrop-blur-3xl backdrop-saturate-150 dark:border-white/10 dark:bg-dark-900/[0.97] sm:px-5 [&_svg]:size-5! sm:[&_svg]:size-6">
            <div className="flex items-center justify-around flex-1">
              {leftItems.map(renderItem)}
            </div>

            <div className="w-12 sm:w-16 shrink-0" />

            <div className="flex items-center justify-around flex-1">
              {rightItems.map(renderItem)}
            </div>
          </nav>
        </div>
      </div>

      <MobileCategoriesDrawer
        isOpen={isCategoriesOpen}
        onClose={() => setIsCategoriesOpen(false)}
        categories={categories}
      />
    </>
  );
}