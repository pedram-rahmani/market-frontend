"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import axiosInstance from "@/lib/axiosInstance";
import SpinnerLoader from "@/components/ui/SpinnerLoader/SpinnerLoader"; 

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
      
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/me");
        const userData = res.data.user || res.data.data || res.data; 

        if (userData) {
          dispatch(setUser({ user: userData, token: storedToken }));
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#16161a]">
        <SpinnerLoader />
      </div>
    );
  }

  return <>{children}</>;
}