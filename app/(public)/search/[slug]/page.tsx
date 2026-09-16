import { getProducts } from "@/services/product";
import { getCategoryBySlug } from "@/services/category";
import ProductResults from "@/components/product/ProductResults/ProductResults";
import Breadcrumb from "@/components/ui/BreadCrumb/BreadCrumb";
import ProductSearchContent from "./ProductSearchContent";
import { extractFilterGroups } from "@/lib/filterUtils";
import { processProductSearch } from "@/lib/productFilterUtils";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const sort = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "newest";
  const minPrice = resolvedSearchParams.min_price ? Number(resolvedSearchParams.min_price) : 0;
  const maxPrice = resolvedSearchParams.max_price ? Number(resolvedSearchParams.max_price) : Infinity;

  const decodedSlug = decodeURIComponent(slug);
  const categoryFromUrl = decodedSlug.replace("category-", "").trim();

  const categoryData = await getCategoryBySlug(categoryFromUrl);
  const categoryName = categoryData
    ? categoryData.name
    : decodedSlug.replace("category-", "").replace(/-/g, " ").trim();

  const rawProducts = await getProducts({ category: categoryFromUrl });
  const filterGroups = extractFilterGroups(rawProducts || []);

  // Process filtering, dynamic bounds, and sorting cleanly
  const { initialProducts, dynamicMaxPrice, dynamicStep } = processProductSearch({
    rawProducts: rawProducts || [],
    minPrice,
    maxPrice,
    sort,
  });

  const breadcrumbLinks = [
    { id: "search-root", title: "جستجو", to: "/search" },
    { id: "current-category", title: categoryName, to: `/search/${slug}` },
  ];

  return (
    <>
      <Breadcrumb links={breadcrumbLinks} />

      <section className="mt-6 w-full bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-white/10 py-8 px-5 rounded-3xl shadow-sm transition-all">
        <ProductSearchContent 
          filterGroups={filterGroups} 
          absoluteMax={dynamicMaxPrice}
          step={dynamicStep}
        >
          <ProductResults
            key={JSON.stringify(initialProducts)}
            initialProducts={initialProducts}
            categorySlug={categoryFromUrl}
            cleanTitle={categoryName}
          />
        </ProductSearchContent>
      </section>
    </>
  );
}