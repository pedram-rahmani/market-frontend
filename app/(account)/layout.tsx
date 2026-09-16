"use client";

import React, { useState, useEffect } from "react";
import SideBar from "@/components/user/UserAccount/SideBar";
import Header from "@/components/user/UserAccount/Header";
import AuthGuard from "@/components/guards/AuthGuard";
import MobileNavbar from "@/components/layout/mobile/Footer/Footer";
import { useAppDispatch, useAppSelector } from "@/store/hooks/storeHooks";
import { fetchCategories } from "@/store/slices/categorySlice";

interface UserAccountLayoutProps {
  children: React.ReactNode;
}

export default function UserAccountLayout({ children }: UserAccountLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 pb-20 md:pb-0">
      {/* سایدبار: از سایز md به بالا (آیپد و دسکتاپ) به صورت پیش‌فرض ثابت و نمایش داده می‌شود */}
      <div className={`fixed inset-y-0 right-0 z-50 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* ناحیه محتوا و هدر: از سایز md به بالا به اندازه سایدبار (pr-67) فاصله می‌گیرد */}
      <div className="md:pr-67 min-h-screen flex flex-col">
        <Header onOpenSidebar={() => setIsSidebarOpen(true)} />

        <main className="max-w-333 w-full px-4 md:px-8 pb-5 md:pb-8 mx-auto flex-1">
          <AuthGuard>
            {children}
          </AuthGuard>
        </main>
      </div>

      {/* نویبار پایین فقط در موبایل (کوچکتر از md) نمایش داده می‌شود */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40">
        <MobileNavbar categories={categories} />
      </div>
    </div>
  );
}