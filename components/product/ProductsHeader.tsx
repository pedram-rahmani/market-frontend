"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Select from "@/components/ui/Form/Select";

interface ProductsHeaderProps {
  totalCount: number;
}

const sortOptions = [
  { value: "newest", label: "جدیدترین" },
  { value: "cheapest", label: "ارزان‌ترین" },
  { value: "expensive", label: "گران‌ترین" },
  { value: "popular", label: "محبوب‌ترین" },
  { value: "most_discount", label: "پر تخفیف‌ترین" },
];

export default function ProductsHeader({ totalCount }: ProductsHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSort);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-5">
      <div>
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">
          همه محصولات
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          نمایش {totalCount} کالا در فروشگاه
        </p>
      </div>

      <div className="flex items-center gap-x-2 min-w-[210px] whitespace-nowrap">
        <span className="text-xs text-gray-500 shrink-0">مرتب‌سازی:</span>
        <div className="flex-1 min-w-[150px]">
          <Select
            options={sortOptions}
            value={currentSort}
            onChange={handleSortChange}
            variant="simple"
            placeholder="مرتب‌سازی"
          />
        </div>
      </div>
    </div>
  );
}