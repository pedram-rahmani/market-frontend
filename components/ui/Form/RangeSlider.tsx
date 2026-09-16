"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import FilterSection from "@/components/product/ProductFilter/FilterSection";

interface RangeSliderProps {
  title?: string;
  absoluteMin?: number;
  absoluteMax?: number;
  step?: number;
}

export default function RangeSlider({
  title = "محدوده قیمت",
  absoluteMin = 0,
  absoluteMax = 100000000, // سقف پیش‌فرض رو گذاشتم ۱۰۰ میلیون تا مقدار واقعی سرور جاش بشینه
  step = 50000,
}: RangeSliderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [minVal, setMinVal] = useState<number>(() => {
    const param = searchParams.get("min_price");
    return param ? Number(param) : absoluteMin;
  });

  const [maxVal, setMaxVal] = useState<number>(() => {
    const param = searchParams.get("max_price");
    return param ? Number(param) : absoluteMax;
  });

  useEffect(() => {
    const urlMin = searchParams.get("min_price");
    const urlMax = searchParams.get("max_price");

    setMinVal(urlMin ? Number(urlMin) : absoluteMin);
    // اگر در URL مقدار مکس نبود، از مقدار جدید و داینامیک سرور (absoluteMax) استفاده کن
    setMaxVal(urlMax ? Number(urlMax) : absoluteMax);
  }, [searchParams, absoluteMin, absoluteMax]);

  const commitPriceChange = (newMin: number, newMax: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newMin > absoluteMin) params.set("min_price", newMin.toString());
    else params.delete("min_price");

    if (newMax < absoluteMax) params.set("max_price", newMax.toString());
    else params.delete("max_price");

    router.push(`${pathname}?${params.toString()}`);
  };

  const minPercent =
    ((minVal - absoluteMin) / (absoluteMax - absoluteMin)) * 100;
  const maxPercent =
    ((maxVal - absoluteMin) / (absoluteMax - absoluteMin)) * 100;

  return (
    <FilterSection title={title} isOpenDefault={true}>
      <div className="space-y-4 py-3">
        {/* slider direction */}
        <div className="relative flex items-center h-6 px-1" dir="ltr">
          {/* backgrond tape */}
          <div className="absolute left-0 right-0 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full" />

          {/* tape */}
          <div
            className="absolute h-1.5 bg-emerald-500 rounded-full"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />

          {/* minimum */}
          <input
            type="range"
            min={absoluteMin}
            max={absoluteMax}
            step={step}
            value={minVal}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value <= maxVal - step) {
                setMinVal(value);
              }
            }}
            onMouseUp={() => commitPriceChange(minVal, maxVal)}
            onTouchEnd={() => commitPriceChange(minVal, maxVal)}
            className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-20 accent-emerald-500 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none"
          />

          {/* maximum */}
          <input
            type="range"
            min={absoluteMin}
            max={absoluteMax}
            step={step}
            value={maxVal}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= minVal + step) {
                setMaxVal(value);
              }
            }}
            onMouseUp={() => commitPriceChange(minVal, maxVal)}
            onTouchEnd={() => commitPriceChange(minVal, maxVal)}
            className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none z-30 accent-emerald-500 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none"
          />
        </div>

        {/* price */}
        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <div>
            <span>تا: </span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {maxVal.toLocaleString()} تومان
            </span>
          </div>
          <div>
            <span>از: </span>
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {minVal.toLocaleString()} تومان
            </span>
          </div>
        </div>
      </div>
    </FilterSection>
  );
}