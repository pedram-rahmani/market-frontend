import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  cartId: string;
  product: any;
  color?: any;
  options?: Record<string, string>;
  warranty?: any;
  quantity: number;
  totalPrice: number;
}

interface CartState {
  items: CartItem[];
}

// خواندن اطلاعات ذخیره شده قبلی از localStorage در زمان لود اولیه
const loadInitialState = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const savedCart = localStorage.getItem("cart_items");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    return [];
  }
};

const initialState: CartState = {
  items: loadInitialState(),
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<{ product: any; color?: any; options?: any; warranty?: any; totalPrice: number }>) {
      const { product, color, options, warranty, totalPrice } = action.payload;
      
      const cartId = `${product.id}-${color?.id || 'no-color'}-${warranty?.id || 'no-warranty'}`;
      const existingItem = state.items.find(item => item.cartId === cartId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          cartId,
          product,
          color,
          options,
          warranty,
          quantity: 1,
          totalPrice,
        });
      }

      // ذخیره در localStorage بعد از تغییر
      if (typeof window !== "undefined") {
        localStorage.setItem("cart_items", JSON.stringify(state.items));
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.cartId !== action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem("cart_items", JSON.stringify(state.items));
      }
    },
    updateQuantity(state, action: PayloadAction<{ cartId: string; quantity: number }>) {
      const item = state.items.find(item => item.cartId === action.payload.cartId);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
        if (typeof window !== "undefined") {
          localStorage.setItem("cart_items", JSON.stringify(state.items));
        }
      }
    },
    clearCart(state) {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart_items");
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;