export interface Category {
  id: number;
  slug: string;
  name: string;
  parent_id: number | null;
  level: number;
  path?: string;
  created_at?: string;
  updated_at?: string;
  children?: Category[];
}