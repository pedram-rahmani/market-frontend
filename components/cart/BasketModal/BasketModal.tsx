"use client";

import { forwardRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Link from "next/link";
import { CartItem } from "@/store/slices/cartSlice";
import QuantityController from "@/components/cart/QuantityController";

interface BasketModalProps {
  showBasket: boolean;
  onClose?: () => void;
}

const BasketModal = forwardRef<HTMLDivElement, BasketModalProps>(
  ({ showBasket, onClose }, ref) => {
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const totalItemsCount = cartItems.reduce(
      (sum: number, item: CartItem) => sum + item.quantity,
      0
    );

    const totalPrice = cartItems.reduce(
      (sum: number, item: CartItem) => sum + item.totalPrice * item.quantity,
      0
    );

    return (
      <>
        {/* Cart Icon Badge */}
        {totalItemsCount > 0 && (
          <div className="absolute -top-1 -right-1 text-[10px] flex items-center justify-center size-5 border-2 border-white dark:border-[#16161a] rounded-full bg-violet-600 text-white font-bold">
            {totalItemsCount}
          </div>
        )}

        {/* Basket Modal Container */}
        <div
          ref={ref}
          className={`absolute left-0 top-full pt-4 z-50 transition-all duration-300 origin-top ${
            showBasket
              ? "opacity-100 visible translate-y-0 scale-100"
              : "opacity-0 invisible -translate-y-2 scale-95"
          }`}
        >
          {/* triangle */}
          <div className="absolute top-2.5 left-5 w-3 h-3 bg-white/95 dark:bg-[#202327] border-t border-l border-gray-200 dark:border-white/5 rotate-45 z-10"></div>

          {/* Modal Body */}
          <div className="relative w-80 bg-white/95 dark:bg-[#16161a]/95 border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
              <span className="font-bold text-gray-800 dark:text-white">
                سبد خرید من
              </span>
              <span className="text-xs bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 px-2 py-1 rounded-md font-medium">
                {totalItemsCount} مورد
              </span>
            </div>

            {cartItems.length === 0 ? (
              /* Empty Basket State */
              <div className="py-10 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <svg
                  className="w-12 h-12 mb-3 opacity-20"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="text-sm">سبد خرید شما خالیست</span>
              </div>
            ) : (
              /* Filled Basket State */
              <div className="flex flex-col">
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
                  {cartItems.map((item: CartItem) => (
                    <div
                      key={item.cartId}
                      className="flex items-center justify-between gap-3 p-4"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                          {item.product?.name}
                        </h4>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {item.color && <span>رنگ: {item.color.name}</span>}
                        </div>
                        <div className="text-xs font-bold text-cyan-400 mt-1">
                          {(item.totalPrice * item.quantity).toLocaleString()}{" "}
                          تومان
                        </div>
                      </div>

                      <QuantityController
                        cartId={item.cartId}
                        quantity={item.quantity}
                      />
                    </div>
                  ))}
                </div>

                {/* Footer / Checkout */}
                <div className="p-4 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      مبلغ قابل پرداخت:
                    </span>
                    <span className="font-bold text-gray-800 dark:text-white">
                      {totalPrice.toLocaleString()} تومان
                    </span>
                  </div>

                  <Link
                    href="/cart"
                    onClick={() => {
                      if (onClose) onClose();
                    }}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-center text-sm font-bold rounded-xl transition-all shadow-lg shadow-violet-600/20 block"
                  >
                    مشاهده سبد خرید و تسویه
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

BasketModal.displayName = "BasketModal";

export default BasketModal;