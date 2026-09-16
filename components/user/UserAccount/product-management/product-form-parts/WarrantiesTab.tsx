"use client";
import Select from "@/components/ui/Form/Select";

export default function WarrantiesTab({
  selectedWarranties,
  setSelectedWarranties,
  allWarranties,
  editingWarrantyIndex,
  setEditingWarrantyIndex,
  handleSaveNewWarranty,
  handleDeleteWarranty,
}: any) {
  return (
    <div className="border-t border-t-custom-gray-400/40 pt-4">
      <label className="text-sm font-bold block mb-2">گارانتی‌های محصول</label>

      {selectedWarranties.map((item: any, index: number) => {
        const warrantyOptions = [
          { value: "custom", label: "+ افزودن گارانتی جدید..." },
          ...allWarranties.map((w: any) => ({
            value: w.id.toString(),
            label: `${w.title} (${w.duration_months || 0} ماهه)`,
          })),
          ...(item.warranty_id !== "" &&
          !allWarranties.find((w: any) => w.id.toString() === item.warranty_id)
            ? [{ value: item.warranty_id, label: item.warranty_id }]
            : []),
        ];

        // find the current warranty object (for removing from database)
        const currentWarrantyObj = allWarranties.find(
          (w: any) => w.id.toString() === item.warranty_id,
        );

        return (
          <div
            key={index}
            className="flex flex-col gap-2.5 mb-3 p-3.5 bg-gray-50 dark:bg-dark-800/60 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div className="flex gap-2 items-center">
              {editingWarrantyIndex === index ? (
                <input
                  className="input-info w-full border-violet-500 ring-2 ring-violet-500/20 text-xs"
                  autoFocus
                  placeholder="عنوان گارانتی جدید را وارد کنید و اینتر بزنید..."
                  defaultValue=""
                  onBlur={(e) => handleSaveNewWarranty(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSaveNewWarranty(
                        index,
                        (e.target as HTMLInputElement).value,
                      );
                    }
                  }}
                />
              ) : (
                <div className="flex-1 flex items-center gap-2">
                  <Select
                    options={warrantyOptions}
                    value={item.warranty_id}
                    onChange={(v: string) => {
                      if (v === "custom") {
                        setEditingWarrantyIndex(index);
                      } else {
                        const nw = [...selectedWarranties];
                        nw[index].warranty_id = v;
                        setSelectedWarranties(nw);
                      }
                    }}
                    placeholder="انتخاب گارانتی"
                    className="w-full"
                  />

                  {/* remove warranty from database */}
                  {currentWarrantyObj && (
                    <button
                      type="button"
                      title="حذف این گارانتی از سیستم"
                      onClick={() =>
                        handleDeleteWarranty(currentWarrantyObj.id)
                      }
                      className="text-gray-400 hover:text-red-500 p-1.5 transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="size-4!">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 pt-1 border-t border-gray-200/60 dark:border-gray-700/40">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-gray-400 shrink-0">
                  مبلغ اضافه:
                </span>
                <input
                  placeholder="مثال: 50000 (تومان)"
                  className="input-info text-xs py-1.5 px-3 w-full max-w-xs"
                  value={item.price}
                  onChange={(e) => {
                    const nw = [...selectedWarranties];
                    nw[index].price = e.target.value;
                    setSelectedWarranties(nw);
                  }}
                />
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={item.is_default}
                    onChange={(e) => {
                      const nw = [...selectedWarranties];
                      nw[index].is_default = e.target.checked;
                      setSelectedWarranties(nw);
                    }}
                    className="rounded accent-violet-600 w-4 h-4"
                  />
                  <span>پیش‌فرض</span>
                </label>

                {/* remove warranty from product */}
                <button
                  type="button"
                  onClick={() =>
                    setSelectedWarranties(
                      selectedWarranties.filter(
                        (_: any, idx: number) => idx !== index,
                      ),
                    )
                  }
                  className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1"
                >
                  <svg viewBox="0 0 24 24" className="size-4!">
                    <path d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  <span className="mt-1">حذف از محصول</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        className="flex items-center text-xs text-ui-blue-400 font-semibold mt-2"
        onClick={() =>
          setSelectedWarranties([
            ...selectedWarranties,
            { warranty_id: "", price: "", is_default: false },
          ])
        }
      >
        + افزودن گارانتی جدید به محصول
      </button>
    </div>
  );
}
