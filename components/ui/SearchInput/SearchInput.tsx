"use client";

import Image from "next/image";
import { useRef, useState } from "react";
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
  compactAtMedium?: boolean;
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
  compactAtMedium = false,
}: SearchInputProps<T>) {
  const [isCompactExpanded, setIsCompactExpanded] = useState(false);
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
  const inputRef = useRef<HTMLInputElement>(null!);

  useClickOutside(() => {
    setIsOpen(false);
    setIsCompactExpanded(false);
  }, [containerRef]);

  const onSubmit = (e: React.FormEvent) => {
    handleSearch(e);
    if (onSearchSuccess) onSearchSuccess();
    setIsCompactExpanded(false);
  };

  return (
    <div className={`relative block w-full ${className}`} ref={containerRef}>
      {compactAtMedium && (
        <button
          type="button"
          className="h-btn flex xl:hidden! items-center justify-center"
          onClick={() => {
            setIsCompactExpanded((prev) => {
              const nextState = !prev;
              if (nextState) {
                setTimeout(() => {
                  inputRef.current?.focus();
                  setIsOpen(true);
                }, 50);
              }
              return nextState;
            });
          }}
          aria-label="جستجوی محصول"
          title="جستجوی محصول"
        >
          <svg viewBox="0 0 24 24" className="size-5!">
            <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      )}

      <form
        onSubmit={onSubmit}
        className={`${
          compactAtMedium
            ? `${
                isCompactExpanded ? "" : "hidden!"
              } xl:flex! absolute left-0 top-full z-50 mt-2 w-72 xl:w-full rounded-2xl! p-2 xl:static xl:mt-0 xl:rounded-none xl:bg-transparent xl:p-0 xl:shadow-none shadow-xl border xl:border-none border-gray-100 dark:border-white/10 bg-white dark:bg-dark-700 `
            : "relative block w-full "
        }`}
      >
        {/* triangle */}
        <div className="hidden md:max-[1279px]:flex absolute -top-1.5 left-4 w-3 h-3 bg-white dark:bg-dark-700 border-t border-l border-gray-200 dark:border-white/5 rotate-45 z-11"></div>

        <div className="relative w-full">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className={`min-w-full! text-text-on-light dark:text-text-on-dark text-sm rounded-full pl-4! pr-10! py-2! tracking-tight bg-custom-gray-100/60! dark:bg-dark-600/50! border! border-custom-gray-300! dark:border-dark-800! focus:border-violet-500! dark:focus:border-cyan-400! ${inputClassName}`}
            type="text"
            placeholder={placeholder}
          />

          <button
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-text-on-light dark:text-text-on-dark opacity-70 hover:opacity-100 transition-all"
            aria-label="جستجوی محصول"
            title="جستجوی محصول"
          >
            <svg viewBox="0 0 24 24" className="size-5!">
              <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </div>

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
                        setIsCompactExpanded(false);
                        if (onSearchSuccess) onSearchSuccess();
                      }}
                      className="flex items-center gap-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors group"
                    >
                      {showImage && imageUrl && (
                        <div className="relative size-10 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-800 flex items-center justify-center">
                          <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            sizes="40px"
                            unoptimized
                            className="size-full object-cover"
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
                    onClick={(e) => {
                      onSubmit(e);
                      setIsCompactExpanded(false);
                    }}
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
      </form>
    </div>
  );
}
