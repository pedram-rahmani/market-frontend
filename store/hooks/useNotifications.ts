"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/store/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";

const NOTIFICATION_ROUTES: Record<string, string> = {
  // admin
  "user-management": "/my-account/user-management",
  "product-management": "/my-account/product-management",
  "category-management": "/my-account/category-management",
  "coupon-management": "/my-account/coupon-management",
  "site-management": "/my-account/site-management",
  "user-interactions": "/my-account/user-interactions",
  "chat-management": "/my-account/chat-management",
  
  // user
  "notifications": "/my-account/notifications",
  "purchases": "/my-account/purchases",
  "wishlist": "/my-account/wishlist",
  "transactions": "/my-account/transactions",
};

export function useNotifications() {
  const { token } = useAuth();
  const pathname = usePathname();
  const [notificationCounts, setNotificationCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchNotificationCounts = useCallback(async () => {
    if (!token) return;
    try {
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
    }
  }, [token]);

  // initial load and polling for new notifications every 30 seconds (polling)
  useEffect(() => {
    if (!token) return;
    
    fetchNotificationCounts();

    const interval = setInterval(() => {
      fetchNotificationCounts();
    }, 30000);

    return () => clearInterval(interval);
  }, [token, fetchNotificationCounts]);

  const markAsReadByType = useCallback(async (type: string) => {
    if (!token) return;
    
    setNotificationCounts((prev) => {
      if (!prev[type] || prev[type] === 0) return prev;
      return { ...prev, [type]: 0 };
    });

    try {
      await axiosInstance.post(
        "/notifications/mark-as-read",
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
      fetchNotificationCounts();
    }
  }, [token, fetchNotificationCounts]);

  useEffect(() => {
    if (!token) return;

    Object.entries(NOTIFICATION_ROUTES).forEach(([type, route]) => {
      const isActive = route === "/my-account" ? pathname === route : pathname.startsWith(route);
      
      if (isActive && (notificationCounts[type] || 0) > 0) {
        markAsReadByType(type);
      }
    });
  }, [pathname, notificationCounts, markAsReadByType, token]);

  return {
    notificationCounts,
    loading,
    refetchCounts: fetchNotificationCounts,
    markAsReadByType,
  };
}