"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface ProductSortingProps {
  onOpenFilter?: () => void;
}

const SORT_OPTIONS = [
  { id: "newest", title: "جدیدترین" },
  { id: "price_asc", title: "ارزان‌ترین" },
  { id: "price_desc", title: "گران‌ترین" },
  { id: "popular", title: "پرمخاطب‌ترین" },
];

export default function ProductSorting({ onOpenFilter }: ProductSortingProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // گرفتن مقدار sort فعلی از URL (پیش‌فرض: جدیدترین)
  const currentSort = searchParams.get("sort") || "newest";

  // تابع آپدیت کردن کوئری پارامتر URL
  const handleSortChange = (sortId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sortId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full">
      {/* desktop */}
      <div className="hidden md:flex items-center justify-between px-6 mb-8 h-16 backdrop-blur-xl border border-custom-gray-200 bg-light dark:bg-dark-600/50 dark:border-white/10 shadow rounded-2xl z-10">
        <div className="flex items-center gap-2 bg-custom-gray-400/30 dark:bg-dark-800/60 w-64 border border-white/10 rounded-xl px-4 py-2 focus-within:ring-1 focus-within:ring-ui-purple/30">
          <input
            type="text"
            placeholder="جستجو بین محصولات..."
            className="w-full text-sm tracking-wide placeholder:text-secondary bg-transparent outline-none"
          />
          <svg viewBox="0 0 24 24" className="shrink-0 text-secondary size-5">
            <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="flex items-center gap-x-8 h-full">
          <div className="flex items-center gap-x-2 text-secondary">
            <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
              <path d="M12 4l-6 6h12l-6-6z" />
              <path d="M12 20l6-6H6l6 6z" />
            </svg>
            <span className="text-sm font-medium">مرتب‌سازی بر اساس:</span>
          </div>

          <div className="flex items-center gap-x-6 h-full text-sm">
            {SORT_OPTIONS.map((sort) => {
              const isActive = currentSort === sort.id;
              return (
                <button
                  key={sort.id}
                  type="button"
                  onClick={() => handleSortChange(sort.id)}
                  className={`transition-colors cursor-pointer ${
                    isActive
                      ? "text-cyan-400 font-bold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {sort.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* mobile */}
      <div className="flex md:hidden items-center gap-3 w-full mb-6">
        <button
          type="button"
          onClick={onOpenFilter}
          className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-dark-800/80 backdrop-blur-xl border border-custom-gray-200 dark:border-white/10 p-3 rounded-xl text-sm font-medium text-text-on-light dark:text-text-on-dark shadow-sm cursor-pointer whitespace-nowrap"
        >
          <svg viewBox="0 0 24 24" className="size-4 text-cyan-500 fill-current">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>فیلترها</span>
        </button>

        <Link
          href="/products"
          className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-dark-800/80 backdrop-blur-xl border border-custom-gray-200 dark:border-white/10 p-3 rounded-xl text-sm font-medium text-text-on-light dark:text-text-on-dark shadow-sm cursor-pointer whitespace-nowrap"
        >
          <span>همه محصولات</span>
        </Link>
      </div>
    </div>
  );
}