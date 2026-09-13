"use client";
import { createPortal } from "react-dom";
import useLockBodyScroll from "@/store/hooks/useLockBodyScroll";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  showFooter?: boolean;
}

export default function ProductModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  isLoading = false,
  showFooter = true 
}: ModalProps) {
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark-800/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-light dark:bg-dark-900 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-2">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">✕</button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto scrollbar p-6 pt-2 mx-1">
          {children}
        </div>

        {/* Sticky Footer */}
        {showFooter && (
          <div className="p-6 pt-2 border-t border-gray-100 dark:border-dark-800 bg-light dark:bg-dark-900">
            <button 
              type="submit" 
              form="product-form"
              disabled={isLoading}
              className="w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition"
            >
              ذخیره اطلاعات
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}