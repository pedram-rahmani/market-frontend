"use client";

import { useState } from "react";
import Select from "@/components/ui/Form/Select";

const BASE_CONTACT_OPTIONS = [
  { value: "phone", label: "تلفن ثابت" },
  { value: "mobile", label: "موبایل" },
  { value: "telegram", label: "تلگرام" },
  { value: "whatsapp", label: "واتس‌اپ" },
  { value: "instagram", label: "اینستاگرام" },
  { value: "email", label: "ایمیل" },
  { value: "youtube", label: "یوتیوب" },
];

interface ContactItem {
  label: string;
  value: string;
}

interface ContactSettingsProps {
  items: ContactItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, key: keyof ContactItem, value: string) => void;
  disabled?: boolean;
}

export default function ContactSettings({
  items,
  onAdd,
  onRemove,
  onUpdate,
  disabled,
}: ContactSettingsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <div className="md:col-span-2 p-6 rounded-2xl border border-custom-gray-200 dark:border-custom-gray-400/20 bg-light/50 dark:bg-dark-700/30 space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-custom-gray-200 dark:border-custom-gray-400/20">
        <h3 className="text-sm font-bold">راه‌های ارتباطی</h3>
        {!disabled && (
          <button
            type="button"
            onClick={onAdd}
            className="text-xs px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-all active:scale-95"
          >
            + افزودن جدید
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-center py-4 text-gray-400">موردی ثبت نشده است.</p>
      ) : (
        <div className="space-y-3">
          {items.map((contact, index) => {
            const isKnown = BASE_CONTACT_OPTIONS.some((o) => o.value === contact.label);
            const dynamicOptions = [
              { value: "custom", label: "+ نوع جدید..." },
              ...BASE_CONTACT_OPTIONS,
              ...(contact.label && !isKnown ? [{ value: contact.label, label: contact.label }] : []),
            ];

            return (
              <div key={index} className="flex gap-3 items-center animate-fadeIn">
                {editingIndex === index ? (
                  <input
                    disabled={disabled}
                    className="input-info w-44! border-violet-500 ring-2 ring-violet-500/20"
                    autoFocus
                    placeholder="نام را بنویسید..."
                    value={contact.label}
                    onChange={(e) => onUpdate(index, "label", e.target.value)}
                    onBlur={() => setEditingIndex(null)}
                  />
                ) : (
                  <Select
                    disabled={disabled}
                    options={dynamicOptions}
                    value={contact.label || ""}
                    onChange={(val) => {
                      if (val === "custom") setEditingIndex(index);
                      else onUpdate(index, "label", val);
                    }}
                    placeholder="انتخاب نوع"
                    className="w-44!"
                  />
                )}

                <input
                  disabled={disabled}
                  type="text"
                  value={contact.value}
                  onChange={(e) => onUpdate(index, "value", e.target.value)}
                  placeholder="مقدار (شماره یا آیدی)..."
                  className="input-info flex-1"
                />

                {!disabled && (
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-sm"
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