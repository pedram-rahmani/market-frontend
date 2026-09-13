"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface SimplePopupProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type: "success" | "error";
}

export default function SimplePopup({ isOpen, onClose, message, type }: SimplePopupProps) {
  const [width, setWidth] = useState(100);

  useEffect(() => {
    if (!isOpen) {
      setWidth(100);
      return;
    }

    const duration = 3000; 
    const intervalTime = 20;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setWidth((prev) => (prev - step <= 0 ? 0 : prev - step));
    }, intervalTime);

    const timeout = setTimeout(onClose, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-99999 flex items-center justify-center p-4">

      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onClose} />
      
      {/* modal */}
      <div className={`relative w-full max-w-sm bg-white dark:bg-neutral-800 rounded-xl shadow-2xl border ${type === 'success' ? 'border-green-500' : 'border-red-500'} overflow-hidden animate-zoomIn`}>
        {/* progressBar */}
        <div 
          className={`h-1.5 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} 
          style={{ width: `${width}%` }} 
        />
        
        <div className="p-5 flex items-center gap-3">
          <span className="text-2xl">{type === 'success' ? "✅" : "❌"}</span>
          <p className="text-sm text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}