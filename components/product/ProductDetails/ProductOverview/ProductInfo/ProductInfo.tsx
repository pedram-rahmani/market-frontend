"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "@/store/slices/cartSlice";
import ProductGuarantee from "../ProductGuarantee/ProductGuarantee";
import { Product, ProductOption } from "@/types/product";

export default function ProductInfo({ product }: { product: Product }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.items);

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]);

  // Dynamic state for options ( "اندازه صفحه": "42mm", "حافظه": "128GB" )
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initialOptions: Record<string, string> = {};
    product?.options?.forEach((opt: ProductOption) => {
      if (opt.items && opt.items.length > 0) {
        initialOptions[opt.title] = opt.items[0];
      }
    });
    return initialOptions;
  });

  // Default warranty
  const defaultWarranty =
    product?.warranties?.find((w: any) => w.pivot?.is_default) ||
    product?.warranties?.[0];

  const [selectedWarranty, setSelectedWarranty] = useState<any>(defaultWarranty);
  const [isAdding, setIsAdding] = useState(false);

  // Final price calculation
  const basePrice = Number(product?.price || 0);
  const warrantyPrice = Number(selectedWarranty?.pivot?.price || 0);
  const totalPrice = basePrice + warrantyPrice;

  const existingCartItem = cartItems.find((item: any) => {
    const isSameProduct = item.product.id === product.id;
    const isSameColor = item.color?.id === selectedColor?.id;
    const isSameWarranty = item.warranty?.id === selectedWarranty?.id;
    
    const isSameOptions = JSON.stringify(item.options) === JSON.stringify(selectedOptions);

    return isSameProduct && isSameColor && isSameWarranty && isSameOptions;
  });

  const handleOptionSelect = (title: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [title]: value,
    }));
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    
    dispatch(
      addItem({
        product,
        color: selectedColor || null,
        options: selectedOptions,
        warranty: selectedWarranty || null,
        totalPrice,
      })
    );

    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8 bg-white/85 dark:bg-dark-700/70 rounded-3xl border border-custom-gray-100/70 dark:border-dark-600 shadow-sm w-full max-w-full overflow-hidden box-border">
      {/* Product Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-text-on-light/80 dark:text-text-on-dark/90 tracking-tighter leading-relaxed">
        {product?.name}
      </h1>

      {/* Total Price */}
      <div className="text-lg sm:text-xl font-bold text-cyan-400">
        {totalPrice.toLocaleString()}
        <span className="text-xs sm:text-sm text-gray-500 mr-2">تومان</span>
      </div>

      {/* Colors */}
      {product?.colors && product.colors.length > 0 && (
        <div className="py-4 border-y border-custom-gray-100/70 dark:border-dark-600">
          <p className="text-gray-400 mb-3 text-xs uppercase tracking-widest">
            رنگ: {selectedColor?.name}
          </p>
          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {product.colors.map((color: any) => {
              const isLightColor = 
                color.hex?.toLowerCase() === "#ffffff" || 
                color.hex?.toLowerCase() === "white" || 
                color.hex?.toLowerCase() === "#fff" ||
                color.hex?.toLowerCase() === "#f9f9f9";

              const isSelected = selectedColor?.id === color.id;

              return (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full transition-all duration-300 flex items-center justify-center shrink-0 ${
                    isLightColor ? "border border-gray-300 dark:border-gray-600 shadow-sm" : ""
                  } ${
                    isSelected
                      ? "border-2 border-cyan-400 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {isSelected && (
                    <svg viewBox="0 0 24 24" fill="none" className={`size-3.5 sm:size-4 ${isLightColor ? "text-gray-900" : "text-white"}`}>
                      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5"></polyline>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Guarantee */}
      <ProductGuarantee
        warranties={product?.warranties}
        onSelectWarranty={(warranty) => setSelectedWarranty(warranty)}
      />

      {/* Dynamic Options */}
      {product?.options && product.options.length > 0 && (
        <div className="space-y-4">
          {product.options.map((option: ProductOption) => (
            <div key={option.title}>
              <p className="text-gray-400 mb-3 text-xs uppercase tracking-widest">
                {option.title}
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {option.items?.map((item: string) => {
                  const isSelected = selectedOptions[option.title] === item;
                  return (
                    <button
                      key={item}
                      onClick={() => handleOptionSelect(option.title, item)}
                      className={`px-4 sm:px-6 py-2 rounded-xl border transition-all text-xs sm:text-sm font-semibold shrink-0 ${
                        isSelected
                          ? "bg-white/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                          : "bg-custom-gray-300/20 dark:bg-dark-600 border-transparent text-gray-400 hover:bg-dark-600/10 dark:hover:bg-white/10"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Purchase Button / In Cart Status */}
      <button
        onClick={handleAddToCart}
        className={`w-full py-3 mt-2 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
          existingCartItem
            ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] hover:bg-emerald-500/20"
            : "bg-linear-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_-3px_rgba(6,182,212,0.6)]"
        }`}
      >
        <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {existingCartItem ? (
            <path d="M20 6 9 17l-5-5" />
          ) : (
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
          )}
        </svg>
        <span>
          {isAdding
            ? "در حال افزودن..."
            : existingCartItem
            ? `موجود در سبد خرید (${existingCartItem.quantity} عدد)`
            : "افزودن به سبد خرید"}
        </span>
      </button>
    </div>
  );
}