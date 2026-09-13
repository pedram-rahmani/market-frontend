"use client";

import { useRef } from "react";
import Link from "next/link";
import useSearch from "@/store/hooks/useSearch";
import useClickOutside from "@/store/hooks/useClickOutside";

interface SearchInputProps<T> {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  showImage?: boolean;
  onSearchSuccess?: () => void;
  fetcher?: (query: string) => Promise<T[]>;
  redirectUrl?: string;
  searchParamName?: string;
  filterKey?: keyof T | ((item: T, query: string) => boolean);
  getItemTitle?: (item: T) => string;
  getItemSubtitle?: (item: T) => string | null;
  getItemImage?: (item: T) => string | null;
  getItemLink?: (item: T) => string;
}

export default function SearchInput<T extends Record<string, any>>({
  className = "",
  inputClassName = "",
  placeholder = "به دنبال چه میگردی؟",
  showImage = true,
  onSearchSuccess,
  fetcher,
  redirectUrl = "/search",
  searchParamName = "q",
  filterKey,
  getItemTitle = (item) => item.name || item.title || "",
  getItemSubtitle = (item) =>
    item.price ? `${Number(item.price).toLocaleString("fa-IR")} تومان` : null,
  getItemImage = (item) => item.img || item.image || null,
  getItemLink = (item) => `/search/${item.slug || item.id}`,
}: SearchInputProps<T>) {
  const {
    query,
    setQuery,
    searchResults,
    isLoading,
    isOpen,
    setIsOpen,
    handleSearch,
  } = useSearch<T>({
    fetcher,
    redirectUrl,
    searchParamName,
    filterKey,
  });

  const containerRef = useRef<HTMLDivElement>(null!);
  useClickOutside(() => setIsOpen(false), [containerRef]);

  const onSubmit = (e: React.FormEvent) => {
    handleSearch(e);
    if (onSearchSuccess) onSearchSuccess();
  };

  return (
    <div className={`relative block w-full ${className}`} ref={containerRef}>
      <form onSubmit={onSubmit} className="relative block w-full">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full text-text-on-light dark:text-text-on-dark text-sm rounded-full pr-4! pl-10! py-2! tracking-tight bg-custom-gray-100/60! dark:bg-dark-600/50! border! border-custom-gray-300! dark:border-dark-800! focus:border-violet-500! dark:focus:border-cyan-400! transition-colors outline-none ${inputClassName}`}
          type="text"
          placeholder={placeholder}
        />
        <button
          type="submit"
          className="absolute left-3 top-0 bottom-0 w-5 h-5 my-auto text-text-on-light dark:text-text-on-dark opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg viewBox="0 0 24 24" className="size-5! fill-none stroke-currentColor stroke-2">
            <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </form>

      {/* Dropdown */}
      {isOpen && query.trim().length > 0 && fetcher && (
        <div className="absolute top-full right-0 left-0 mt-2 bg-white dark:bg-dark-700 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 transition-all">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400">
              در حال جستجو...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="p-2 space-y-1">
              {searchResults.slice(0, 5).map((item, index) => {
                const title = getItemTitle(item);
                const subtitle = getItemSubtitle(item);
                const imageUrl = getItemImage(item);
                const link = getItemLink(item);

                return (
                  <Link
                    key={item.id || index}
                    href={link}
                    onClick={() => {
                      setIsOpen(false);
                      if (onSearchSuccess) onSearchSuccess();
                    }}
                    className="flex items-center gap-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors group"
                  >
                    {showImage && imageUrl && (
                      <div className="relative size-10 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-800 flex items-center justify-center">
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate group-hover:text-violet-600 dark:group-hover:text-cyan-400 transition-colors">
                        {title}
                      </p>
                      {subtitle && (
                        <span className="text-[10px] text-gray-400 mt-0.5 block">
                          {subtitle}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}

              {redirectUrl && (
                <button
                  type="button"
                  onClick={onSubmit}
                  className="w-full text-center py-2 text-xs text-violet-600 dark:text-cyan-400 hover:bg-violet-50 dark:hover:bg-cyan-950/30 rounded-xl transition-colors font-medium mt-1 border-t border-gray-100 dark:border-white/5"
                >
                  مشاهده همه نتایج برای «{query}»
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-gray-500 dark:text-gray-400">
              نتیجه‌ای برای «{query}» پیدا نشد.
            </div>
          )}
        </div>
      )}
    </div>
  );
}