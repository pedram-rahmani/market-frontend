"use client";

import { createPortal } from "react-dom";
import { GalleryMedia } from "./ProductGallery";

interface GalleryLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  mounted: boolean;
  activeLightboxMedia: GalleryMedia;
  allMedia: GalleryMedia[];
  lightboxIndex: number;
  setLightboxIndex: (index: number) => void;
  activeTab: "official" | "user";
  setActiveTab: (tab: "official" | "user") => void;
  getFullUrl: (path?: string) => string;
  renderMediaContent: (media: GalleryMedia, isLightbox?: boolean) => React.ReactNode;
}

export default function GalleryLightbox({
  isOpen,
  onClose,
  mounted,
  activeLightboxMedia,
  allMedia,
  lightboxIndex,
  setLightboxIndex,
  activeTab,
  setActiveTab,
  getFullUrl,
  renderMediaContent,
}: GalleryLightboxProps) {
  if (!isOpen || !mounted) return null;

  const officialMedia = allMedia.filter((m) => m.source === "official" || !m.source);
  const userMedia = allMedia.filter((m) => m.source === "user");
  const currentTabMedia = activeTab === "official" ? officialMedia : userMedia;

  return createPortal(
    <div className="fixed inset-0 z-100000 flex items-center justify-center p-3 md:p-6 select-none bg-black/95 backdrop-blur-md animate-fadeIn">
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 left-5 z-100001 p-2.5 rounded-full bg-gray-800/90 text-white shadow-xl border border-white/10 cursor-pointer hover:bg-gray-700 transition-colors"
        title="بستن (Esc)"
      >
        <svg className="size-4!" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="relative max-w-4xl w-full flex flex-col items-center justify-center max-h-[92vh]">
        
        {/* Tabs inside modal above the image */}
        <div className="flex items-center gap-2 mb-3 p-1 bg-gray-900/80 border border-white/10 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab("official");
              if (officialMedia.length > 0) {
                const firstOfficialIndex = allMedia.findIndex((m) => m.id === officialMedia[0].id);
                if (firstOfficialIndex !== -1) setLightboxIndex(firstOfficialIndex);
              }
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-all duration-200 ${
              activeTab === "official"
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>تصاویر رسمی</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${activeTab === "official" ? "bg-black/20 text-white" : "bg-white/5 text-gray-400"}`}>
              {officialMedia.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("user");
              if (userMedia.length > 0) {
                const firstUserIndex = allMedia.findIndex((m) => m.id === userMedia[0].id);
                if (firstUserIndex !== -1) setLightboxIndex(firstUserIndex);
              }
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-all duration-200 ${
              activeTab === "user"
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>تصاویر کاربران</span>
            <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${activeTab === "user" ? "bg-black/20 text-white" : "bg-white/5 text-gray-400"}`}>
              {userMedia.length}
            </span>
          </button>
        </div>

        {/* Main image or video display in modal with smooth transition */}
        <div className="relative w-full h-[52vh] md:h-[58vh] flex items-center justify-center overflow-hidden bg-black/40 rounded-2xl border border-white/10 p-2">
          <div key={activeLightboxMedia?.id} className="w-full h-full flex items-center justify-center animate-fadeIn">
            {renderMediaContent(activeLightboxMedia, true)}
          </div>

          {activeLightboxMedia?.source === "user" && (
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] px-3 py-1 rounded-full border border-white/10 shadow-lg pointer-events-none">
              ارسال شده توسط:{" "}
              <span className="text-cyan-400 font-bold">
                {activeLightboxMedia.userName || "کاربر"}
              </span>
            </div>
          )}
        </div>

        {/* Comments and read-only stats */}
        {activeLightboxMedia && (
          <div key={activeLightboxMedia?.id + "-details"} className="w-full mt-3 p-3 bg-gray-900/95 border border-white/10 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl animate-fadeIn">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400">
                  {activeLightboxMedia.source === "user" ? activeLightboxMedia.userName || "کاربر" : "تصویر رسمی"}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {activeLightboxMedia.comment || "توضیحی برای این رسانه ثبت نشده است."}
              </p>
            </div>

            {/* Read-only stats display without buttons */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
              <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border bg-white/5 border-white/10 text-gray-400">
                <span>👍</span>
                <span>{activeLightboxMedia.likes_count || 0}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border bg-white/5 border-white/10 text-gray-400">
                <span>👎</span>
                <span>{activeLightboxMedia.dislikes_count || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* Thumbnails */}
        <div className="flex gap-2 mt-3 overflow-x-auto max-w-full p-1">
          {currentTabMedia.map((item) => {
            const globalIndex = allMedia.findIndex((m) => m.id === item.id);
            const isSelected = lightboxIndex === globalIndex;
            const thumbUrl = item.type === "video" && item.thumbnail ? item.thumbnail : item.url;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxIndex(globalIndex)}
                className={`relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 transition-all duration-200 p-0.5 bg-gray-900 shrink-0 cursor-pointer ${
                  isSelected ? "border-cyan-400 scale-105 opacity-100 shadow-md shadow-cyan-500/20" : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <img src={getFullUrl(thumbUrl)} className="w-full h-full object-cover rounded-lg pointer-events-none" alt="" />
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}