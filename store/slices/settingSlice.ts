import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

interface SettingItem {
  id: number;
  key: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

interface SettingState {
  settings: SettingItem[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingState = {
  settings: null,
  loading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk(
  "setting/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/settings");
      
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "خطا در دریافت تنظیمات سیستم"
      );
    }
  }
);

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setLocalSettings: (state, action: PayloadAction<SettingItem[]>) => {
      state.settings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action: PayloadAction<SettingItem[]>) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLocalSettings } = settingSlice.actions;
export default settingSlice.reducer;