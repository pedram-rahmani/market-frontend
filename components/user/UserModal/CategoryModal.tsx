"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useLockBodyScroll from "@/store/hooks/useLockBodyScroll";
import SpinnerLoader from "@/components/ui/SpinnerLoader/SpinnerLoader";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  formId?: string;
  submitButtonText?: string;
  showFooterButton?: boolean;
  isLoading?: boolean;
}

export default function CategoryModal({
  isOpen,
  onClose,
  title,
  children,
  formId = "category-form",
  submitButtonText = "ذخیره دسته‌بندی",
  showFooterButton = true,
  isLoading = false,
}: CategoryModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLockBodyScroll(isOpen);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div
        className="absolute inset-0 bg-dark-800/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-light dark:bg-dark-900 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col text-right">
        <div className="flex justify-between items-center p-6 pb-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="size-5!">
              <path d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto scrollbar p-6 pt-2">{children}</div>

        {showFooterButton && (
          <div className="p-6 pt-2 border-t border-gray-100 dark:border-dark-800 bg-light dark:bg-dark-900">
            <button
              type="submit"
              form={formId}
              disabled={isLoading}
              className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <SpinnerLoader variant="simple" className="size-5!" />
                  <span>در حال ذخیره‌سازی اطلاعات...</span>
                </>
              ) : (
                submitButtonText
              )}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
