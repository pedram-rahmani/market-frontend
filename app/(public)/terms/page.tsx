export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-24 lg:py-32 max-w-4xl">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          قوانین و <span className="bg-linear-to-r from-violet-600 to-cyan-500 bg-clip-text text-transparent">مقررات</span>
        </h1>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          لطفاً پیش از استفاده از خدمات سایت، قوانین و مقررات را به دقت مطالعه فرمایید.
        </p>
      </div>

      <div className="mt-12 space-y-8 text-gray-600 dark:text-gray-300">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/5 dark:bg-dark-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">۱. شرایط عمومی</h3>
          <p className="mt-2 text-sm leading-7">
            کلیه اصول و رویه‌های وب‌سایت منطبق با قوانین جمهوری اسلامی ایران، قانون تجارت الکترونیک و قانون حمایت از حقوق مصرف‌کننده است و متعاقباً کاربر نیز موظف به رعایت قوانین مرتبط با کاربر است.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/5 dark:bg-dark-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">۲. حریم خصوصی</h3>
          <p className="mt-2 text-sm leading-7">
            این مجموعه به اطلاعات خصوصی اشخاص‑هایی که از خدمات سایت استفاده می‌کنند، احترام گذاشته و از آن محافظت می‌کند. اطلاعات شما نزد ما کاملاً امن محفوظ خواهد بود.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/5 dark:bg-dark-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">۳. ثبت و ارسال سفارش</h3>
          <p className="mt-2 text-sm leading-7">
            روز کاری به معنی روز شنبه تا پنج‌شنبه هر هفته، به استثنای تعطیلات عمومی در ایران است و کلیه سفارش‌های ثبت‌شده در طول روزهای کاری و اولین روز پس از تعطیلات پردازش می‌شوند.
          </p>
        </div>
      </div>
    </div>
  );
}