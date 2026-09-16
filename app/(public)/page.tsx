import Link from "next/link";
import ProductBox from "@/components/product/ProductBox/ProductBox";
import { getProducts } from "@/services/product";
import { ProductSummary } from "@/types/product";

interface ProductSectionProps {
  title: string;
  products: ProductSummary[];
  badgeColor?: string;
}

const ProductSection = ({ title, products }: ProductSectionProps) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-3">
      <h2 className="text-xl font-bold text-dark-900 dark:text-white flex items-center gap-x-2">
        <span className="w-2 h-6 bg-ui-blue-600 rounded-full inline-block" />
        {title}
      </h2>
      <Link href="/products" className="text-sm text-ui-blue-500 hover:underline">
        مشاهده همه ←
      </Link>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-start">
      {products.map((product) => (
        <div key={product.id} className="w-full">
          <ProductBox productInfos={product} />
        </div>
      ))}
    </div>
  </section>
);

export default async function Page() {
  const allProducts: ProductSummary[] = await getProducts();

  const hotProducts = allProducts.filter((p) => (p.discount ?? 0) > 0);
  const featuredProducts = allProducts.slice(0, 4);

  return (
    <div className="space-y-12 pb-12 pt-4">
      {/* 1. Hero Banner / Banners Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-linear-to-r from-ui-blue-700 to-indigo-900 rounded-2xl p-6 text-white flex flex-col justify-between min-h-50 shadow-lg">
          <div className="space-y-2">
            <span className="bg-white/20 text-xs px-3 py-1 rounded-full backdrop-blur-md">پیشنهاد ویژه</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">جشنواره تخفیفات شگفت‌انگیز</h1>
            <p className="text-sm text-gray-200">بهترین محصولات با بالاترین کیفیت و ضمانت بازگشت</p>
          </div>
          <div>
            <Link href="/search" className="inline-block bg-white text-ui-blue-900 font-bold px-5 py-2.5 rounded-xl text-sm shadow hover:bg-gray-100 transition">
              بررسی محصولات
            </Link>
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-800 to-purple-950 rounded-2xl p-6 text-white flex flex-col justify-between min-h-50 shadow-lg">
          <div>
            <span className="text-xs text-purple-300">ارسال سریع</span>
            <h3 className="text-xl font-bold mt-1">تضمین اصالت کالا</h3>
          </div>
          <p className="text-xs opacity-80">تحویل در سریع‌ترین زمان ممکن به سراسر کشور</p>
        </div>
      </section>

      {/* products (discounted) */}
      {hotProducts.length > 0 && (
        <ProductSection title="پیشنهادات شگفت‌انگیز" products={hotProducts} />
      )}

      {/* banner */}
      <section className="bg-custom-gray-100 dark:bg-ui-blue-800 border border-gray-200 dark:border-dark-600 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-dark-900 dark:text-white">به دنبال محصول خاصی هستید؟</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">از بخش جستجوی پیشرفته برای یافتن کالای مورد نظر استفاده کنید.</p>
        </div>
        <Link href="/search" className="bg-ui-blue-600 hover:bg-ui-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition shrink-0">
          جستجوی پیشرفته
        </Link>
      </section>

      {/* products (favored) */}
      <ProductSection title="منتخب تازه‌ترین محصولات" products={featuredProducts} />
    </div>
  );
}