import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

// تعریفِ ساختارِ اولیه
interface WalletState {
  balance: number | null;
  status: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: WalletState = {
  balance: null,
  status: null,
  loading: false,
  error: null,
};

// اکشن برای گرفتنِ موجودی از سرور
export const fetchWallet = createAsyncThunk("wallet/fetchWallet", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/wallet");
    return response.data; // انتظار داریم دیتای {balance: 12000, status: 'active'} برگردد
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "خطا در دریافت موجودی");
  }
});

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    // update balance action (manual update)
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.status = action.payload.status;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateBalance } = walletSlice.actions;
export default walletSlice.reducer;