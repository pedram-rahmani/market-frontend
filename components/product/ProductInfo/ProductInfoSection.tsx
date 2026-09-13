"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { ProductColor, ProductSize, Product } from "@/types/product";

export default function ProductInfoSection() {
  const product = useSelector((state: any) => state.product?.currentProduct) as Product | null;

  if (!product) {
    return (
      <div className="text-center text-gray-500 py-10">در حال بارگذاری محصول...</div>
    );
  }

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(product.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(product.sizes?.[0] || null);

  return (
    <div className="col-span-full lg:col-span-5 px-4 lg:pl-8 lg:px-0 text-my-Txt2 dark:text-my-Txt1 w-full max-w-full overflow-hidden">
      {/* Product Header */}
      <div>
        <div className="flex items-center gap-x-3">
          <div className="flex items-center justify-center size-12 rounded-full p-1 bg-my-dark2 shadow-inner-dark shrink-0">
            <img src="/images/logos/verena-logo.png" alt="" className="size-full object-contain" />
          </div>
          <div className="text-sm font-medium">verena</div>
        </div>
        <h1 className="text-base md:text-lg font-bold mt-2 mb-3 leading-relaxed">{product.name}</h1>
      </div>

      {/* Rating */}
      <div className="flex items-center flex-wrap gap-y-1">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <svg
              key={index}
              className={`size-4 md:size-5 ${
                (product.rate ?? 0) >= index + 1
                  ? `fill-my-yellow stroke-my-yellow`
                  : `fill-my-gray2 stroke-my-gray3`
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
          ))}
        </div>
        <span className="text-xs md:text-sm ml-2 px-2.5 pt-0.5 text-gray-500">54 نظر</span>
      </div>

      {/* Product Price */}
      <div className="flex items-center gap-x-2 text-2xl md:text-3xl font-bold mt-4 mb-8">
        <span className="text-sm font-normal text-gray-500">تومان</span>
        <span>{(product.price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
      </div>

      {/* Product Colors */}
      <div className="flex flex-wrap gap-3 mb-6">
        {product.colors?.map((color: ProductColor) => {
          const isLightColor = 
            color.hex?.toLowerCase() === "#ffffff" || 
            color.hex?.toLowerCase() === "white" || 
            color.hex?.toLowerCase() === "#fff";

          const isSelected = selectedColor?.hex === color.hex;

          return (
            <div
              key={color.name}
              className="flex flex-col items-center gap-y-2 group cursor-pointer"
              onClick={() => setSelectedColor(color)}
            >
              <div
                className={`relative border-2 rounded-full p-0.5 transition-all ${
                  isLightColor ? "border-gray-300 dark:border-gray-600" : ""
                } ${isSelected ? "border-my-blue1 scale-105" : "border-transparent"}`}
                style={{ borderColor: isSelected ? undefined : (isLightColor ? undefined : color.hex) }}
              >
                <div
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full transition-all ${
                    isSelected ? "border-2 border-my-blue1" : ""
                  }`}
                  style={{ backgroundColor: color.hex }}
                ></div>
              </div>
              <span
                className={`text-[11px] md:text-xs ${
                  isSelected
                    ? "text-my-Txt3 dark:text-my-Txt1 font-semibold underline underline-offset-8"
                    : "text-gray-400 dark:text-my-Txt2"
                }`}
              >
                {color.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Product Sizes */}
      <div className="flex flex-wrap gap-2 mt-6">
        {product.sizes?.map((size: ProductSize) => (
          <button
            key={size.id}
            onClick={() => setSelectedSize(size)}
            className={`w-14 h-14 md:w-16 md:h-16 rounded-lg text-base md:text-lg font-semibold transition-all flex items-center justify-center shrink-0 ${
              selectedSize?.id === size.id
                ? "bg-my-blue1 text-my-Txt1 dark:shadow-inner-dark"
                : "bg-my-gray1 dark:bg-my-blue4 hover:bg-gray-300 shadow"
            }`}
          >
            {size.name}
          </button>
        ))}
      </div>

      {/* Add to Cart Button */}
      <div className="mt-10">
        <div className="btn-red w-full flex items-center justify-center gap-2 cursor-pointer py-3 rounded-xl text-white">
          <span>اضافه کردن به سبد خرید</span>
          <svg viewBox="0 0 24 24" className="size-5 fill-current">
            <path d="M7 4v2h10V4H7zM5 4H3c-1.1 0-1.99.9-1.99 2L1 20c0 1.1.89 2 1.99 2h18c1.1 0 1.99-.9 1.99-2l.01-14c0-1.1-.89-2-1.99-2h-2v-2H5zM12 15h-2v-2h2v2zm3-5H9V8h6v2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}