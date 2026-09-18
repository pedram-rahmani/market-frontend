"use client";

import { useEffect, useState } from "react";
import NotificationRow from "@/components/user/UserAccount/notification-management/NotificationRow";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import EmptyState from "@/components/ui/emptyState/EmptyState";
import axiosInstance from "@/lib/axiosInstance";
import { useNotifications } from "@/store/hooks/useNotifications";

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: "info" | "success" | "warning";
}

export default function NotificationManagementContent() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { refetchCounts } = useNotifications();

  useEffect(() => {
    axiosInstance
      .get("/notifications")
      .then((response) => {
        const items = response.data?.data?.data || [];
        setNotifications(
          items.map((item: { id: number; title: string; message: string; created_at: string; is_read: boolean; type: string }) => ({
            id: item.id,
            title: item.title,
            message: item.message,
            date: new Date(item.created_at).toLocaleString("fa-IR"),
            isRead: item.is_read,
            type: item.type === "support"
              ? "warning"
              : item.type === "user-interactions"
                ? "success"
                : "info",
          })),
        );
      })
      .catch((error) => {
        console.error("Failed to fetch notifications", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      await axiosInstance.post("/notifications/mark-as-read");
      setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })));
      await refetchCounts();
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications((current) => current.filter((notification) => notification.id !== id));
      await refetchCounts();
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="پیام‌ها"
        description="مشاهده آخرین اطلاعیه‌ها و پیام‌های شما"
        buttonText="علامت‌گذاری همه به عنوان خوانده‌شده"
        canClick={!loading && notifications.some((notification) => !notification.isRead)}
        onButtonClick={handleMarkAllAsRead}
        icon={
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 0 0-12 0v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
        }
      />

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 dark:border-white/5 dark:bg-ui-blue-900">
            در حال دریافت اعلان‌ها...
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            tone="blue"
            eyebrow="اعلان‌ها"
            title="هیچ پیامی وجود ندارد"
            description="اعلان‌ها و اطلاعیه‌های جدید شما در این بخش نمایش داده می‌شوند."
            icon={
              <svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 0 0-12 0v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            }
          />
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