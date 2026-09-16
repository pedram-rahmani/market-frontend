"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useDebounce from "./useDebounce";

interface UseSearchOptions<T> {
  fetcher?: (query: string) => Promise<T[]>;
  searchParamName?: string;
  redirectUrl?: string;
  filterKey?: keyof T | ((item: T, query: string) => boolean);
}

export default function useSearch<T = any>({
  fetcher,
  searchParamName = "q",
  redirectUrl = "/search",
  filterKey,
}: UseSearchOptions<T> = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get(searchParamName) || "");
  const [searchResults, setSearchResults] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchLiveResults = async () => {
      const trimmed = debouncedQuery.trim();

      if (!trimmed || !fetcher) {
        setSearchResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetcher(trimmed);

        // فیلتر کردن دقیق نتایج در کلاینت بر اساس عبارتی که تایپ شده
        let filtered = data;
        if (filterKey) {
          filtered = data.filter((item) => {
            if (typeof filterKey === "function") {
              return filterKey(item, trimmed);
            }
            const value = item[filterKey];
            return (
              value &&
              String(value).toLowerCase().includes(trimmed.toLowerCase())
            );
          });
        }

        setSearchResults(filtered);
      } catch (error) {
        console.error("Live Search Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveResults();
  }, [debouncedQuery, fetcher]);

  const handleSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && redirectUrl) {
      setIsOpen(false);
      router.push(`${redirectUrl}?${searchParamName}=${encodeURIComponent(trimmed)}`);
    }
  };

  return {
    query,
    setQuery,
    searchResults,
    isLoading,
    isOpen,
    setIsOpen,
    handleSearch,
  };
}