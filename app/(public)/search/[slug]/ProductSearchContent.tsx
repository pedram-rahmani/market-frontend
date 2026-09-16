"use client";

import { useState } from "react";
import ProductFilter, { FilterGroup } from "@/components/product/ProductFilter/ProductFilter";

interface ProductSearchContentProps {
  children: React.ReactNode;
  filterGroups?: FilterGroup[]; 
  absoluteMax?: number;
  step?: number;
}

export default function ProductSearchContent({
  children,
  filterGroups = [],
}: ProductSearchContentProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="relative w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8">
        <aside className="md:col-span-4 lg:col-span-3">
          <ProductFilter
            filterGroups={filterGroups}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </aside>

        <main className="md:col-span-8 lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}