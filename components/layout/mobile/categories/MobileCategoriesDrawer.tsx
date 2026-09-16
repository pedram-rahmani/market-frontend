"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useLockBodyScroll from "@/store/hooks/useLockBodyScroll";

interface MobileCategoriesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
}

export default function MobileCategoriesDrawer({ isOpen, onClose, categories }: MobileCategoriesDrawerProps) {
  useLockBodyScroll(isOpen);

  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && categories.length > 0 && !selectedParentId) {
      setSelectedParentId(categories[0].id);
    }
  }, [isOpen, categories, selectedParentId]);

  if (!isOpen) return null;

  const activeCategory = categories.find((cat) => cat.id === selectedParentId) || categories[0];

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-dark-700 h-full shadow-2xl flex flex-col z-10 ml-auto mt-auto">
        
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-dark-600">
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <svg viewBox="0 0 24 24" className="size-6">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <span className="font-bold text-sm text-gray-900 dark:text-white">دسته‌بندی محصولات</span>
          <div className="size-6" />
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          {/* level one */}
          <div className="w-28 bg-gray-50 dark:bg-dark-800 border-l border-gray-100 dark:border-dark-600 overflow-y-auto flex flex-col shrink-0">
            {categories.map((cat) => {
              const isSelected = selectedParentId ? cat.id === selectedParentId : cat.id === categories[0]?.id;
              
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedParentId(cat.id)}
                  className={`relative flex flex-col items-center justify-center py-4 px-2 text-center transition-all ${
                    isSelected
                      ? "bg-white dark:bg-dark-700 text-sky-600 dark:text-sky-400 font-bold shadow-xs"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/60 dark:hover:bg-dark-600/40"
                  }`}
                >
                  {isSelected && <span className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-r" />}
                  <span className="text-xs mt-1 line-clamp-2">{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* content and sum-menu */}
          <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-dark-700 space-y-6">
            {activeCategory && (
              <Link
                href={`/search/${activeCategory.slug}`}
                onClick={onClose}
                className="flex items-center justify-between text-sky-600 dark:text-sky-400 font-bold text-sm pb-3 border-b border-gray-100 dark:border-dark-600"
              >
                <span>همه محصولات {activeCategory.name}</span>
                <svg viewBox="0 0 24 24" className="size-4 rtl:rotate-180">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 5 7 7-7 7" />
                </svg>
              </Link>
            )}

            {activeCategory?.children && activeCategory.children.length > 0 ? (
              activeCategory.children.map((subCat: any) => (
                <div key={subCat.id} className="space-y-3">
                  <h3 className="font-bold text-xs text-gray-800 dark:text-gray-200 border-r-2 border-sky-500 pr-2">
                    {subCat.name}
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <Link
                      href={`/search/${subCat.slug}`}
                      onClick={onClose}
                      className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-dark-600/50 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all text-center group"
                    >
                      <div className="size-12 rounded-full bg-gray-100 dark:bg-dark-600 flex items-center justify-center mb-1.5 group-hover:bg-sky-100 dark:group-hover:bg-sky-500/20">
                        <svg viewBox="0 0 24 24" className="size-5 text-gray-500 dark:text-gray-400 group-hover:text-sky-600">
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </div>
                      <span className="text-[11px] text-gray-700 dark:text-gray-300 group-hover:text-sky-600 font-medium line-clamp-1">همه کالاها</span>
                    </Link>

                    {subCat.children && subCat.children.length > 0 ? (
                      subCat.children.map((item: any) => (
                        <Link
                          key={item.id}
                          href={`/search/${item.slug}`}
                          onClick={onClose}
                          className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-dark-600/50 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-all text-center group"
                        >
                          <div className="size-12 rounded-full bg-gray-100 dark:bg-dark-600 flex items-center justify-center mb-1.5 text-xs font-bold text-gray-600 dark:text-gray-300">
                            {item.name.charAt(0)}
                          </div>
                          <span className="text-[11px] text-gray-700 dark:text-gray-300 group-hover:text-sky-600 font-medium line-clamp-1">{item.name}</span>
                        </Link>
                      ))
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs">زیرمجموعه‌ای وجود ندارد</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}