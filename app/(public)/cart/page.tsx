import CartSection from "@/components/cart/CartSection";

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        سبد خرید شما
      </h1>
      <CartSection />
    </div>
  );
}