"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductSummary } from "@/types/product";
import useDiscount from "@/store/hooks/useDiscount";
import { getImagePath, e2f } from "@/lib/utils";

interface ProductBoxSearchProps {
  productInfos: ProductSummary;
}

export default function ProductBoxSearch({
  productInfos,
}: ProductBoxSearchProps) {
  const { img, name, price, discount, slug, description } = productInfos;

  const finalDiscount = discount ?? 0;

  const { finalPrice, isFree } = useDiscount(price, finalDiscount);

  return (
    <div className="group relative bg-light dark:bg-dark-600 backdrop-blur-md border shadow border-white/10 p-4 rounded-b-4xl hover:border-teal-500/50 transition-all duration-300">
      {/* product image */}
      <Link
        href={`/products/${slug}`}
        className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-dark-900/30 block"
      >
        <Image
          src={getImagePath(img)}
          alt={name}
          fill
          unoptimized
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 300px"
        />

        {finalDiscount > 0 && (
          <div
            className={`absolute top-4 left-4 text-white text-[10px] font-bold px-2 py-1 rounded-lg z-10 shadow-xl ${
              isFree ? "bg-teal-500 animate-pulse text-xs" : "bg-teal-500"
            }`}
          >
            {isFree ? "رایگان!" : `${e2f(finalDiscount)}٪ تخفیف`}
          </div>
        )}
      </Link>

      <div className="mt-4 space-y-3">
        {/* Title */}
        <h3 className="text-text-on-light/90 dark:text-text-on-dark text-sm font-bold line-clamp-2 min-h-10">
          <Link href={`/products/${slug}`}>{name}</Link>
        </h3>

        {/* Description */}
        {description && (
          <p className="text-xs text-gray-400 line-clamp-2 h-10 leading-6">
            {description}
          </p>
        )}

        <div className="flex justify-between items-center pt-2">
          <div className="flex flex-col items-start">
            {finalDiscount > 0 && !isFree && (
              <span className="text-[10px] text-gray-500 line-through">
                {e2f(price)}
              </span>
            )}

            <span
              className={`font-black text-lg ${isFree ? "text-red-400 animate-pulse" : "text-teal-400"}`}
            >
              {finalPrice}
              {!isFree && (
                <span className="text-[10px] font-normal mr-1 text-gray-400">
                  تومان
                </span>
              )}
            </span>
          </div>

          <button className="bg-teal-500/20 hover:bg-teal-500 text-teal-500 hover:text-white p-2.5 rounded-xl transition-all shadow-lg shadow-teal-500/10">
            <svg className="size-5!" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
