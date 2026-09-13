"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Checkbox from "@/components/ui/Form/Checkbox";
import RangeSlider from "@/components/ui/Form/RangeSlider";
import FilterSection from "./FilterSection";
import useLockBodyScroll from "@/store/hooks/useLockBodyScroll";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

interface ProductFilterProps {
  filterGroups?: FilterGroup[];
  isOpen?: boolean;
  onClose?: () => void;
  absoluteMax?: number;
  step?: number;
}

export default function ProductFilter({
  filterGroups = [],
  isOpen = false,
  onClose,
  absoluteMax,
  step,
}: ProductFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLockBodyScroll(!!isOpen);

  const updateQuery = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const handleResetFilters = () => {
    router.push(pathname);
  };

  const filterContent = (
    <div className="w-full rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 backdrop-blur-md flex flex-col max-h-[80vh] md:max-h-none">
      <div className="mb-4 flex items-center justify-between border-b pb-3 border-zinc-100 dark:border-zinc-800 shrink-0">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          فیلترها
        </h3>

        <div className="flex items-center gap-x-3">
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-medium text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            حذف همه
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="md:hidden text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <svg className="size-5!" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-y-auto pr-1 pl-1 space-y-1 divide-y divide-zinc-100 dark:divide-zinc-800">
        <RangeSlider absoluteMax={absoluteMax} step={step} />

        <FilterSection title="وضعیت کالا" isOpenDefault={true}>
          <div className="flex items-center justify-between py-1">
            <Checkbox
              id="in_stock"
              label="فقط کالاهای موجود"
              checked={searchParams.get("in_stock") === "true"}
              activeColor="bg-emerald-500 border-emerald-500"
              onInputHandler={(_, checked) =>
                updateQuery("in_stock", checked ? "true" : null)
              }
            />
          </div>
          <div className="flex items-center justify-between py-1">
            <Checkbox
              id="has_discount"
              label="فقط کالاهای دارای تخفیف"
              checked={searchParams.get("has_discount") === "true"}
              activeColor="bg-emerald-500 border-emerald-500"
              onInputHandler={(_, checked) =>
                updateQuery("has_discount", checked ? "true" : null)
              }
            />
          </div>
        </FilterSection>

        {filterGroups.map((group) => {
          const currentValues =
            searchParams.get(group.id)?.split(",").filter(Boolean) || [];

          return (
            <FilterSection
              key={group.id}
              title={group.title}
              isOpenDefault={true}
            >
              <div className="space-y-3">
                {group.options.map((option) => {
                  const isChecked = currentValues.includes(option.value);

                  return (
                    <div
                      key={option.value}
                      className="flex items-center justify-between py-0.5"
                    >
                      <Checkbox
                        id={`${group.id}-${option.value}`}
                        label={option.label}
                        checked={isChecked}
                        activeColor="bg-emerald-500 border-emerald-500"
                        onInputHandler={(_, checked) => {
                          const updated = checked
                            ? [...currentValues, option.value]
                            : currentValues.filter((v) => v !== option.value);

                          updateQuery(
                            group.id,
                            updated.length ? updated.join(",") : null,
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </FilterSection>
          );
        })}
      </div>
    </div>
  );

  // بخش دسکتاپ به صورت عادی رندر میشه
  const desktopView = (
    <div className="hidden md:block w-full max-w-xs">{filterContent}</div>
  );

  // بخش موبایل از طریق Portal مستقیم به بدنه صفحه (body) منتقل میشه تا بالاتر از فوتر قرار بگیره
  const mobileModal =
    isOpen && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:hidden">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
              onClick={onClose}
            />
            <div className="relative z-10 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
              {filterContent}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {desktopView}
      {mobileModal}
    </>
  );
}
