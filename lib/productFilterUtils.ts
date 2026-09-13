// Helper function to round up the price for the slider upper bound
export function roundUpPrice(price: number): number {
  if (price <= 0) return 10000000;
  const magnitude = Math.pow(10, Math.floor(Math.log10(price)));
  return Math.ceil(price / magnitude) * magnitude;
}

// Pure function to compute the effective/final price as a number
export const getEffectivePrice = (product: any): number => {
  const price = product.price ?? 0;
  if (!price || price <= 0) return 0;

  const discountValue = product.discountValue ?? product.discount ?? 0;
  const isPercent = product.isPercent ?? true;

  if (isPercent && discountValue === 100) {
    return 0; // Free item
  }

  const calculatedDiscountAmount = isPercent 
    ? price * (discountValue / 100) 
    : discountValue;

  const result = Math.max(0, price - calculatedDiscountAmount);
  return Math.floor(result);
};

interface ProcessProductsOptions {
  rawProducts: any[];
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

// Main processing function to handle filtering, pricing, and sorting in one place
export function processProductSearch({
  rawProducts = [],
  searchQuery = "",
  minPrice = 0,
  maxPrice = Infinity,
  sort = "newest",
}: ProcessProductsOptions) {
  
  // 1. Filter products by search query and effective price range simultaneously
  const filteredProducts = rawProducts.filter((product: any) => {
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const price = getEffectivePrice(product);
    const matchesPrice = price >= minPrice && price <= maxPrice;

    return matchesSearch && matchesPrice;
  });

  // 2. Compute dynamic maximum price and step based on effective prices of all raw products
  const maxProductPrice = rawProducts.length 
    ? Math.max(...rawProducts.map((p: any) => getEffectivePrice(p))) 
    : 10000000;

  const dynamicMaxPrice = roundUpPrice(maxProductPrice);
  const dynamicStep = Math.max(10000, Math.pow(10, Math.floor(Math.log10(dynamicMaxPrice)) - 2));

  // 3. Apply sorting based on effective prices or other metrics
  const initialProducts = [...filteredProducts].sort((a: any, b: any) => {
    if (sort === "price_asc") {
      return getEffectivePrice(a) - getEffectivePrice(b);
    }
    if (sort === "price_desc") {
      return getEffectivePrice(b) - getEffectivePrice(a);
    }
    if (sort === "popular") {
      return (b.rating ?? b.likes ?? 0) - (a.rating ?? a.likes ?? 0);
    }
    return (b.id ?? 0) - (a.id ?? 0);
  });

  return {
    initialProducts,
    dynamicMaxPrice,
    dynamicStep,
  };
}