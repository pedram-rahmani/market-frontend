"use client";

import Image from "next/image";
import React, { useRef } from "react";
import BaseInput from "@/components/ui/Form/BaseInput";
import { getImagePath } from "@/lib/utils";

interface LogoUploadProps {
  preview: string | null;
  faviconPreview?: string | null;
  onChange: (file: File) => void;
  onFaviconChange?: (file: File) => void;
  siteName: string;
  onSiteNameChange: (val: string) => void;
  disabled?: boolean;
}

export default function LogoUpload({
  preview,
  faviconPreview = null,
  onChange,
  onFaviconChange,
  siteName,
  onSiteNameChange,
  disabled,
}: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

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
    if (preview.startsWith("blob:")) return preview;
    
    return getImagePath(preview);
  };

  const getFaviconUrl = () => {
    if (!faviconPreview) return null;
    return faviconPreview.startsWith("blob:") ? faviconPreview : getImagePath(faviconPreview);
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || !onFaviconChange) return;
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/x-icon", "image/vnd.microsoft.icon", "image/jpeg", "image/webp"].includes(file.type)) {
      alert("فرمت favicon باید PNG، ICO، JPG یا WEBP باشد.");
      return;
    }
    onFaviconChange(file);
  };

  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-10 p-4 rounded-2xl border border-custom-gray-200 dark:border-custom-gray-400/20 bg-light/50 dark:bg-dark-700/30 ${disabled ? "opacity-70" : ""}`}
    >
      <div className="flex flex-row gap-4 items-center">
        <div className="relative size-24 bg-custom-gray-100/40 dark:bg-dark-800/30 rounded-xl overflow-hidden flex items-center justify-center border border-custom-gray-400/40 shadow-sm shadow-ui-blue-400/40 dark:shadow-ui-purple shrink-0">
          {preview ? (
            <Image
              src={getImageUrl() || ""}
              alt="Logo"
              fill
              sizes="96px"
              unoptimized
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
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg border border-custom-gray-400/40 bg-white flex items-center justify-center overflow-hidden cursor-default">
            {getFaviconUrl() ? (
              <img src={getFaviconUrl() || ""} alt="Favicon" className="size-7 object-contain" />
            ) : (
              <span className="text-[9px] text-gray-400">favicon</span>
            )}
          </div>
          {!disabled && (
            <>
              <input ref={faviconInputRef} type="file" accept=".ico,.png,.jpg,.jpeg,.webp,image/*" onChange={handleFaviconChange} className="hidden" />
              <button type="button" onClick={() => faviconInputRef.current?.click()} className="py-2 px-3 rounded-xl text-xs font-semibold bg-cyan-100 text-cyan-700 hover:bg-cyan-200 transition-colors">
                تغییر آیکون تب
              </button>
            </>
          )}
          <span className="text-[10px] text-gray-400">تصویر کوچک کنار عنوان تب مرورگر</span>
        </div>
      </div>
    </div>
  );
}