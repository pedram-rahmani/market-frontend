"use client";

import { useState } from "react";
import SecuritySettings from "@/components/user/UserAccount/settings/SecuritySettings";
import NotificationSettings from "@/components/user/UserAccount/settings/NotificationSettings";
import ActiveSessions from "@/components/user/UserAccount/settings/ActiveSessions";
import PageHeader from "@/components/user/UserAccount/PageHeader";

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
    <div className="space-y-6 text-text-on-light dark:text-text-on-dark" dir="rtl">
      <PageHeader
        title="تنظیمات حساب"
        description="امنیت، اعلان‌ها و نشست‌های فعال حساب کاربری"
        icon={
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        }
      />
      {/* tab btns */}
      <SettingsTabs />

      {/* tab contents */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-ui-blue-900 sm:p-6">
        {activeTab === "security" && <SecuritySettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "sessions" && <ActiveSessions />}
      </div>
    </div>
  );
}