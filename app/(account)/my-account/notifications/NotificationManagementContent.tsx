"use client";

import { useState } from "react";
import NotificationRow from "@/components/user/UserAccount/notification-management/NotificationRow";

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: "info" | "success" | "warning";
}

export default function NotificationManagementContent() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "تغییر موفق رمز عبور",
      message: "رمز عبور حساب کاربری شما با موفقیت به‌روزرسانی شد.",
      date: "۱۴۰۵/۰۶/۲۰ - ۱۸:۳۰",
      isRead: false,
      type: "success",
    },
    {
      id: 2,
      title: "تخفیف ویژه جشنواره",
      message: "کد تخفیف ۵۰ درصدی محصولات فصلی فعال شد.",
      date: "۱۴۰۵/۰۶/۱۹ - ۱۲:۱۵",
      isRead: true,
      type: "info",
    },
    {
      id: 3,
      title: "هشدار امنیتی",
      message: "ورود جدیدی به حساب کاربری شما از دستگاه ناشناخته ثبت شد.",
      date: "۱۴۰۵/۰۶/۱۸ - ۰۹:۰۰",
      isRead: false,
      type: "warning",
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="bg-light/50 dark:bg-dark-700/30 p-6 rounded-2xl border border-custom-gray-200 dark:border-custom-gray-400/20 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-purple-300">مدیریت پیام‌ها و اعلان‌ها</h2>
          <p className="text-sm text-gray-400 mt-1">مشاهده و بررسی آخرین اطلاعیه‌ها و پیام‌های سیستم</p>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          className="bg-gray-800 hover:bg-gray-700 text-gray-300 transition px-4 py-2 rounded-xl text-sm font-medium cursor-pointer border border-gray-700/60"
        >
          علامت‌گذاری همه به عنوان خوانده‌شده
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">هیچ پیامی وجود ندارد.</div>
        ) : (
          notifications.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}