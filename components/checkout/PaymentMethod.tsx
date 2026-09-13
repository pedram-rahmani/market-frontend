interface PaymentMethodProps {
  selected: string;
  onSelect: (method: string) => void;
}

export default function PaymentMethod({ selected, onSelect }: PaymentMethodProps) {
  return (
    <div className="bg-white dark:bg-ui-blue-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
      <h2 className="text-sm font-bold text-gray-800 dark:text-white border-b border-gray-100 dark:border-white/5 pb-3">
        انتخاب شیوه پرداخت
      </h2>
      <div className="space-y-3">
        <div 
          onClick={() => onSelect("online")}
          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selected === 'online' ? 'border-violet-600 bg-violet-50/5 dark:bg-violet-500/10' : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5'}`}
        >
          <span className="font-bold text-xs text-gray-800 dark:text-white">درگاه پرداخت اینترنتی (سجوی/زرین‌پال)</span>
          <span className="text-xs text-violet-600 dark:text-violet-400 font-bold">آنلاین و امن</span>
        </div>
      </div>
    </div>
  );
}