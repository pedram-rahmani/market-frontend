"use client";

import { useState, useRef } from "react";
import useClickOutside from "@/store/hooks/useClickOutside";

interface Option {
  value: string;
  label: string;
  searchKeys?: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  variant?: "advanced" | "simple";
  disabled?: boolean;
}

export default function Select({
  options,
  value,
  onChange,
  className = "",
  placeholder = "انتخاب کنید",
  variant = "advanced",
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const triggerRef = useRef<HTMLDivElement>(null!);
  const dropdownRef = useRef<HTMLDivElement>(null!);

  useClickOutside(() => {
    setIsOpen(false);
    setSearch("");
  }, [triggerRef, dropdownRef]);

  const selectedOption = options.find((opt) => opt.value === value);

  const toggleDropdown = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const filteredOptions =
    variant === "advanced"
      ? options.filter((opt) => {
          const searchSource = (
            opt.searchKeys ||
            opt.label ||
            ""
          ).toLowerCase();
          return searchSource.includes(search.toLowerCase());
        })
      : options;

  return (
    <div
      ref={triggerRef}
      className={`relative w-full select-none ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      <div
        onClick={toggleDropdown}
        className={`w-full h-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all text-sm 
        bg-white dark:bg-dark-600 dark:text-text-on-dark/80
        ${isOpen ? "border-violet-500/50 ring-1 ring-violet-500/20" : "border-gray-200 dark:border-white/10"}`}
      >
        {variant === "advanced" && isOpen ? (
          <input
            autoFocus
            className="text-sm text-gray-800 dark:text-gray-200 bg-transparent outline-none"
            placeholder="جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        ) : (
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        )}
        <svg
          viewBox="0 0 24 24"
          className={`size-4! m-1 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      {!disabled && isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1 right-0 z-50 w-full overflow-hidden rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-dark-800 shadow-2xl animate-fadeIn"
        >
          <div className="max-h-60 overflow-y-auto p-1.5 space-y-1 scrollbar mx-1">
            {filteredOptions.map((option, index) => {
              const isSelected = option.value === value;
              const isCustomOption = option.value === "custom";

              return (
                <div
                  key={`${option.value}-${index}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`px-3 py-2 text-sm cursor-pointer rounded-lg flex items-center justify-between transition-colors
                  ${
                    isSelected
                      ? "bg-violet-100 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                      : isCustomOption
                        ? "text-violet-600 font-bold hover:bg-violet-50 dark:text-violet-400"
                        : "hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  {option.label}
                  {isSelected && (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
