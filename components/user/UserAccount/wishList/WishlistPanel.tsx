"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/ui/emptyState/EmptyState";
import axiosInstance from "@/lib/axiosInstance";
import { ProductSummary } from "@/types/product";
import WishlistCard from "./WishlistCard";

export default function WishlistPanel() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | string | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/wishlist")
      .then(({ data }) => setProducts(data.items || []))
      .catch((error) => console.error("Failed to load wishlist:", error))
      .finally(() => setLoading(false));
  }, []);

  const removeProduct = async (productId: number | string) => {
    setRemovingId(productId);
    try {
      await axiosInstance.post(`/wishlist/${productId}/toggle`);
      setProducts((current) => current.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Failed to remove wishlist item:", error);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="h-56 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-dark-600 dark:bg-dark-800"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        tone="pink"
        eyebrow="لیست شخصی شما"
        title="هنوز محصولی ذخیره نکرده‌اید"
        description="محصولاتی را که دوست دارید به علاقه‌مندی‌ها اضافه کنید تا بعداً راحت‌تر آن‌ها را پیدا کنید."
        actionLabel="مشاهده محصولات"
        actionHref="/products"
        icon={
          <svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
          </svg>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {products.map((product) => (
        <WishlistCard
          key={product.id}
          product={product}
          onRemove={removeProduct}
          removing={removingId === product.id}
        />
      ))}
    </div>
  );
}
