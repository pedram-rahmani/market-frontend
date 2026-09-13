"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { removeItem } from "@/store/slices/cartSlice";
import QuantityController from "@/components/cart/QuantityController";
import CartSummary from "@/components/cart/CartSummery";

export default function CartSection() {
  const router = useRouter();
  const dispatch = useDispatch();

  const items = useSelector((state: RootState) => state.cart.items);

  // discount code
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCouponId, setAppliedCouponId] = useState<number | null>(null);

  // total price (جمع قیمت پایه محصولات بدون کسر تخفیف)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.totalPrice * item.quantity,
    0,
  );

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // product discount amount (محاسبه دقیق تخفیف درصدی محصولات از روی فیلد discount جدول دیتابیس)
  const totalProductDiscount = items.reduce((sum, item) => {
    const discountPercent = item.product?.discount || 0;
    const itemDiscountAmount = (item.totalPrice * discountPercent) / 100;
    return sum + itemDiscountAmount * item.quantity;
  }, 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>سبد خرید شما خالی است.</p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all shadow-lg shadow-violet-600/25"
        >
          بازگشت به فروشگاه
        </Link>
      </div>
    );
  }

  const groupedItems = items.reduce(
    (acc, item) => {
      const productId = item.product.id;
      if (!acc[productId]) {
        acc[productId] = {
          product: item.product,
          variants: [],
        };
      }
      acc[productId].variants.push(item);
      return acc;
    },
    {} as Record<string, { product: any; variants: typeof items }>,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* محصولات */}
      <div className="lg:col-span-8 space-y-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          سبد خرید ({totalQuantity} کالا)
        </p>

        {Object.values(groupedItems).map(({ product, variants }) => {
          const productTotalQty = variants.reduce(
            (sum, v) => sum + v.quantity,
            0,
          );
          const productImage = product.img || product.image;

          return (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl space-y-4 shadow-sm dark:shadow-none transition-colors"
            >
              <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                {productImage ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shrink-0">
                    <img
                      src={
                        productImage.startsWith("http")
                          ? productImage
                          : `http://localhost:8000/storage/${productImage.replace(/^\/+/, "").replace(/^storage\//, "")}`
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shrink-0 flex items-center justify-center text-xs text-gray-400">
                    بدون تصویر
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-gray-800 dark:text-white font-bold hover:text-violet-600 dark:hover:text-violet-400 transition-colors block text-base truncate"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-gray-400 mt-1">
                    مجموع در سبد خرید: {productTotalQty} عدد
                  </p>
                </div>
              </div>

              {/* مدل‌ها و رنگ‌ها */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">
                  موارد انتخاب شده:
                </span>

                {variants.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800/80"
                  >
                    <div className="space-y-1">
                      {item.color ? (
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 inline-block shrink-0 shadow-xs"
                            style={{
                              backgroundColor:
                                item.color.hex || item.color.value,
                            }}
                          />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                            {item.color.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">
                          مدل استاندارد
                        </span>
                      )}

                      {item.warranty && (
                        <p className="text-[11px] text-gray-400">
                          گارانتی: {item.warranty.title}
                        </p>
                      )}

                      <p className="text-violet-600 dark:text-violet-400 text-xs font-semibold pt-0.5">
                        {item.totalPrice.toLocaleString()} تومان
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <QuantityController
                        cartId={item.cartId}
                        quantity={item.quantity}
                      />

                      <button
                        onClick={() => dispatch(removeItem(item.cartId))}
                        className="text-red-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                        type="button"
                        title="حذف این رنگ"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="size-4! fill-current!"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.562 1.215-2.91 2.77-3.049a52.936 52.936 0 013.26 0c1.555.139 2.77 1.486 2.77 3.049zm-6.26-1.86a55.634 55.634 0 013.018 0c1.01.09 1.791.917 1.791 1.99v2.16a49.376 49.376 0 00-6.6 0v-2.16c0-1.073.78-1.9 1.79-1.9z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* product summary */}
      <div className="lg:col-span-4">
        <CartSummary
          totalPrice={totalPrice}
          totalDiscount={totalProductDiscount}
          appliedDiscountAmount={discountAmount}
          totalQuantity={totalQuantity}
          onCheckout={() => router.push("/checkout")}
          onApplyDiscount={(amount, couponId) => {
            setDiscountAmount(amount);
            setAppliedCouponId(couponId);
          }}
        />
      </div>
    </div>
  );
}
