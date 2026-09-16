"use client";
import Select from "@/components/ui/Form/Select";

export default function SpecificationsTab({
  specs,
  setSpecs,
  allFeatures,
  editingSpecIndex,
  setEditingSpecIndex,
}: any) {
  return (
    <div className="border-t border-t-custom-gray-400/40 pt-4">
      <label className="text-sm font-bold block mb-2">مشخصات فنی</label>

      {specs.map((s: any, i: number) => {
        const dynamicOptions = [
          { value: "custom", label: "+ افزودن ..." },
          ...allFeatures.map((f: any) => ({
            value: f.id.toString(),
            label: f.title,
          })),
        ];

        return (
          <div key={i} className="flex gap-2 mb-2 items-center animate-fadeIn">
            {editingSpecIndex === i ? (
              <input
                className="input-info w-44! border-violet-500 ring-2 ring-violet-500/20"
                autoFocus
                placeholder="نام ویژگی..."
                value={s.name || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const ns = [...specs];
                  ns[i].name = val;
                  // generate name (like slug)
                  ns[i].feature_id = val
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "_")
                    .replace(/_+/g, "_");
                  setSpecs(ns);
                }}
                onBlur={() => setEditingSpecIndex(null)}
                onKeyDown={(e) => e.key === "Enter" && setEditingSpecIndex(null)}
              />
            ) : (
              <Select
                options={dynamicOptions}
                value={s.feature_id}
                onChange={(v: string) => {
                  if (v === "custom") {
                    setEditingSpecIndex(i);
                    const ns = [...specs];
                    ns[i].feature_id = "";
                    ns[i].name = "";
                    setSpecs(ns);
                  } else {
                    const selectedFeature = allFeatures.find((f: any) => f.id.toString() === v);
                    const ns = [...specs];
                    ns[i].feature_id = v;
                    ns[i].name = selectedFeature 
                      ? (selectedFeature.name || selectedFeature.title) 
                      : "";
                    setSpecs(ns);
                  }
                }}
                placeholder="انتخاب ویژگی"
                className="w-44!"
              />
            )}

            <input
              className="input-info flex-1"
              placeholder="مقدار (مثلاً 512)"
              value={s.value}
              onChange={(e) => {
                const ns = [...specs];
                ns[i].value = e.target.value;
                setSpecs(ns);
              }}
            />

            <button
              type="button"
              onClick={() => setSpecs(specs.filter((_: any, idx: number) => idx !== i))}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        );
      })}

      <button
        type="button"
        className="flex items-center text-xs text-ui-blue-400"
        onClick={() => setSpecs([...specs, { feature_id: "", name: "", value: "" }])}
      >
        + افزودن ویژگی
      </button>
    </div>
  );
}