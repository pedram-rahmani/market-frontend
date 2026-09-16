"use client";

interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: { name: string; phone: string; address: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
}

export default function EditAddressModal({ isOpen, onClose, formData, onChange, onSave }: EditAddressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 p-6 rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 space-y-4" dir="rtl">
        <h3 className="font-bold text-sm text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
          ویرایش مشخصات و آدرس
        </h3>
        
        <div className="space-y-3 text-xs">
          <div>
            <label className="text-gray-400 block mb-1">نام و نام خانوادگی</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={onChange}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-800 dark:text-white focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">شماره موبایل</label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone} 
              onChange={onChange}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-gray-800 dark:text-white focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <label className="text-gray-400 block mb-1">آدرس پستی</label>
            <textarea 
              rows={3} 
              name="address" 
              value={formData.address} 
              onChange={onChange}
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-800 dark:text-white focus:outline-none focus:border-violet-500 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button 
            onClick={onSave}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
          >
            تایید و ذخیره
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}