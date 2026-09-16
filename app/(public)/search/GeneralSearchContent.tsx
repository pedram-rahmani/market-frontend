"use client";

import { useState } from "react";
import ProductResults from "@/components/product/ProductResults/ProductResults";
import ProductFilter, { FilterGroup } from "@/components/product/ProductFilter/ProductFilter";
import ProductSorting from "@/components/product/ProductSorting/ProductSorting";

interface GeneralSearchContentProps {
  initialProducts: any[];
  searchQuery?: string;
  onOpenFilter?: () => void;
  filterGroups?: FilterGroup[];
  absoluteMax?: number;
  step?: number;
}

export default function GeneralSearchContent({
  initialProducts,
  searchQuery,
  onOpenFilter,
  filterGroups = [],
}: GeneralSearchContentProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleOpenFilter = () => {
    setIsFilterOpen(true);
    if (onOpenFilter) onOpenFilter();
  };

  return (
    <section className="mt-6 w-full bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/10 p-4 md:p-8 rounded-3xl transition-all">
      {searchQuery && (
        <div className="mb-6 text-lg font-bold text-gray-800 dark:text-white">
          نتایج جستجو برای: <span className="text-cyan-400">«{searchQuery}»</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8">
        {/* filters */}
        <aside className="md:col-span-4 lg:col-span-3">
          <ProductFilter
            filterGroups={filterGroups}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </aside>

        {/* products */}
        <main className="md:col-span-8 lg:col-span-9 flex flex-col gap-6">
          <ProductSorting onOpenFilter={handleOpenFilter} />
          <ProductResults
            key={JSON.stringify(initialProducts)}
            initialProducts={initialProducts}
          />
        </main>
      </div>
    </section>
  );
}