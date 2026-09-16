"use client";

interface GalleryTabsProps {
  activeTab: "official" | "user";
  onTabChange: (tab: "official" | "user") => void;
  officialCount: number;
  userCount: number;
}

export default function GalleryTabs({
  activeTab,
  onTabChange,
  officialCount,
  userCount,
}: GalleryTabsProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-gray-900/60 border border-white/10 rounded-2xl w-fit">
      <button
        type="button"
        onClick={() => onTabChange("official")}
        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
          activeTab === "official"
            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <span>تصاویر رسمی</span>
        <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === "official" ? "bg-black/20 text-white" : "bg-white/5 text-gray-400"}`}>
          {officialCount}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("user")}
        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
          activeTab === "user"
            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <span>تصاویر کاربران</span>
        <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${activeTab === "user" ? "bg-black/20 text-white" : "bg-white/5 text-gray-400"}`}>
          {userCount}
        </span>
      </button>
    </div>
  );
}