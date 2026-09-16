export interface OrderItem {
  id: string | number;
  image?: string;
  title?: string;
  price?: number | string;
}

export interface Order {
  id: string | number;
  created_at: string;
  order_code: string;
  total_price: number | string;
  discount?: number | string;
  tracking_code?: string;
  items?: OrderItem[];
  [key: string]: any;
}