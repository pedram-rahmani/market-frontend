export type WarrantyPivot = {
  price: number;
  is_default: boolean;
};

export type Warranty = {
  id: number;
  title: string;
  duration_months: number | null;
  description: string | null;
  pivot?: WarrantyPivot;
};

export type ProductIntroductionType = "paragraph" | "heading" | "list";

export type ProductIntroduction = {
  id: number;
  product_id: number;
  title: string | null;
  content: string;
  type: ProductIntroductionType;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type ProductOption = {
  id?: number | string;
  title: string;
  items: string[];
};

export type SpecificationItem = {
  id: string | number;
  value: string;
  feature?: {
    title: string;
  };
};

// تایپ رنگ محصول
export type ProductColor = {
  id?: number | string;
  name: string;
  hex: string;
};

// تایپ سایز محصول
export type ProductSize = {
  id: number | string;
  name: string;
};

export type ProductSummary = {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  discount: number | null;
  rate: number | null;
  description: string | null;
  img: string | null;
  category_id?: number;
  warranties?: Warranty[];
  options?: ProductOption[];
  specifications?: SpecificationItem[];
  colors?: ProductColor[];
  sizes?: ProductSize[];
  gallery?: string[];
};

export type PaginationOptions = {
  page?: number;
  limit?: number;
};

export interface Product {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  discount?: number | null;
  rate?: number | null;
  description?: string | null;
  img?: string | null;
  category_id?: number;
  created_at?: string;
  updated_at?: string;
  warranties?: Warranty[];
  introductions?: ProductIntroduction[];
  options?: ProductOption[];
  specifications?: SpecificationItem[];
  colors?: ProductColor[];
  sizes?: ProductSize[];
  gallery?: string[];
  [key: string]: any;
}