import { Product, ProductSummary } from "@/types/product";
import { Category } from "@/types/category";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const ASSET_URL = process.env.NEXT_PUBLIC_ASSET_URL || "http://127.0.0.1:8000";

export async function getProducts(params?: { 
  sort?: string; 
  category?: string; 
  featured?: boolean;
  search?: string;
}): Promise<ProductSummary[]> {
  try {
    const queryString = params 
      ? "?" + new URLSearchParams(params as any).toString() 
      : "";

    const url = `${API_BASE_URL}/products${queryString}`;
    
    const res = await fetch(url, { 
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) return [];

    const json = await res.json();
    const products = json.data || json.products || [];

    return products.map((p: any) => ({
      ...p,
      img: p.img ? (p.img.startsWith('http') ? p.img : `${ASSET_URL}/storage/${p.img}`) : null
    }));
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return [];
  }
}

export async function getProduct(identifier: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${identifier}`, {
      cache: "no-store",
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.product || data.data || null; 
  } catch (error) {
    console.error("خطا در برقراری ارتباط با سرور:", error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories`, { 
      cache: "no-store",
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || data.data || [];
  } catch (error) {
    console.error("Fetch Categories Error:", error);
    return [];
  }
}

function buildCategoryTree(categories: any[]) {
  const map = new Map();
  const roots: any[] = [];

  categories.forEach(cat => {
    map.set(cat.id, { ...cat, children: [] });
  });

  categories.forEach(cat => {
    if (cat.parent_id !== null && cat.parent_id !== undefined) {
      const parent = map.get(cat.parent_id);
      if (parent) {
        parent.children.push(map.get(cat.id));
      }
    } else {
      roots.push(map.get(cat.id));
    }
  });

  return roots;
}

export async function getNestedCategories(): Promise<Category[]> {
  const flatCategories = await getCategories();
  return buildCategoryTree(flatCategories);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  
  const findInTree = (list: any[]): any => {
    for (const cat of list) {
      if (cat.slug === slug) return cat;
      if (cat.children && cat.children.length > 0) {
        const found = findInTree(cat.children);
        if (found) return found;
      }
    }
    return null;
  };

  const found = categories.find((cat: any) => cat.slug === slug);
  if (found) return found;

  const nested = await getNestedCategories();
  return findInTree(nested);
}