"use client";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }} 
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-white dark:bg-neutral-800 p-6 rounded-2xl w-full max-w-sm shadow-xl"
      >
        <h3 className="text-lg font-bold mb-4">تایید حذف</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">آیا مطمئن هستید که می‌خواهید "{title}" را حذف کنید؟</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700">انصراف</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-xl bg-red-600 text-white">حذف</button>
        </div>
      </div>
    </div>
  );
}