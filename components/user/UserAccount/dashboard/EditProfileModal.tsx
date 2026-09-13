"use client";

import { useRef } from "react";
import MessageModal from "@/components/feedback/MessageModal/MessageModal";
import { SkeletonAvatar } from "@/components/ui/Skeletons/Skeletons";
import { useProfileForm, EditProfileFormValues } from "@/store/hooks/useProfileForm";
import useLockBodyScroll from "@/store/hooks/useLockBodyScroll";
import useClickOutside from "@/store/hooks/useClickOutside";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: EditProfileFormValues;
  onSuccess: (updatedData: EditProfileFormValues) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: EditProfileModalProps) {
  const {
    formData,
    loading,
    avatarLoading,
    isProcessing,
    messageModalOpen,
    setMessageModalOpen,
    apiResponse,
    fileInputRef,
    handleInputChange,
    handleAvatarChange,
    getAvatarUrl,
    handleSubmit,
  } = useProfileForm(initialData, isOpen, onSuccess, onClose);

  const modalRef = useRef<HTMLDivElement | null>(null);

  useLockBodyScroll(isOpen);
  useClickOutside(onClose, modalRef);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
        <div 
          ref={modalRef}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-xl space-y-6 my-8"
        >
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              ویرایش اطلاعات حساب کاربری
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              type="button"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4 pb-2">
              <div className="size-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-600 font-bold overflow-hidden shrink-0 shadow-sm relative">
                {avatarLoading ? (
                  <SkeletonAvatar size="size-16 rounded-2xl" />
                ) : getAvatarUrl() ? (
                  <img src={getAvatarUrl() || ""} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">{formData.name ? formData.name.charAt(0).toUpperCase() : "U"}</span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-gray-900 dark:text-white">تصویر پروفایل</span>
                <span className="text-[11px] text-gray-400 dark:text-gray-500">
                  {isProcessing ? "در حال فشرده‌سازی..." : "عکس فعلی شما در پیش‌نمایش قابل مشاهده است"}
                </span>
                
                <input 
                  ref={fileInputRef}
                  type="file" 
                  id="avatar-upload"
                  accept="image/jpeg,image/png,image/webp" 
                  className="hidden" 
                  onChange={handleAvatarChange}
                  disabled={isProcessing}
                />
                <label 
                  htmlFor="avatar-upload"
                  className="inline-block w-fit cursor-pointer mt-1 py-1 px-3 rounded-lg text-xs font-medium bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300 transition-colors"
                >
                  {isProcessing ? "در حال پردازش..." : "تغییر عکس"}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="input-info min-w-full"
                placeholder="نام خود را وارد کنید"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                  شماره تماس
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="input-info"
                  placeholder="0912..."
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                  ایمیل
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="input-info"
                  placeholder="example@mail.com"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                آدرس پستی
              </label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="input-info text-sm resize-none"
                placeholder="آدرس دقیق پستی خود را وارد کنید"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={loading || isProcessing}
                className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-xl transition shadow-lg shadow-violet-600/20 cursor-pointer disabled:opacity-50"
              >
                {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        response={apiResponse}
        onAfterClose={() => {
          if (apiResponse?.status >= 200 && apiResponse?.status < 300) {
            onClose();
          }
        }}
      />
    </>
  );
}