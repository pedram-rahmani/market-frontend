"use client";

import { useState, ReactNode } from "react";

interface FilterSectionProps {
  title: string;
  children: ReactNode;
  isOpenDefault?: boolean;
}

export default function FilterSection({
  title,
  children,
  isOpenDefault = true,
}: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);

  return (
    <div className="border-b border-gray-100 dark:border-white/10 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-right cursor-pointer"
        type="button"
      >
        <span className="font-bold text-sm text-text-on-light dark:text-text-on-dark">
          {title}
        </span>
        <svg
          viewBox="0 0 24 24"
          className={`size-4! text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-3 pr-1 text-sm">{children}</div>
      </div>
    </div>
  );
}