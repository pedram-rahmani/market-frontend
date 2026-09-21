"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import ProductGallery from "../ProductDetails/ProductGallery/ProductGallery";
import { Product } from "@/types/product";
import { getImagePath } from "@/lib/utils";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/store/hooks/useAuth";
import SpinnerLoader from "@/components/ui/SpinnerLoader/SpinnerLoader";

export default function ProductShowcase() {
  const product = useSelector((state: any) => state.product?.currentProduct) as Product | null;
  const [showGallery, setShowGallery] = useState(false);
  const { isLoggedIn } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    if (!isLoggedIn || !product?.id) {
      setIsFavorite(false);
      return;
    }

    axiosInstance
      .get(`/wishlist/${product.id}/status`)
      .then(({ data }) => setIsFavorite(Boolean(data.is_favorite)))
      .catch((error) => console.error("Failed to load wishlist status:", error));
  }, [isLoggedIn, product?.id]);

  const showActionMessage = (message: string) => {
    setActionMessage(message);
    window.setTimeout(() => setActionMessage(""), 2500);
  };

  const handleToggleFavorite = async () => {
    if (!isLoggedIn || !product?.id) {
      showActionMessage("برای افزودن محصول به علاقه‌مندی‌ها وارد حساب شوید.");
      return;
    }

    setFavoriteLoading(true);
    try {
      const { data } = await axiosInstance.post(`/wishlist/${product.id}/toggle`);
      setIsFavorite(Boolean(data.is_favorite));
      showActionMessage(data.message);
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      showActionMessage("تغییر علاقه‌مندی محصول انجام نشد.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product?.name, text: product?.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        showActionMessage("لینک محصول کپی شد.");
      }
    } catch (error) {
      if ((error as DOMException).name !== "AbortError") {
        console.error("Failed to share product:", error);
        showActionMessage("اشتراک‌گذاری محصول انجام نشد.");
      }
    }
  };

  // disable window scroll
  useEffect(() => {
    const html = document.querySelector("html");
    if (html) {
      if (showGallery) {
        html.classList.add("overflow-y-hidden");
      } else {
        html.classList.remove("overflow-y-hidden");
      }
    }
  }, [showGallery]);

  return (
    <>
      <div className="flex flex-row-reverse col-span-full lg:col-span-7 w-full max-w-full items-center lg:items-start justify-center gap-3">

        <div
          className="flex flex-col mx-1 my-1 gap-3
                     *:relative *:flex *:items-center *:cursor-pointer
                     [*_svg]:size-4 [*_div:last-child_svg]:stroke-1"
        >
          <div className="flex flex-col gap-3 w-full">
            {/* Favorite */}
            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
              className={`flex items-center justify-end gap-x-2 group cursor-pointer disabled:cursor-wait disabled:opacity-60 ${
                isFavorite ? "text-rose-500" : ""
              }`}
              aria-label={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
            >
              <div className="w-6 flex justify-center">
                {favoriteLoading ? (
                  <SpinnerLoader className="size-5!" />
                ) : (
                  <svg
                  className={`size-5 transition-colors shrink-0 ${
                    isFavorite ? "text-rose-500 fill-rose-500" : "text-gray-500 group-hover:text-red-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                  </svg>
                )}
              </div>
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center justify-end gap-x-2 group cursor-pointer"
              aria-label="اشتراک‌گذاری کالا"
            >
              <div className="w-6 flex justify-center">
                <svg
                  className="size-5 text-gray-500 group-hover:text-blue-500 transition-colors shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                  />
                </svg>
              </div>
            </button>
            {actionMessage && (
              <p className="text-center text-xs text-cyan-500" role="status">
                {actionMessage}
              </p>
            )}

            {/* Chart */}
            <div className="flex items-center justify-end gap-x-2 group cursor-pointer">
              <div className="w-6 flex justify-center">
                <svg
                  className="size-5 text-gray-500 group-hover:text-green-500 transition-colors shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4,4 C4.51283143,4 4.93550653,4.38604429 4.9932722,4.88337975 L5,5 L5,18 L20,18 C20.5523,18 21,18.4477 21,19 C21,19.51285 20.613973,19.9355092 20.1166239,19.9932725 L20,20 L4,20 C3.48716857,20 3.06449347,19.613973 3.0067278,19.1166239 L3,19 L3,5 C3,4.44772 3.44772,4 4,4 Z M20.1935,6.81813 C21.0933,6.81813 21.5439,7.90606 20.9076,8.54231 L15.3386,14.1114 C14.909,14.541 14.2125,14.541 13.7829,14.1114 L11.0252,11.3537 L7.48969,14.8892 C7.09916,15.2797 6.466,15.2797 6.07547,14.8892 C5.68495,14.4987 5.68495,13.8655 6.07547,13.475 L10.2474,9.30305 C10.677,8.87347 11.3735,8.87348 11.803,9.30305 L14.5608,12.0608 L17.8034,8.81813 L17.3892,8.81813 C16.8369,8.81813 16.3892,8.37041 16.3892,7.81813 C16.3892,7.26584 16.8369,6.81813 17.3892,6.81813 L20.1935,6.81813 Z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* image and details */}
        <div className="flex flex-col gap-y-3 items-center w-full max-w-md mx-auto">
          <div className="flex flex-col w-full px-4 lg:px-0">
            <Image
              src={getImagePath(product?.img || null)}
              alt={product?.name || ""}
              width={800}
              height={600}
              unoptimized
              className="rounded-xl w-full h-auto max-h-87.5 object-contain mx-auto"
            />
            <div className="text-sm">{/* other infos */}</div>
          </div>

          {/* Gallery */}
          <div className="flex gap-x-2 items-center overflow-x-auto max-w-full p-1 *:bg-white *:cursor-pointer *:border *:border-gray-300 *:rounded-md *:overflow-hidden *:shrink-0 [*_img]:p-2 [*_img]:size-16 [*_img]:object-contain">
            <div>
              <Image src="/images/products/8.webp" width={64} height={64} alt="" />
            </div>
            <div className="flex">
              <Image src="/images/products/8.webp" width={64} height={64} alt="" />
            </div>
            <div className="flex">
              <Image src="/images/products/8.webp" width={64} height={64} alt="" />
            </div>
            <div className="flex">
              <Image src="/images/products/8.webp" width={64} height={64} alt="" />
            </div>

            {/* gallery more... */}
            <div
              className="relative flex items-center justify-center size-16"
              onClick={() => setShowGallery(true)}
            >
              <div className="blur-sm opacity-50 p-1 size-full flex items-center justify-center">
                <Image src="/images/products/8.webp" width={64} height={64} alt="" className="size-full object-contain" />
              </div>
              <div className="absolute size-7 flex items-center justify-center text-gray-800 dark:text-white">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductGallery
        showGallery={showGallery}
        hideGallery={() => setShowGallery(false)}
      />
    </>
  );
}