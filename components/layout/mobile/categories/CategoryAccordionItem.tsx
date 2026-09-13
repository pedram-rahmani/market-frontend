"use client";

import { useState } from "react";
import Link from "next/link";

interface CategoryNodeProps {
  category: {
    id: number;
    name: string;
    slug: string;
    children?: any[];
  };
  onClose: () => void;
}

export default function CategoryAccordionItem({ category, onClose }: CategoryNodeProps) {
  const [showSubMenu, setShowSubMenu] = useState(false);

  const hasChildren = category.children && category.children.length > 0;

  if (hasChildren) {
    return (
      <div className="relative">
        {/* menu btn */}
        <button
          onClick={() => setShowSubMenu(true)}
          className="w-full flex items-center justify-between py-3.5 px-4 text-right text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-600/40 transition-colors"
        >
          <span className="text-sm font-medium">{category.name}</span>
          <svg viewBox="0 0 24 24" className="size-4 text-gray-400 rtl:rotate-180">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 18 6-6-6-6" />
          </svg>
        </button>

        {/* submenu */}
        <div
          className={`absolute inset-0 bg-white dark:bg-dark-700 z-20 flex flex-col transition-transform duration-300 ease-in-out ${
            showSubMenu ? "translate-x-0" : "translate-x-full pointer-events-none"
          }`}
          style={{ direction: "rtl" }}
        >
          {/* new level header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-dark-600 bg-gray-50/50 dark:bg-dark-700">
            <button
              onClick={() => setShowSubMenu(false)}
              className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-medium text-sm"
            >
              <svg viewBox="0 0 24 24" className="size-4 rtl:rotate-180">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
              </svg>
              <span>همه {category.name}</span>
            </button>
            <button
              onClick={() => setShowSubMenu(false)}
              className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="size-5">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-dark-600/30">

            <Link
              href={`/search/category-${category.id}`}
              onClick={onClose}
              className="block py-3 px-4 text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50/40 dark:bg-sky-500/10 hover:underline"
            >
              مشاهده همه محصولات {category.name}
            </Link>

            {category.children!.map((subChild: any) => (
              <CategoryAccordionItem key={subChild.id} category={subChild} onClose={onClose} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/product-info/${category.id}/${category.name}`}
      onClick={onClose}
      className="w-full flex items-center justify-between py-3.5 px-4 text-right text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-600/40 transition-colors text-sm"
    >
      <span>{category.name}</span>
    </Link>
  );
}