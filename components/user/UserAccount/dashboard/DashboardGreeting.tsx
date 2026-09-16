interface DashboardGreetingProps {
  userName: string;
  userAvatar?: string;
}

export default function DashboardGreeting({
  userName,
  userAvatar,
}: DashboardGreetingProps) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-dark-900 border border-custom-gray-100 dark:border-dark-800 px-4 py-3.5 sm:p-6 rounded-2xl shadow-sm">
      <div className="absolute -left-20 -top-20 w-48 h-48 bg-ui-purple/10 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-ui-pink/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between relative z-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-linear-to-tr from-primary to-info flex items-center justify-center text-sm sm:text-base font-bold text-white shadow-sm shrink-0">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName || "کاربر"}
                className="w-full h-full object-cover"
              />
            ) : (
              userName ? userName.charAt(0).toUpperCase() : "کاربر"
            )}
          </div>

          <div>
            <span className="text-xs text-text-on-light dark:text-text-on-dark/60 block">
              پنل مدیریت حساب
            </span>

            <h1 className="text-sm sm:text-lg font-bold text-dark-600 dark:text-text-on-dark tracking-tight">
              سلام، {userName} عزیز
            </h1>
          </div>
        </div>

        {/* notification btn */}
        <button
          type="button"
          aria-label="اعلان‌ها"
          className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-light dark:bg-dark-800 border border-custom-gray-100 dark:border-dark-700 text-text-on-light dark:text-text-on-dark hover:text-primary dark:hover:text-primary transition-colors cursor-pointer shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-5!">
            <path d="M12.02 2.91c-3.5 0-6.17 2.67-6.17 6.17v2.33c0 .5-.25 1.17-.5 1.67l-1 1.67c-.67 1.17.17 2.67 1.5 2.67h14.34c1.33 0 2.17-1.5 1.5-2.67l-1-1.67c-.25-.5-.5-1.17-.5-1.67V9.08c0-3.5-2.67-6.17-6.17-6.17zM10.02 21.08c.5.67 1.33 1.08 2 1.08s1.5-.42 2-1.08" />
          </svg>

          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-danger" />
        </button>
      </div>
    </div>
  );
}