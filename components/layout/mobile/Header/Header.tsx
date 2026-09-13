"use client";

import { useState } from "react";
import SearchInput from "@/components/ui/SearchInput/SearchInput";
import { getProducts } from "@/services/product";
import MobileMenu from "./MobileMenu";

const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_URL || "http://127.0.0.1:8000";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 w-full lg:hidden bg-white/80 dark:bg-dark-700/80 backdrop-blur-xl border-b border-custom-gray-100 dark:border-dark-600 z-50 transition-all">
        <div className="flex items-center justify-between h-16 px-4 w-full text-gray-800 dark:text-white">
          
          {/* Menu Button (Right) */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 transition-all"
            aria-label="Open Menu"
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo (Center) */}
          <span className="font-black text-xs sm:text-sm tracking-widest bg-linear-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">
            SHIKSHOP
          </span>

          {/* Search Toggle (Left) */}
          <button
            onClick={() => setShowSearch((prev) => !prev)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              showSearch
                ? "bg-violet-500/10 text-violet-600 dark:text-cyan-400"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600"
            }`}
            aria-label="Toggle Search"
          >
            <svg className="size-5!" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Mobile Search Bar Dropdown */}
        {showSearch && (
          <div className="p-3.5 border-t border-gray-100 dark:border-white/10 bg-white/95 dark:bg-dark-700/95 backdrop-blur-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <SearchInput
              placeholder="به دنبال چه میگردی؟"
              showImage={true}
              filterKey="name"
              redirectUrl="/search"
              searchParamName="search"
              getItemLink={(item: any) => `/products/${item.slug || item.id}`}
              onSearchSuccess={() => setShowSearch(false)}
              fetcher={async (query) => {
                const products = await getProducts({ search: query });
                return products.map((product) => {
                  let imageUrl = product.img;
                  if (imageUrl && !imageUrl.startsWith("http")) {
                    imageUrl = `${ASSET_URL}/storage/${imageUrl.replace(/^\/?storage\//, "")}`;
                  }
                  return { ...product, img: imageUrl };
                });
              }}
            />
          </div>
        )}
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}