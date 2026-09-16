"use client";

import { useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Category } from "@/types/category";
import Select from "@/components/ui/Form/Select";
import useForm from "@/store/hooks/useForm";

export default function CategoryForm({
  category,
  onSave,
  allCategories,
  defaultParentId,
}: {
  category: Category | null;
  onSave: () => void;
  allCategories: Category[];
  defaultParentId?: number | null;
}) {
  const [formState, onInputHandler, setFormData] = useForm({
    name: { value: category?.name || "", isValid: Boolean(category?.name) },
    slug: { value: category?.slug || "", isValid: true },
    parent_id: { 
      value: category?.parent_id ? String(category.parent_id) : (defaultParentId ? String(defaultParentId) : ""), 
      isValid: true 
    },
  });

  useEffect(() => {
    setFormData({
      name: { value: category?.name || "", isValid: Boolean(category?.name) },
      slug: { value: category?.slug || "", isValid: true },
      parent_id: { 
        value: category?.parent_id ? String(category.parent_id) : (defaultParentId ? String(defaultParentId) : ""), 
        isValid: true 
      },
    });
  }, [category, defaultParentId, setFormData]);

  const handleNameChange = (val: string) => {
    const newSlug = val
      .trim()
      .toLowerCase()
      .replace(/[\s]+/g, "-")
      .replace(/[^a-z0-9\u0600-\u06FF\-]/g, "");

    onInputHandler("name", val, val.trim().length > 0);
    onInputHandler("slug", newSlug, true);
  };

  const categoryOptions = [
    { value: "", label: "دسته اصلی (بدون والد)" },
    ...allCategories
      .filter((c) => c.id !== category?.id)
      .map((c) => ({
        value: String(c.id),
        label: c.name,
        searchKeys: `${c.name} ${c.level}`,
      })),
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.isFormValid) return;

    const payload = {
      name: formState.inputs.name.value,
      slug: formState.inputs.slug.value,
      parent_id: formState.inputs.parent_id.value ? Number(formState.inputs.parent_id.value) : null,
    };

    try {
      if (category) {
        await axiosInstance.put(`/categories/${category.id}`, payload);
      } else {
        await axiosInstance.post("/categories", payload);
      }
      onSave();
    } catch (error) {
      console.error("خطا در ارسال:", error);
    }
  };

  return (
    <form id="category-form" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">دسته‌ی والد</span>
          <Select
            className="max-w-[384px]"
            placeholder="انتخاب دسته‌ی والد"
            options={categoryOptions}
            value={formState.inputs.parent_id.value}
            onChange={(val) => onInputHandler("parent_id", val, true)}
            variant="advanced"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">نام دسته‌بندی</span>
          <input
            className="input-info"
            placeholder="مثال: کالای دیجیتال"
            value={formState.inputs.name.value}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">اسلاگ (شناسه یکتا)</span>
          <input
            className="input-info bg-gray-50/50 dark:bg-dark-900/40 border-dashed cursor-default select-none opacity-80"
            placeholder="اسلاگ به صورت خودکار ساخته می‌شود"
            value={formState.inputs.slug.value}
            readOnly
          />
        </div>
      </div>
    </form>
  );
}