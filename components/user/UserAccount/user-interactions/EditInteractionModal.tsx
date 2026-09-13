"use client";

import { useState, useEffect, useRef } from "react";
import useClickOutside from "@/store/hooks/useClickOutside";
import useLockBodyScroll from "@/store/hooks/useLockBodyScroll";
import Select from "@/components/ui/Form/Select";
import { InteractionItem, EditInteractionPayload } from "@/types/interactions";

interface EditInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Pick<InteractionItem, "id" | "type" | "productName" | "content" | "rating"> | null;
  onSave: (updatedData: EditInteractionPayload) => Promise<void>;
}

export default function EditInteractionModal({
  isOpen,
  onClose,
  item,
  onSave,
}: EditInteractionModalProps) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("5");
  const [loading, setLoading] = useState(false);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (item) {
      setContent(item.content || "");
      setRating(String(item.rating || 5));
    }
  }, [item]);

  const modalRef = useRef<HTMLDivElement>(null!);
  useClickOutside(() => onClose(), [modalRef]);

  if (!isOpen || !item) return null;

  const isReview = item.type === "review";

  const handleSave = async () => {
    try {
      setLoading(true);
      await onSave({
        content,
        ...(isReview ? { rating: Number(rating) } : {}),
      });
      onClose();
    } catch (error) {
      console.error("Error saving interaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir="rtl">
      <div
        ref={modalRef}
        className="bg-white dark:bg-dark-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl text-right"
      >
        <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
          ویرایش {isReview ? "دیدگاه" : "پرسش"}: <span className="text-violet-600 text-xs">{item.productName}</span>
        </h3>

        <div className="flex flex-col gap-4 mb-6">
          {isReview && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">امتیاز</label>
              <Select
                variant="simple"
                value={rating}
                onChange={(val) => setRating(val)}
                options={[
                  { value: "5", label: "⭐⭐⭐⭐⭐ (۵ ستاره)" },
                  { value: "4", label: "⭐⭐⭐⭐ (۴ ستاره)" },
                  { value: "3", label: "⭐⭐⭐ (۳ ستاره)" },
                  { value: "2", label: "⭐⭐ (۲ ستاره)" },
                  { value: "1", label: "⭐ (۱ ستاره)" },
                ]}
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-500 mb-1">متن</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-white/10 text-xs text-gray-800 dark:text-white focus:outline-none focus:border-violet-500 resize-none"
              placeholder="متن خود را وارد کنید..."
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-neutral-700 text-xs text-gray-600 dark:text-gray-300 cursor-pointer"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-xs disabled:opacity-50 cursor-pointer hover:bg-violet-700 transition-colors"
          >
            {loading ? "ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </div>
    </div>
  );
}