"use client";

import { useState } from "react";
import SecuritySettings from "@/components/user/UserAccount/settings/SecuritySettings";
import NotificationSettings from "@/components/user/UserAccount/settings/NotificationSettings";
import ActiveSessions from "@/components/user/UserAccount/settings/ActiveSessions";

export default function SettingsContent() {
  const [activeTab, setActiveTab] = useState("security");

  // tab
  const SettingsTabs = () => {
    const tabs = [
      { id: "security", label: "امنیت و رمز عبور" },
      { id: "notifications", label: "تنظیمات اعلان‌ها" },
      { id: "sessions", label: "نشست‌های فعال" },
    ];

    return (
      <div className="flex border-b border-custom-gray-200 dark:border-custom-gray-400/30 mb-6 gap-4 sm:gap-6 overflow-x-auto scrollbar-none whitespace-nowrap">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 border-b-2 text-xs sm:text-sm font-medium transition cursor-pointer shrink-0 ${
                isActive
                  ? "border-ui-purple text-ui-purple"
                  : "border-transparent text-text-on-light dark:text-text-on-dark hover:text-ui-purple"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 text-text-on-light dark:text-text-on-dark max-w-4xl mx-auto" dir="rtl">
      {/* tab btns */}
      <SettingsTabs />

      {/* tab contents */}
      <div className="bg-white dark:bg-dark-700/30 p-4 sm:p-6 mb-6 rounded-2xl border border-custom-gray-100/70 dark:border-dark-600 shadow-sm">
        {activeTab === "security" && <SecuritySettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "sessions" && <ActiveSessions />}
      </div>
    </div>
  );
}