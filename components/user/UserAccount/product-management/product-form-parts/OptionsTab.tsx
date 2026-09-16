"use client";
import { normalizeText } from "@/lib/stringUtils";

export default function OptionsTab({
  options,
  setOptions,
  newItemText,
  setNewItemText,
}: any) {
  const addOptionGroup = () => {
    const hasInvalidGroup = options.some((opt: any) => !opt.title.trim());
    if (hasInvalidGroup) return;
    setOptions([...options, { title: "", items: [] }]);
  };

  const removeOptionGroup = (index: number) => {
    setOptions(options.filter((_: any, i: number) => i !== index));
  };

  const updateOptionTitle = (index: number, title: string) => {
    const updated = [...options];
    updated[index].title = title;
    setOptions(updated);
  };

  const addOptionItem = (groupIndex: number) => {
    const rawText = newItemText[groupIndex]?.trim();
    if (!rawText) return;

    const normalizedNew = normalizeText(rawText);
    const currentItems = options[groupIndex].items;

    const isDuplicate = currentItems.some(
      (item: string) => normalizeText(item) === normalizedNew,
    );

    if (!isDuplicate) {
      const updated = [...options];
      updated[groupIndex].items.push(rawText);
      setOptions(updated);
    }

    setNewItemText({ ...newItemText, [groupIndex]: "" });
  };

  const removeOptionItem = (groupIndex: number, itemIndex: number) => {
    const updated = [...options];
    updated[groupIndex].items = updated[groupIndex].items.filter(
      (_: any, i: number) => i !== itemIndex,
    );
    setOptions(updated);
  };

  return (
    <div className="border-t border-t-custom-gray-400/40 pt-4">
      <label className="text-sm font-bold block mb-2">
گزینه‌های قابل انتخاب (مثل سایز و رنگ که روی قیمت یا موجودی تاثیر دارند)      </label>
      <div className="space-y-3">
        {options.map((opt: any, groupIdx: number) => (
          <div
            key={groupIdx}
            className="p-3 bg-gray-50 dark:bg-dark-800/60 rounded-xl border border-gray-200 dark:border-gray-700/50 space-y-2"
          >
            <div className="flex gap-2 items-center">
              <input
                placeholder="عنوان ویژگی (مثال: سایز کفش)"
                className="input-info text-xs font-bold flex-1"
                value={opt.title}
                onChange={(e) => updateOptionTitle(groupIdx, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeOptionGroup(groupIdx)}
                className="text-red-500 text-xs px-2 py-1 hover:bg-red-500/10 rounded-lg"
              >
                حذف گروه
              </button>
            </div>

            {/* Items / Tags */}
            <div className="flex flex-wrap gap-1.5 items-center pt-1">
              {opt.items.map((item: string, itemIdx: number) => (
                <span
                  key={itemIdx}
                  className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 text-xs px-2.5 py-1 rounded-lg border border-violet-200 dark:border-violet-700/30"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeOptionItem(groupIdx, itemIdx)}
                    className="text-violet-500 hover:text-red-500 px-1 text-sm leading-none flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1">
                <input
                  placeholder="مقدار جدید (Enter)"
                  className="input-info text-xs py-1 px-2 w-32"
                  value={newItemText[groupIdx] || ""}
                  onChange={(e) =>
                    setNewItemText({
                      ...newItemText,
                      [groupIdx]: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addOptionItem(groupIdx);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => addOptionItem(groupIdx)}
                  className="text-xs bg-gray-200 dark:bg-dark-700 px-2 py-1 rounded-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="flex items-center text-xs text-ui-blue-400 font-semibold"
          onClick={addOptionGroup}
        >
          + افزودن گروه ویژگی جدید
        </button>
      </div>
    </div>
  );
}