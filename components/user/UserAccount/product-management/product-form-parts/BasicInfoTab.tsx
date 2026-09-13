"use client";
import Select from "@/components/ui/Form/Select";

interface BasicInfoTabProps {
  formState: any;
  onInputHandler: (id: string, value: any, isValid?: boolean) => void;
  categories: any[];
  colors: any[];
  setColors: (colors: any[]) => void;
  introBlocks: any[];
  setIntroBlocks: (blocks: any[]) => void;
  previewUrl: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNameChange: (name: string) => void;
}

export default function BasicInfoTab({
  formState,
  onInputHandler,
  categories,
  colors,
  setColors,
  introBlocks,
  setIntroBlocks,
  previewUrl,
  handleImageChange,
  handleNameChange,
}: BasicInfoTabProps) {
  // دسترسی امن به مقادیر فیلدها از دل inputs
  const getValue = (key: string) => formState?.inputs?.[key]?.value ?? "";

  const updateBlock = (i: number, f: string, v: string) => {
    const n = [...introBlocks];
    (n[i] as any)[f] = v;
    setIntroBlocks(n);
  };

  const addBlock = (type: string) =>
    setIntroBlocks([
      ...introBlocks,
      { type, title: "", content: "", sort_order: introBlocks.length + 1 },
    ]);

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <div className="flex items-center gap-4">
        {previewUrl && (
          <img
            src={previewUrl}
            className="w-16 h-16 bg-custom-gray-100/40 dark:bg-dark-800/30 rounded-xl overflow-hidden flex items-center justify-center border border-custom-gray-400 dark:border-custom-gray-400/40 shadow-sm shadow-ui-blue-300 relative shrink-0 object-cover"
            alt="Preview"
          />
        )}
        <input
          type="file"
          id="img-upload"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
        <label
          htmlFor="img-upload"
          className="cursor-pointer py-2 px-4 rounded-xl text-sm font-semibold bg-violet-100 shadow-sm shadow-dark-600/20 text-violet-700 hover:bg-violet-200 transition-all"
        >
          انتخاب تصویر
        </label>
      </div>

      {/* Name and Slug */}
      <div className="flex flex-col gap-3">
        <input
          placeholder="نام محصول"
          className="input-info min-w-full text-base font-bold"
          value={getValue("name")}
          onChange={(e) => {
            onInputHandler("name", e.target.value, true);
            handleNameChange(e.target.value);
          }}
        />

        <div className="relative w-full">
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none z-10">
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-dark-800 px-2 py-0.5 rounded-md">
              SLUG
            </span>
          </div>
          <input
            placeholder="product-name-example"
            className="input-info min-w-full text-left font-mono text-xs pl-4 pr-20 py-3 border-dashed border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-900 cursor-default opacity-80"
            dir="ltr"
            value={getValue("slug")}
            readOnly
          />
        </div>
      </div>

      <div className="space-y-4">
        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400 font-medium mr-1">
            دسته‌بندی محصول
          </label>
          <Select
            options={(categories || []).map((c: any) => ({
              value: c.id.toString(),
              label: c.name,
            }))}
            value={getValue("category_id")}
            onChange={(v: string) => onInputHandler("category_id", v, true)}
          />
        </div>

        {/* Price & Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-medium mr-1">
              قیمت (تومان)
            </label>
            <input
              placeholder="مثال: 50000"
              className="input-info"
              value={getValue("price")}
              onChange={(e) => onInputHandler("price", e.target.value, true)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-medium mr-1">
              تخفیف (%)
            </label>
            <input
              placeholder="مثال: 10"
              className="input-info"
              value={getValue("discount")}
              onChange={(e) => onInputHandler("discount", e.target.value, true)}
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="border-t border-t-custom-gray-400/40 pt-4">
        <label className="text-sm font-bold block mb-2">رنگ‌ها</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((c: any, i: number) => (
            <div
              key={i}
              className="flex items-center gap-1 py-1 pr-2 rounded-xl border border-custom-gray-200 dark:border-white/10 bg-light dark:bg-dark-600 text-gray-800 dark:text-white"
            >
              <div className="relative flex items-center justify-center w-6 h-6 rounded-full overflow-hidden shadow-sm border border-dark-800">
                <input
                  type="color"
                  className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer opacity-0"
                  value={c.hex}
                  onChange={(e) => {
                    const nc = [...colors];
                    nc[i].hex = e.target.value;
                    setColors(nc);
                  }}
                />
                <div className="w-full h-full" style={{ backgroundColor: c.hex }} />
              </div>
              <input
                className="bg-transparent w-16 text-xs outline-none"
                value={c.name}
                onChange={(e) => {
                  const nc = [...colors];
                  nc[i].name = e.target.value;
                  setColors(nc);
                }}
              />
              <button
                type="button"
                onClick={() => setColors(colors.filter((_: any, idx: number) => idx !== i))}
                className="text-red-400 flex"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 p-0.5 fill-current">
                  <path d="M6 18 18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            className="flex items-center text-xs text-ui-blue-400"
            onClick={() => setColors([...colors, { name: "", hex: "#000000" }])}
          >
            + جدید
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="border-t border-t-custom-gray-400/40 pt-4">
        <label className="text-sm font-bold block mb-2">توضیحات کوتاه</label>
        <textarea
          className="input-info w-full text-xs"
          placeholder="یک توضیح کوتاه برای نمایش در لیست محصولات..."
          value={getValue("description")}
          onChange={(e) => onInputHandler("description", e.target.value, true)}
        />
      </div>

      {/* Product Introductions */}
      <div className="border-t border-gray-400/40 pt-4">
        <label className="text-sm font-bold block mb-2">معرفی محصول</label>
        {introBlocks.map((block: any, i: number) => (
          <div
            key={i}
            className="p-3 bg-gray-50 dark:bg-dark-800 rounded-xl mb-3 border border-gray-400/40 space-y-1"
          >
            <div className="flex gap-2 mb-2 items-center justify-between">
              <div>
                <Select
                  options={[
                    { value: "paragraph", label: "پاراگراف" },
                    { value: "heading", label: "عنوان" },
                    { value: "list", label: "لیست" },
                  ]}
                  value={block.type}
                  onChange={(v: string) => updateBlock(i, "type", v)}
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setIntroBlocks(introBlocks.filter((_: any, idx: number) => idx !== i))
                }
                className="text-red-500 text-xs p-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            {block.type === "heading" && (
              <div>
                <input
                  className="input-info w-full mb-1"
                  placeholder="عنوان..."
                  value={block.title}
                  onChange={(e) => updateBlock(i, "title", e.target.value)}
                />
              </div>
            )}
            <div>
              <textarea
                className="input-info w-full text-xs"
                placeholder="محتوا..."
                value={block.content}
                onChange={(e) => updateBlock(i, "content", e.target.value)}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className="flex items-center text-xs text-ui-blue-400"
          onClick={() => addBlock("paragraph")}
        >
          + افزودن توضیحات
        </button>
      </div>
    </div>
  );
}