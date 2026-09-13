// components/cart/QuantityController.tsx
"use client";

import { useDispatch } from "react-redux";
import { updateQuantity, removeItem } from "@/store/slices/cartSlice";

interface QuantityControllerProps {
  cartId: string;
  quantity: number;
}

export default function QuantityController({
  cartId,
  quantity,
}: QuantityControllerProps) {
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(updateQuantity({ cartId, quantity: quantity + 1 }));
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      dispatch(updateQuantity({ cartId, quantity: quantity - 1 }));
    } else {
      dispatch(removeItem(cartId));
    }
  };

  return (
    <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden bg-gray-50 dark:bg-white/5">
      <button
        type="button"
        onClick={handleIncrement}
        className="px-2 py-1.5 text-xs hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="size-3!">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </button>
      <span className="px-2.5 pt-1 text-xs font-semibold text-text-on-light dark:text-text-on-dark cursor-default">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleDecrement}
        className="px-2 py-1.5 text-xs hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="size-3!">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      </button>
    </div>
  );
}
