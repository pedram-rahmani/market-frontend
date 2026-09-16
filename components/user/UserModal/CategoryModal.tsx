"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import useLockBodyScroll from "@/store/hooks/useLockBodyScroll";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  formId?: string;
  submitButtonText?: string;
  showFooterButton?: boolean;
}

export default function CategoryModal({
  isOpen,
  onClose,
  title,
  children,
  formId = "category-form",
  submitButtonText = "ذخیره دسته‌بندی",
  showFooterButton = true,
}: CategoryModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLockBodyScroll(isOpen);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-dark-800/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-light dark:bg-dark-900 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col text-right">
        <div className="flex justify-between items-center p-6 pb-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 cursor-pointer">✕</button>
        </div>
        <div className="overflow-y-auto scrollbar p-6 pt-2">{children}</div>
        
        {showFooterButton && (
          <div className="p-6 pt-2 border-t border-gray-100 dark:border-dark-800 bg-light dark:bg-dark-900">
            <button type="submit" form={formId} className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition cursor-pointer">
              {submitButtonText}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}