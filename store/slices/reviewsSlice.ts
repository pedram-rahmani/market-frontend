import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axiosInstance';

export const fetchReviews = createAsyncThunk(
  'reviews/fetch',
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/${productId}/reviews`);
      const res = response.data;

      if (Array.isArray(res)) return res;
      if (res?.data && Array.isArray(res.data)) return res.data;

      return [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'خطا در دریافت نظرات');
    }
  }
);

interface ReviewsState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  items: [],
  loading: false,
  error: null,
};

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default reviewsSlice.reducer;