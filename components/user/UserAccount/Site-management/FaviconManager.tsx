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

    const href = getImagePath(favicon);
    let link = document.querySelector<HTMLLinkElement>("link[data-site-favicon]");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.dataset.siteFavicon = "true";
      document.head.appendChild(link);
    }
    link.href = href;
  }, [rawSettings]);

  return null;
}
