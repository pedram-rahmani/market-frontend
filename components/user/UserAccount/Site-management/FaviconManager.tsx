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

    const href = getImagePath(favicon, Date.now());

    let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.type = "image/png";
    link.href = href;
  }, [rawSettings]);

  return null;
}