import GeneralSearchContent from "./GeneralSearchContent";
import Breadcrumb from "@/components/ui/BreadCrumb/BreadCrumb";
import { getProducts } from "@/services/product";
import { extractFilterGroups } from "@/lib/filterUtils";
import { processProductSearch } from "@/lib/productFilterUtils";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GeneralSearchPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  const searchQuery =
    (typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : "") ||
    (typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "");

  const sort = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "newest";
  const minPrice = resolvedSearchParams.min_price ? Number(resolvedSearchParams.min_price) : 0;
  const maxPrice = resolvedSearchParams.max_price ? Number(resolvedSearchParams.max_price) : Infinity;

  const rawProducts = await getProducts({ search: searchQuery });
  const filterGroups = extractFilterGroups(rawProducts || []);

  // Process filtering, dynamic bounds, and sorting cleanly
  const { initialProducts, dynamicMaxPrice, dynamicStep } = processProductSearch({
    rawProducts: rawProducts || [],
    searchQuery,
    minPrice,
    maxPrice,
    sort,
  });

  const breadcrumbLinks = [
    {
      id: "search-root",
      title: searchQuery ? `جستجو: ${searchQuery}` : "جستجو",
      to: "/search",
    },
  ];

  return (
    <>
      <Breadcrumb links={breadcrumbLinks} />
      <GeneralSearchContent 
        initialProducts={initialProducts} 
        searchQuery={searchQuery}
        filterGroups={filterGroups} 
        absoluteMax={dynamicMaxPrice}
        step={dynamicStep}
      />
    </>
  );
}