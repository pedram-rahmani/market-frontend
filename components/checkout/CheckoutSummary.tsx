import Link from "next/link";

interface CheckoutSummaryProps {
  totalItemsPrice: number;
  shippingCost: number;
  onPayment: () => void;
}

export default function CheckoutSummary({ totalItemsPrice, shippingCost, onPayment }: CheckoutSummaryProps) {
  const finalPrice = totalItemsPrice + shippingCost;

  return (
    <div className="bg-white dark:bg-ui-blue-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
      <h3 className="font-bold text-base text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
        خلاصه صورت‌حساب
      </h3>
      
      <div className="space-y-3 text-xs">
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>مبلغ کل کالاها</span>
          <span>{totalItemsPrice.toLocaleString()} تومان</span>
        </div>
        <div className="flex justify-between text-gray-500 dark:text-gray-400">
          <span>هزینه ارسال</span>
          <span>{shippingCost.toLocaleString()} تومان</span>
        </div>
        <div className="flex justify-between font-bold text-sm text-gray-800 dark:text-white pt-3 border-t border-gray-100 dark:border-white/5">
          <span>مبلغ قابل پرداخت</span>
          <span className="text-violet-600 dark:text-violet-400">{finalPrice.toLocaleString()} تومان</span>
        </div>
      </div>

      <button
        onClick={onPayment}
        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-violet-500/20 cursor-pointer text-xs"
      >
        پرداخت و ثبت نهایی سفارش
      </button>

      <Link href="/cart" className="block text-center text-[11px] text-gray-400 hover:text-violet-500 transition-colors pt-2">
        بازگشت به سبد خرید
      </Link>
    </div>
  );
}