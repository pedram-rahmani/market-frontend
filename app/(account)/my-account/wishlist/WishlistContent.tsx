"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/ui/emptyState/EmptyState";
import ProductBox from "@/components/product/ProductBox/ProductBox";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import axiosInstance from "@/lib/axiosInstance";
import { ProductSummary } from "@/types/product";

export default function WishlistContent() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/wishlist")
      .then(({ data }) => setProducts(data.items || []))
      .catch((error) => console.error("Failed to load wishlist:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="محصولات مورد علاقه من"
        description="محصولاتی که برای خرید بعدی نشان کرده‌اید"
        icon={
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
            />
          </svg>
        }
      />

      {loading ? (
        <div className="py-16 text-center text-sm text-gray-500">
          در حال دریافت علاقه‌مندی‌ها...
        </div>
      ) : products.length === 0 ? (
        <EmptyState
        tone="pink"
        eyebrow="لیست شخصی شما"
        title="هنوز محصولی ذخیره نکرده‌اید"
        description="محصولاتی را که دوست دارید به علاقه‌مندی‌ها اضافه کنید تا بعداً راحت‌تر آن‌ها را پیدا کنید."
        actionLabel="مشاهده محصولات"
        actionHref="/products"
        icon={
          <svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
            />
          </svg>
        }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductBox key={product.id} productInfos={product} />
          ))}
        </div>
      )}
    </div>
  );
}
