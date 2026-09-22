"use client";

import Image from "next/image";
import Link from "next/link";
import { ProductSummary } from "@/types/product";
import { getImagePath } from "@/lib/utils";

interface WishlistCardProps {
  product: ProductSummary;
  onRemove: (productId: number | string) => void;
  removing: boolean;
}

export default function WishlistCard({
  product,
  onRemove,
  removing,
}: WishlistCardProps) {
  const discount = Number(product.discount || 0);
  const price = Number(product.price || 0);
  const finalPrice = Math.max(0, price - (price * discount) / 100);
  const isOutOfStock = Number((product as ProductSummary & { stock?: number }).stock) <= 0;

  return (
    <article className="group relative flex min-h-40 min-w-0 flex-row overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-all dark:border-dark-600 dark:bg-dark-800">
      <Link
        href={`/products/${product.slug}`}
        className="relative block h-auto w-32 shrink-0 overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-700 sm:w-40"
      >
        <Image
          src={getImagePath(product.img)}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, 176px"
          className="object-contain p-5 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-lg bg-rose-500 px-2 py-1 text-[10px] font-bold text-white">
            {discount}٪ تخفیف
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-3 sm:gap-4 sm:p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={`/products/${product.slug}`}
              className="line-clamp-2 text-xs font-bold leading-6 text-gray-800 transition-colors hover:text-cyan-500 dark:text-white sm:text-sm sm:leading-7"
            >
              {product.name}
            </Link>
            <button
              type="button"
              onClick={() => onRemove(product.id)}
              disabled={removing}
              aria-label="حذف از علاقه‌مندی‌ها"
              title="حذف از علاقه‌مندی‌ها"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-400 transition-colors hover:bg-rose-500/10 hover:text-rose-500 disabled:cursor-wait disabled:opacity-50 dark:bg-dark-700"
            >
              {removing ? (
                <span className="size-4 animate-spin rounded-full border-2 border-rose-400/30 border-t-rose-500" />
              ) : (
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 7h12m-9 0v10m6-10v10M9 4h6l1 3H8l1-3Zm-3 3h12l-1 13H7L6 7Z" />
                </svg>
              )}
            </button>
          </div>

          {product.description && (
            <p className="line-clamp-2 text-[11px] leading-5 text-gray-500 dark:text-gray-400 sm:text-xs sm:leading-6">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-gray-100 pt-3 dark:border-white/10">
          <div>
            <span className="block text-[10px] text-gray-400">قیمت نهایی</span>
            <strong className="text-sm text-cyan-500 sm:text-base">
              {finalPrice.toLocaleString("fa-IR")} تومان
            </strong>
            {discount > 0 && (
              <del className="mr-2 text-[10px] text-gray-400">
                {price.toLocaleString("fa-IR")}
              </del>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-medium ${
                isOutOfStock
                  ? "bg-rose-500/10 text-rose-500"
                  : "bg-emerald-500/10 text-emerald-500"
              }`}
            >
              {isOutOfStock ? "ناموجود" : "موجود"}
            </span>
            <Link
              href={`/products/${product.slug}`}
              className="rounded-lg bg-cyan-500 px-3 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-cyan-600"
            >
              مشاهده
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
