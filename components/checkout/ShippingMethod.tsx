interface ShippingMethodProps {
  selected: string;
  onSelect: (method: string) => void;
}

export default function ShippingMethod({ selected, onSelect }: ShippingMethodProps) {
  return (
    <div className="bg-white dark:bg-ui-blue-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
      <h2 className="text-sm font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
        انتخاب روش ارسال
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={() => onSelect("express")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selected === 'express' ? 'border-violet-600 bg-violet-50/5 dark:bg-violet-500/10' : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5'}`}
        >
          <div className="space-y-1">
            <span className="font-bold text-xs text-gray-800 dark:text-white block">پست پیشتاز</span>
            <span className="text-[10px] text-gray-400 block">تحویل ۳ تا ۴ روز کاری</span>
          </div>
          <span className="text-xs font-bold text-violet-600 dark:text-violet-400">۴۵,۰۰۰ تومان</span>
        </div>

        <div 
          onClick={() => onSelect("vip")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selected === 'vip' ? 'border-violet-600 bg-violet-50/5 dark:bg-violet-500/10' : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5'}`}
        >
          <div className="space-y-1">
            <span className="font-bold text-xs text-gray-800 dark:text-white block">پیک فوری (تهران)</span>
            <span className="text-[10px] text-gray-400 block">تحویل در همان روز</span>
          </div>
          <span className="text-xs font-bold text-violet-600 dark:text-violet-400">۹۰,۰۰۰ تومان</span>
        </div>
      </div>
    </div>
  );
}