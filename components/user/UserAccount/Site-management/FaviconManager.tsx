"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks/storeHooks";
import { fetchSettings } from "@/store/slices/settingSlice";
import { useSettings } from "@/store/hooks/useSettings";
import { getImagePath } from "@/lib/utils";

export default function FaviconManager() {
  const dispatch = useAppDispatch();
  const { rawSettings } = useSettings();

  useEffect(() => {
    void dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    const favicon = rawSettings?.site_favicon;
    if (!favicon) return;

    const href = getImagePath(
      favicon,
      rawSettings?.site_favicon_updated_at || favicon,
    );

    // ۱. پیدا کردن اولین تگ icon در صفحه (برای جایگزینی دقیق)
    let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");

    if (!link) {
      // اگر اصلاً وجود نداشت، می‌سازیم
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    // ۲. آپدیت کردن آدرسِ تگ موجود
    link.type = "image/png";
    link.href = href;
  }, [rawSettings]);

  return null;
}