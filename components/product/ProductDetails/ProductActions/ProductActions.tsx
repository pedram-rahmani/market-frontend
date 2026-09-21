"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import SpinnerLoader from "@/components/ui/SpinnerLoader/SpinnerLoader";
import { useAuth } from "@/store/hooks/useAuth";
import { Product } from "@/types/product";

export default function ProductActions({ product }: { product: Product }) {
  const { isLoggedIn } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isLoggedIn || !product.id) return;

    axiosInstance
      .get(`/wishlist/${product.id}/status`)
      .then(({ data }) => setIsFavorite(Boolean(data.is_favorite)))
      .catch((error) => console.error("Failed to load wishlist status:", error));
  }, [isLoggedIn, product.id]);

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2500);
  };

  const toggleFavorite = async () => {
    if (!isLoggedIn) {
      notify("برای افزودن محصول به علاقه‌مندی‌ها وارد حساب شوید.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axiosInstance.post(`/wishlist/${product.id}/toggle`);
      setIsFavorite(Boolean(data.is_favorite));
      notify(data.message);
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      notify("تغییر علاقه‌مندی محصول انجام نشد.");
    } finally {
      setLoading(false);
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        notify("لینک محصول کپی شد.");
      }
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") {
        console.error("Failed to share product:", error);
        notify("اشتراک‌گذاری محصول انجام نشد.");
      }
    }
  };

  return (
    <div className="flex shrink-0 flex-col items-center gap-3">
      <button
        type="button"
        onClick={toggleFavorite}
        disabled={loading}
        title={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
        aria-label={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
        className={`flex size-10 items-center justify-center rounded-xl border transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-60 ${
          isFavorite
            ? "border-rose-400/40 bg-rose-500/10 text-rose-500"
            : "border-gray-200 bg-white text-gray-500 hover:border-rose-400/50 hover:text-rose-500 dark:border-dark-600 dark:bg-dark-700 dark:text-gray-300"
        }`}
      >
        {loading ? (
          <SpinnerLoader className="size-5!" />
        ) : (
          <svg className="size-5!" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
          </svg>
        )}
      </button>

      <button
        type="button"
        onClick={share}
        title="اشتراک‌گذاری محصول"
        aria-label="اشتراک‌گذاری محصول"
        className="flex size-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-cyan-400/50 hover:text-cyan-500 dark:border-dark-600 dark:bg-dark-700 dark:text-gray-300 cursor-pointer"
      >
        <svg className="size-5!" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
        </svg>
      </button>

      {message && (
        <span
          className="fixed bottom-5 right-5 z-50 max-w-[calc(100vw-2.5rem)] rounded-xl border border-cyan-400/20 bg-white/95 px-4 py-2.5 text-center text-xs text-cyan-600 shadow-xl backdrop-blur dark:bg-dark-800/95 dark:text-cyan-400"
          role="status"
        >
          {message}
        </span>
      )}
    </div>
  );
}
