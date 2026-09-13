"use client";

import { useState } from "react";
import useTheme from "@/store/hooks/useTheme";
import Checkbox from "@/components/ui/Form/Checkbox";

export default function NotificationSettings() {
  const [theme, toggleTheme] = useTheme();

  // checkbox management
  const [settings, setSettings] = useState({
    sms: true,
    newsletter: false,
    siteNotif: true,
  });

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setSettings((prev) => ({ ...prev, [id]: checked }));
  };

  // notif btns
  const notificationItems = [
    { id: "sms", label: "دریافت پیامک وضعیت سفارش‌ها", checked: settings.sms },
    { id: "newsletter", label: "عضویت در خبرنامه ایمیلی و تخفیف‌ها", checked: settings.newsletter },
    { id: "siteNotif", label: "اعلان‌های درون‌سایت", checked: settings.siteNotif },
  ];

  return (
    <div className="space-y-6">
      {/* theme */}
      <div className="lg:hidden">
        <h2 className="text-base sm:text-lg font-semibold mb-3 text-ui-purple">
          حالت نمایش
        </h2>
        <div className="max-w-xl">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center p-3 bg-custom-gray-400/20 dark:bg-dark-800/50 rounded-xl border border-dark-600/20 dark:border-dark-600 text-xs sm:text-sm text-text-on-dark hover:text-ui-purple transition cursor-pointer"
          >
            {theme === "dark" ? (
              <svg className="size-5 text-ui-yellow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="size-5 text-ui-purple" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* notifications */}
      <div>
        <h2 className="text-base sm:text-lg font-semibold mb-3 text-ui-purple">
          کانال‌های اطلاع‌رسانی
        </h2>
        <div className="space-y-3 max-w-xl">
          {notificationItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-custom-gray-400/20 dark:bg-dark-800/50 rounded-xl border border-dark-600/20 dark:border-dark-600 text-xs sm:text-sm"
            >
              <span className="text-text-on-light dark:text-text-on-dark">
                {item.label}
              </span>
              <Checkbox
                id={item.id}
                label=""
                checked={item.checked}
                activeColor="bg-ui-purple border-ui-purple"
                onInputHandler={(id, checked) => handleCheckboxChange(id, checked)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}