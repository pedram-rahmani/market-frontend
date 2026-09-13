interface DiscountResult {
  finalPrice: string;
  discountAmount: number;
  isFree: boolean;
}

export default function useDiscount(
  price: number, 
  discountValue: number, 
  isPercent: boolean = true
): DiscountResult {
  if (!price || price <= 0) return { finalPrice: "۰", discountAmount: 0, isFree: false };

  const discount = discountValue ?? 0;

  // if discount =100
  if (isPercent && discount === 100) {
    return {
      finalPrice: "رایگان!",
      discountAmount: price,
      isFree: true
    };
  }

  // discount price 
  const calculatedDiscountAmount = isPercent 
    ? price * (discount / 100) 
    : discount;

  const result = Math.max(0, price - calculatedDiscountAmount);

  return {
    finalPrice: Math.floor(result).toLocaleString("fa-IR"),
    discountAmount: Math.floor(calculatedDiscountAmount),
    isFree: false
  };
}