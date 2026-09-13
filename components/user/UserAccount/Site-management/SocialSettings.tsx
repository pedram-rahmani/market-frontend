"use client";

import { useState } from "react";
import Select from "@/components/ui/Form/Select";

const BASE_SOCIAL_OPTIONS = [
  { value: "instagram", label: "اینستاگرام" },
  { value: "telegram", label: "تلگرام" },
  { value: "whatsapp", label: "واتس‌اپ" },
  { value: "youtube", label: "یوتیوب" },
  { value: "twitter", label: "توییتر (X)" },
  { value: "linkedin", label: "لینکدین" },
  { value: "facebook", label: "فیس‌بوک" },
];

interface SocialItem {
  name: string;
  url: string;
}

interface SocialSettingsProps {
  items: SocialItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, key: keyof SocialItem, value: string) => void;
  disabled?: boolean;
}

export default function SocialSettings({
  items,
  onAdd,
  onRemove,
  onUpdate,
  disabled,
}: SocialSettingsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <div className="md:col-span-2 p-6 rounded-2xl border border-custom-gray-200 dark:border-custom-gray-400/20 bg-light/50 dark:bg-dark-700/30 space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-custom-gray-200 dark:border-custom-gray-400/20">
        <h3 className="text-sm font-bold dark:text-white">شبکه‌های اجتماعی</h3>
        {!disabled && (
          <button
            type="button"
            onClick={onAdd}
            className="text-xs px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 font-medium transition-all shadow-sm active:scale-95"
          >
            + افزودن جدید
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-center py-4 text-gray-400 dark:text-gray-500">هیچ شبکه اجتماعی ثبت نشده است.</p>
      ) : (
        <div className="space-y-3">
          {items.map((social, index) => {
            const isKnown = BASE_SOCIAL_OPTIONS.some((o) => o.value === social.name);
            const dynamicOptions = [
              { value: "custom", label: "+ نوع جدید..." },
              ...BASE_SOCIAL_OPTIONS,
              ...(!isKnown && social.name !== "" ? [{ value: social.name, label: social.name }] : []),
            ];

            return (
              <div key={index} className="flex gap-3 items-center group animate-fadeIn">
                {editingIndex === index ? (
                  <input
                    disabled={disabled}
                    className="input-info w-44! border-violet-500 ring-2 ring-violet-500/20"
                    autoFocus
                    placeholder="نام شبکه..."
                    value={social.name}
                    onChange={(e) => onUpdate(index, "name", e.target.value)}
                    onBlur={() => setEditingIndex(null)}
                  />
                ) : (
                  <Select
                    disabled={disabled}
                    options={dynamicOptions}
                    value={social.name || ""}
                    onChange={(val) => {
                      if (val === "custom") setEditingIndex(index);
                      else onUpdate(index, "name", val);
                    }}
                    placeholder="انتخاب شبکه"
                    className="w-44!"
                  />
                )}

                <input
                  disabled={disabled}
                  type="url"
                  value={social.url}
                  onChange={(e) => onUpdate(index, "url", e.target.value)}
                  placeholder="https://..."
                  className="input-info flex-1 text-left"
                />

                {!disabled && (
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm"
                  >
                    حذف
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}