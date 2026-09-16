"use client";

import { useState, useEffect } from "react";
import { Warranty } from "@/types/product";

interface Props {
  warranties?: Warranty[];
  onSelectWarranty?: (warranty: Warranty) => void;
}

export default function ProductGuarantee({
  warranties = [],
  onSelectWarranty,
}: Props) {
  if (!warranties || warranties.length === 0) return null;

  const defaultWarranty =
    warranties.find((w) => w.pivot?.is_default) || warranties[0];
  const [selectedWarranty, setSelectedWarranty] =
    useState<Warranty>(defaultWarranty);

  useEffect(() => {
    if (defaultWarranty && onSelectWarranty) {
      onSelectWarranty(defaultWarranty);
    }
  }, []);

  const handleSelect = (warranty: Warranty) => {
    setSelectedWarranty(warranty);
    if (onSelectWarranty) {
      onSelectWarranty(warranty);
    }
  };

  return (
    <div className="space-y-3 my-4">
      <span className="text-sm font-bold text-gray-300 block">
        انتخاب گارانتی:
      </span>

      <div className="space-y-2">
        {warranties.map((warranty) => {
          const isSelected = selectedWarranty?.id === warranty.id;
          const extraPrice = Number(warranty.pivot?.price || 0);

          return (
            <div
              key={warranty.id}
              onClick={() => handleSelect(warranty)}
              className={`bg-light/10 dark:bg-dark-700/70 border border-custom-gray-400/25 dark:border-dark-600 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-all cursor-pointer ${
                isSelected
                  ? "border-cyan-500/80! bg-cyan-500/5"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className={`size-9 sm:size-10 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                    isSelected
                      ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 scale-105"
                      : "bg-white/5 border border-white/10 text-gray-400"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="size-4! sm:size-5!">
                    <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>

                <div className="space-y-0.5 flex-1 min-w-0">
                  <span className="text-white font-bold text-xs sm:text-sm truncate block">
                    {warranty.title}
                  </span>
                  {warranty.description && (
                    <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed line-clamp-1">
                      {warranty.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-left shrink-0 pl-1">
                {extraPrice > 0 ? (
                  <span className="text-[11px] sm:text-xs font-semibold text-cyan-400 block whitespace-nowrap">
                    +{extraPrice.toLocaleString()} تومان
                  </span>
                ) : (
                  <span className="text-[11px] sm:text-xs font-semibold text-emerald-400 block whitespace-nowrap">
                    رایگان
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
