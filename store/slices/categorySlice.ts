import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { Category } from "@/types/category";

// تابع کمکی برای تبدیل آرایه تخت به درختی
const buildCategoryTree = (categories: Category[]): any[] => {
  const map = new Map();
  const roots: any[] = [];

  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });

  categories.forEach((cat) => {
    if (cat.parent_id === null) {
      roots.push(map.get(cat.id));
    } else {
      const parent = map.get(cat.parent_id);
      if (parent) {
        parent.children.push(map.get(cat.id));
      }
    }
  });

  return roots;
};

interface CategoryState {
  categories: any[]; // حالا شامل ساختار درختی children است
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const { data } = await axiosInstance.get("/categories");
    const rawList = Array.isArray(data) ? data : data.data || [];
    // تبدیل خودکار به ساختار درختی قبل از ذخیره در استور
    return buildCategoryTree(rawList);
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "خطا در دریافت دسته‌بندی‌ها";
      });
  },
});

export default categorySlice.reducer;