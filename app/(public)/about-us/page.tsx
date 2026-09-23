export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-24 lg:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          درباره <span className="bg-linear-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">ما</span>
        </h1>
        <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
          ما اینجا هستیم تا بهترین تجربه را برای شما رقم بزنیم. داستان ما از یک ایده ساده شروع شد...
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/5 dark:bg-dark-800">
          <div className="flex size-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
            🚀
          </div>
          <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">هدف ما</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            ارائه سریع، باکیفیت و امن خدمات و محصولات مورد نیاز شما با بالاترین استانداردها.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/5 dark:bg-dark-800">
          <div className="flex size-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            💡
          </div>
          <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">ایده‌های نو</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            همیشه در تلاشیم با به‌روزترین تکنولوژی‌ها راهکارهای خلاقانه‌ای ارائه دهیم.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/5 dark:bg-dark-800 sm:col-span-2 lg:col-span-1">
          <div className="flex size-12 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
            🤝
          </div>
          <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">پشتیبانی همیشه</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            تیم پشتیبانی ما در تمامی مراحل در کنار شماست تا با خیال راحت خرید کنید.
          </p>
        </div>
      </div>
    </div>
  );
}