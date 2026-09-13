"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import NavItem from "./NavItem";
import { mobileNavItems } from "./nav.config";
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
          className={`flex flex-col items-center justify-center py-1 px-2 transition-colors ${
            isActive
              ? "text-ui-blue-500 font-medium"
              : ""
          }`}
        >
          {item.icon.default}
          <span className="text-[10px] sm:text-xs mt-1">{item.label}</span>
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
      {/* تغییر z-index به 30 برای قرارگیری امن زیر مدال */}
      <div className="lg:hidden fixed w-full bottom-0 left-1/2 transform -translate-x-1/2 flex items-center justify-center z-30">
        <div className="absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-dark-700/40 to-transparent dark:from-dark-700 dark:to-transparent pointer-events-none z-0" />

        <div className="relative mb-2 w-[92%] sm:w-125 md:w-150 flex items-center justify-center ">
         {homeItem && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
              {(() => {
                const isActive = pathname === homeItem.href || pathname === "/";
                return (
                  <a
                    href={homeItem.href}
                    className={`relative flex items-center justify-center size-14 sm:size-16 rounded-full bg-light dark:bg-dark-700 border-4 border-light dark:border-dark-700 shadow-xl transition-transform ${
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
          <nav className="relative flex justify-between items-center bg-light dark:bg-dark-700 border border-white/26 dark:border-dark-600 rounded-full px-6 sm:px-8 py-3 shadow-2xl backdrop-blur-md w-full [&_svg]:size-5! sm:[&_svg]:size-6">
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