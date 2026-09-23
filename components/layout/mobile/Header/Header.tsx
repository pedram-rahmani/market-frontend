"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SearchInput from "@/components/ui/SearchInput/SearchInput";
import { getProducts } from "@/services/product";
import { getImagePath } from "@/lib/utils";
import MobileMenu from "./MobileMenu";
import { useAppDispatch } from "@/store/hooks/storeHooks";
import { fetchSettings } from "@/store/slices/settingSlice";
import { useSettings } from "@/store/hooks/useSettings";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, rawSettings } = useSettings();

  useEffect(() => {
    if (!loading && Object.keys(rawSettings).length === 0) {
      dispatch(fetchSettings());
    }
  }, [dispatch, loading, rawSettings]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-gray-200/70 bg-white/85 shadow-sm shadow-slate-900/5 backdrop-blur-2xl transition-all dark:border-white/5 dark:bg-dark-900/85 lg:hidden">
        <div className="flex h-18 w-full items-center justify-between px-4 text-gray-800 dark:text-white">
          
          {/* دکمه منو (سمت راست) */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="group flex size-10 items-center justify-center rounded-2xl border border-gray-200/80 bg-gray-50 text-gray-600 transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 dark:border-white/5 dark:bg-white/5 dark:text-gray-300 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
            aria-label="Open Menu"
          >
            <svg
              className="size-5! transition-transform duration-200 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* عنوان وسط هدر */}
          <div className="text-xs font-medium text-gray-400 dark:text-gray-500">
            فروشگاه من
          </div>

          {/* دکمه سرچ (سمت چپ) */}
          <button
            onClick={() => setShowSearch((prev) => !prev)}
            className={`group flex size-10 items-center justify-center rounded-2xl border transition-all ${
              showSearch
                ? "border-violet-300 bg-violet-50 text-violet-600 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-cyan-400"
                : "border-gray-200/80 bg-gray-50 text-gray-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 dark:border-white/5 dark:bg-white/5 dark:text-gray-300 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10 dark:hover:text-violet-300"
            }`}
            aria-label="Toggle Search"
          >
            <svg
              className="size-5! transition-transform duration-200 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* بخش باز و بسته شدن باکس سرچ با تکنیک max-h برای جلوگیری از به هم ریختگی و حفظ دراپ‌داون */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showSearch
              ? "max-h-96 opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="border-t border-gray-100/80 bg-white/95 p-3.5 shadow-xl shadow-slate-950/5 backdrop-blur-2xl dark:border-white/5 dark:bg-dark-900/95">
            <SearchInput
              placeholder="جست‌وجوی محصول..."
              showImage={true}
              filterKey="name"
              redirectUrl="/search"
              searchParamName="search"
              getItemLink={(item: any) => `/products/${item.slug || item.id}`}
              onSearchSuccess={() => setShowSearch(false)}
              fetcher={async (query) => {
                const products = await getProducts({ search: query });
                return products.map((product) => {
                  const imageUrl = getImagePath(product.img);
                  return { ...product, img: imageUrl };
                });
              }}
            />
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}