"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/store/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";

export function useNotifications() {
  const { token } = useAuth();
  const [notificationCounts, setNotificationCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);

  // گرفتن تعداد نوتیفیکیشن‌های خوانده نشده
  const fetchNotificationCounts = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get("/notifications/counts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.data) {
        setNotificationCounts(res.data.data);
      } else if (res.data) {
        setNotificationCounts(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch notification counts", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNotificationCounts();
  }, [fetchNotificationCounts]);

  // تابع برای خوانده شده کردن نوتیفیکیشن‌های یک بخش خاص
  const markAsReadByType = async (type: string) => {
    if (!token) return;
    try {
      await axiosInstance.post(
        "/notifications/mark-as-read",
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // آپدیت آنی استیت در فرانت‌اند
      setNotificationCounts((prev) => ({
        ...prev,
        [type]: 0,
      }));
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    }
  };

  return {
    notificationCounts,
    loading,
    refetchCounts: fetchNotificationCounts,
    markAsReadByType,
  };
}