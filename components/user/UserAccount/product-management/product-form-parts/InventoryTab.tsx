"use client";

interface InventoryTabProps {
  stock: string | number;
  setStock: (val: any) => void;
  sku?: string;
  setSku?: (val: any) => void;
}

export default function InventoryTab({ stock, setStock, sku, setSku }: InventoryTabProps) {
  return (
    <div className="space-y-4 border-t border-t-custom-gray-400/40 pt-4">
      <label className="text-sm font-bold block">اطلاعات انبار و موجودی</label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">موجودی انبار</label>
          <input
            type="number"
            className="input-info w-full"
            placeholder="مثلاً 100"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        {setSku && (
          <div>
            <label className="text-xs text-gray-500 block mb-1">شناسه انبار (SKU)</label>
            <input
              type="text"
              className="input-info w-full"
              placeholder="کد یکتا (SKU)"
              value={sku || ""}
              onChange={(e) => setSku(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}