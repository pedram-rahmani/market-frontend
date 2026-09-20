"use client";

import { useState, useEffect } from "react";

interface CheckboxProps {
  id: string;
  label: string;
  required?: boolean;
  checked?: boolean;
  activeColor?: string;
  onInputHandler: (id: string, checked: boolean, isValid: boolean) => void;
}

export default function Checkbox({
  id,
  label,
  required = false,
  checked: externalChecked = false,
  onInputHandler,
  activeColor = "bg-green-500 border-green-500",
}: CheckboxProps) {
  const [checked, setChecked] = useState(Boolean(externalChecked));

  // هماهنگ‌سازی با تغییرات از بیرون (مثل لود شدن اطلاعات ویرایش)
  useEffect(() => {
    setChecked(Boolean(externalChecked));
  }, [externalChecked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    const newIsValid = required ? newChecked : true;

    setChecked(newChecked);

    // گزارش به والد فقط هنگام تغییر توسط کاربر
    onInputHandler(id, newChecked, newIsValid);
  };

  return (
    <label className="flex items-center gap-2 cursor-pointer group select-none">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={handleChange}
      />
      <div
        className={`w-5 h-5 border-2 border-custom-gray-300 dark:border-white/20 rounded-full flex items-center justify-center transition-all shadow-sm ${
          checked ? activeColor : "bg-transparent"
        }`}
      >
        {checked && (
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ strokeWidth: "3px" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      <span>{label}</span>
    </label>
  );
}