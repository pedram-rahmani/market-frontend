"use client";

import React, { useRef } from "react";
import BaseInput from "@/components/ui/Form/BaseInput";

interface LogoUploadProps {
  preview: string | null;
  onChange: (file: File) => void;
  siteName: string;
  onSiteNameChange: (val: string) => void;
  disabled?: boolean;
}

export default function LogoUpload({
  preview,
  onChange,
  siteName,
  onSiteNameChange,
  disabled,
}: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      alert("فرمت فایل نامعتبر است!");
      return;
    }
    onChange(file);
  };

  const getImageUrl = () => {
    if (!preview) return null;
    if (preview.startsWith("blob:") || preview.startsWith("http"))
      return preview;
    return `http://127.0.0.1:8000/storage/${preview}`;
  };

  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-10 p-4 rounded-2xl border border-custom-gray-200 dark:border-custom-gray-400/20 bg-light/50 dark:bg-dark-700/30 ${disabled ? "opacity-70" : ""}`}
    >
      <div className="flex flex-row gap-4 items-center">
        <div className="size-24 bg-custom-gray-100/40 dark:bg-dark-800/30 rounded-xl overflow-hidden flex items-center justify-center border border-custom-gray-400/40 shadow-sm shadow-ui-blue-400/40 dark:shadow-ui-purple shrink-0">
          {preview ? (
            <img
              src={getImageUrl() || ""}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">بدون لوگو</span>
          )}
        </div>

        {!disabled && (
          <>
            <input
              ref={inputRef}
              type="file"
              id="logo-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="logo-upload"
              className="inline-block cursor-pointer py-2 px-4 rounded-xl text-sm font-semibold bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors shadow"
            >
              تغییر لوگو
            </label>
          </>
        )}
      </div>

      <div className="flex-1 w-full space-y-4">
        <BaseInput
          disabled={disabled}
          label="نام سایت"
          type="text"
          value={siteName}
          onChange={(e) => onSiteNameChange(e.target.value)}
          className={disabled ? " bg-gray-50/50" : ""}
        />
      </div>
    </div>
  );
}