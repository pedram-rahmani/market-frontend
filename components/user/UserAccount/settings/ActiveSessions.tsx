export default function ActiveSessions() {
  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-purple-300">
        دستگاه‌های متصل به حساب
      </h2>
      <div className="space-y-3 max-w-xl">
        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-custom-gray-400/20 dark:bg-dark-800/50 rounded-xl border border-dark-600/20 dark:border-dark-600 gap-2">
          <div>
            <p className="text-xs sm:text-sm font-medium text-text-on-light dark:text-text-on-dark">Windows • Chrome (همین دستگاه)</p>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-1">آخرین فعالیت: هم اکنون</p>
          </div>
          <span className="text-[11px] sm:text-xs bg-emerald-500/10 text-emerald-400 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-500/20 shrink-0">
            فعال
          </span>
        </div>
        
        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-custom-gray-400/20 dark:bg-dark-800/50 rounded-xl border border-dark-600/20 dark:border-dark-600 gap-2">
          <div>
            <p className="text-xs sm:text-sm font-medium text-text-on-light dark:text-text-on-dark">iPhone • Safari</p>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-1">آخرین فعالیت: ۲ روز پیش</p>
          </div>
          <button className="text-[11px] sm:text-xs text-red-400 hover:text-red-300 bg-red-500/10 px-2.5 sm:px-3 py-1.5 rounded-lg border border-red-500/20 transition cursor-pointer shrink-0">
            خروج از دستگاه
          </button>
        </div>
      </div>
    </div>
  );
}