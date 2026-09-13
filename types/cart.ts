export interface CartItemType {
  id: string | number;
  title: string;
  price: number;
  discount?: number | null;
  quantity: number;
  image: string;
  [key: string]: any;
}

export interface CartItemProps extends CartItemType {
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export interface CartSummaryProps {
  totalPrice: number;
  totalDiscount?: number;         // product discount
  appliedDiscountAmount?: number; // discount code
  totalQuantity?: number;
  onCheckout: () => void;
  onApplyDiscount?: (discountAmount: number, couponId: number, code: string) => void;
  [key: string]: any;
}