"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/utils";
import { ProductSummary } from "@/types/product";
import ProductBox from "@/components/product/ProductBox/ProductBox";

export default function OffersPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        const productList = Array.isArray(data) ? data : data.data || [];
        
        const discounted = productList.filter((p: ProductSummary) => p.discount && p.discount > 0);
        setProducts(discounted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching offers:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 rtl" dir="rtl">
      {/* banner */}
      <div className="bg-linear-to-r from-red-500 to-pink-600 rounded-2xl p-8 text-white mb-10 shadow-lg flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <span className="text-red-100 text-xs font-medium">بخش تخفیف‌ها و پیشنهادهای ویژه</span>
          <h1 className="text-3xl font-black mb-2">جشنواره تخفیف‌های شگفت‌انگیز</h1>
          <p className="text-red-100 text-sm">بهترین محصولات با بالاترین کیفیت و بیشترین تخفیف‌ها برای شما.</p>
        </div>
        <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/30 text-center">
          <span className="block text-xs uppercase tracking-wider">تخفیف‌های محدود</span>
          <span className="text-xl font-bold">فرصت محدود</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">در حال دریافت پیشنهادهای ویژه...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white dark:bg-ui-blue-800 rounded-2xl border border-gray-100 dark:border-dark-600">
          در حال حاضر محصول تخفیف‌داری موجود نیست.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductBox key={product.id} productInfos={product} />
          ))}
        </div>
      )}
    </div>
  );
}