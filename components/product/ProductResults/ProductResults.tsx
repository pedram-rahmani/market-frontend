"use client";

import { useEffect, useState } from "react";
import ProductBoxSearch from "@/components/product/ProductBox/ProductBoxSearch";
import { getProducts } from "@/services/product";
import { ProductSummary } from "@/types/product";

export default function ProductResults({ initialProducts, categorySlug, cleanTitle }: { 
  initialProducts?: ProductSummary[], 
  categorySlug?: string,
  cleanTitle?: string 
}) {
  const [products, setProducts] = useState<ProductSummary[]>(initialProducts || []);
  const [isLoading, setIsLoading] = useState(!initialProducts);

  useEffect(() => {
    if (initialProducts) return;

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts(categorySlug ? { category: categorySlug } : {});
        setProducts(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [categorySlug, initialProducts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 bg-white/5 animate-pulse rounded-3xl" />
        ))
      ) : products.length > 0 ? (
        products.map((product) => (
          <ProductBoxSearch key={product.id} productInfos={product} />
        ))
      ) : (
        <div className="col-span-full py-20 text-center text-gray-400">
          محصولی{cleanTitle ? ` در دسته‌بندی "${cleanTitle}" ` : " "}پیدا نشد.
        </div>
      )}
    </div>
  );
}