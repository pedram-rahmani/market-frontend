"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import RatingStars from "@/components/ui/RatingStars/RatingStars";
import SpinnerLoader from "@/components/ui/SpinnerLoader/SpinnerLoader";
import useDiscount from "@/store/hooks/useDiscount";
import { ProductSummary } from "@/types/product";
import { getImagePath, e2f } from "@/lib/utils";

interface ProductBoxProps {
  productInfos: ProductSummary;
}

export default function ProductBox({ productInfos }: ProductBoxProps) {
  if (!productInfos) return null;

  const { img, name, description, price, discount, slug, rate } = productInfos;

  const [isLoading, setIsLoading] = useState(true);
  const finalDiscount = discount ?? 0;

  const { finalPrice, isFree } = useDiscount(price, finalDiscount);

  return (
    <div className="flex flex-col h-full shadow-md rounded-lg w-full bg-custom-gray-100 dark:bg-ui-blue-800 border border-custom-gray-200 dark:border-dark-600 overflow-hidden group">
      {/* Product Image */}
      <Link
        href={`/products/${slug}`}
        className="relative w-full h-56 block overflow-hidden bg-custom-gray-100 dark:bg-ui-blue-800 rounded-t-lg shrink-0"
      >
        <Image
          src={getImagePath(img)}
          alt={name}
          fill
          unoptimized
          className={`object-contain p-4 transition-all duration-500 group-hover:scale-107 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/fallback.jpg";
          }}
          sizes="(max-width: 768px) 100vw, 300px"
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-ui-blue-800">
            <SpinnerLoader />
          </div>
        )}

        {/* offer label */}
        {finalDiscount > 0 && (
          <div
            className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10 shadow-md ${
              isFree ? "bg-red-600 animate-pulse text-xs" : "bg-red-500"
            }`}
          >
            {isFree ? "رایگان!" : `${e2f(finalDiscount)}٪ تخفیف`}
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-col flex-1 justify-between p-4">
        <div className="space-y-2">
          {/* title */}
          <h3 className="line-clamp-2 h-12 font-bold text-dark-900 dark:text-white text-sm sm:text-base">
            <Link
              href={`/products/${slug}`}
              className="hover:text-ui-green-700 transition-colors"
            >
              {name}
            </Link>
          </h3>

          {description ? (
            <p className="text-xs sm:text-sm line-clamp-2 h-10 opacity-70 dark:text-text-on-dark/70">
              {description}
            </p>
          ) : (
            <div className="h-10" />
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-custom-gray-300 dark:border-white/10">

          <div className="flex items-center justify-end mb-3 text-ui-yellow">
            <RatingStars rating={Number(rate) || 0} />
          </div>

          <div className="flex items-end justify-end">
            <div className="flex flex-col items-end min-h-11 justify-end">
              {/* main price (without discount) */}
              <div className="h-4 flex items-center justify-end">
                {finalDiscount > 0 && !isFree ? (
                  <span className="text-xs text-gray-400 line-through">
                    {e2f(price)}
                  </span>
                ) : null}
              </div>

              {/* final price*/}
              <span
                className={`text-lg font-bold ${
                  isFree
                    ? "text-red-500 dark:text-red-400 animate-pulse"
                    : "text-ui-green-700 dark:text-ui-green-400"
                }`}
              >
                {finalPrice}
                {!isFree && (
                  <span className="text-[10px] mr-1 font-normal opacity-70">
                    تومان
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}