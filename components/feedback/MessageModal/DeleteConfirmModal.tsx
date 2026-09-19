"use client";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, isDeleting = false }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        if (!isDeleting) onClose();
      }} 
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white dark:bg-neutral-800 p-6 rounded-2xl w-full max-w-sm shadow-xl"
      >
        <h3 className="text-lg font-bold mb-4">تایید حذف</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-6">
          آیا مطمئن هستید که می‌خواهید:
          <span className="my-2 block max-h-18 overflow-hidden text-ellipsis line-clamp-3 rounded-lg bg-gray-50 dark:bg-neutral-900/50 px-3 py-2 text-sm">
            «{title}»
          </span>
          را حذف کنید؟
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={isDeleting} className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 disabled:opacity-50">انصراف</button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-2 rounded-xl bg-red-600 text-white disabled:opacity-50">
            {isDeleting ? "حذف..." : "حذف"}
          </button>
        </div>
      </div>
    </div>
  );
}