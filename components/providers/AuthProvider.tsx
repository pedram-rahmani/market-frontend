"use client";

import { useEffect, useState } from "react";
import { store } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import axiosInstance from "@/lib/axiosInstance";
import SpinnerLoader from "@/components/ui/SpinnerLoader/SpinnerLoader"; 

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... منطقِ چک کردن لاگین (همون قبلی عالیه)
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const res = await axiosInstance.get("/me");
        store.dispatch(setUser({ user: res.data, token: storedToken }));
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#16161a]">
        <SpinnerLoader />
      </div>
    );
  }

  return <>{children}</>;
}