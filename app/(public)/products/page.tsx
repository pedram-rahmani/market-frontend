import ProductBox from "@/components/product/ProductBox/ProductBox";
import Breadcrumb from "@/components/ui/BreadCrumb/BreadCrumb";
import ProductsHeader from "@/components/product/ProductsHeader";
import { getProducts } from "@/services/product";
import { ProductSummary } from "@/types/product";

export const metadata = {
  title: "همه محصولات | فروشگاه",
  description: "مشاهده و بررسی تمامی محصولات فروشگاه",
};

interface Props {
  searchParams: Promise<{ sort?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { sort = "newest" } = await searchParams;
  let products: ProductSummary[] = await getProducts();

  // محاسبه قیمت نهایی با ایمن‌سازی تایپ‌ها
  const getFinalPrice = (p: ProductSummary): number => {
    const price = Number(p.price) || 0;
    const disc = Number(p.discount) || 0;
    return price * (1 - disc / 100);
  };

  // اعمال مرتب‌سازی بر اساس ستون‌های دیتابیس
  products = [...products].sort((a, b) => {
    if (sort === "cheapest") {
      return getFinalPrice(a) - getFinalPrice(b);
    }
    if (sort === "expensive") {
      return getFinalPrice(b) - getFinalPrice(a);
    }
    if (sort === "popular") {
      const rateA = Number(a.rate) || 0;
      const rateB = Number(b.rate) || 0;
      return rateB - rateA;
    }
    if (sort === "most_discount") {
      // مرتب‌سازی بر اساس بیشترین درصد تخفیف
      const discA = Number(a.discount) || 0;
      const discB = Number(b.discount) || 0;
      return discB - discA;
    }
    
    // حالت پیش‌فرض: جدیدترین (بر اساس ID عددی)
    const idA = Number(a.id) || 0;
    const idB = Number(b.id) || 0;
    return idB - idA;
  });

  const breadcrumbLinks = [{ id: 1, title: "همه محصولات", to: "/products" }];

  return (
    <div className="space-y-6 py-4">
      <Breadcrumb links={breadcrumbLinks} />
      <ProductsHeader totalCount={products.length} />

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-start">
          {products.map((product) => (
            <div key={product.id} className="w-full">
              <ProductBox productInfos={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-custom-gray-100 dark:bg-ui-blue-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-dark-600">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            هیچ محصولی یافت نشد.
          </p>
        </div>
      )}
    </div>
  );
}