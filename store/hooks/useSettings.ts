import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks/storeHooks";
import { getImagePath } from "@/lib/utils";

interface SocialLinkItem {
  name: string;
  url: string;
}

interface ContactInfoItem {
  type: string;
  value: string;
  href: string;
}

interface FooterLinkItem {
  label: string;
  url: string;
}

interface FooterLinkGroup {
  title: string;
  items: FooterLinkItem[];
}

export function useSettings() {
  const { settings = null, loading = false } =
    useAppSelector((state) => state.setting) || {};

  const settingsObject = useMemo(() => {
    if (!settings) return {};

    if (
      typeof settings === "object" &&
      !Array.isArray(settings) &&
      !("data" in settings)
    ) {
      return settings as Record<string, any>;
    }

    const actualArray = Array.isArray(settings)
      ? settings
      : settings &&
          typeof settings === "object" &&
          "data" in settings &&
          Array.isArray((settings as any).data)
        ? (settings as any).data
        : null;

    if (!actualArray) return {};

    return actualArray.reduce((acc: Record<string, any>, item: any) => {
      if (item && item.key) {
        acc[item.key] = item.value || "";
      }
      return acc;
    }, {});
  }, [settings]);

  const siteName = settingsObject?.site_name || "فروشگاه آنلاین شیک شاپ";
  const footerText =
    settingsObject?.footer_text ||
    "تمامی حقوق مادی و معنوی این سایت متعلق به شیک شاپ می‌باشد.";
  const databaseLogoPath = settingsObject?.site_logo || "";

  const socialLinks: SocialLinkItem[] = settingsObject?.social_links || [
    { name: "linkedin", url: "#" },
    { name: "telegram", url: "#" },
    { name: "instagram", url: "#" },
  ];

  const contactInfo: ContactInfoItem[] = useMemo(() => {
    if (
      settingsObject?.contact_info &&
      Array.isArray(settingsObject.contact_info)
    ) {
      const normalizeType = (t: string) => {
        const str = t.toLowerCase();
        if (str.includes("تلفن") || str.includes("phone")) return "phone";
        if (str.includes("ایمیل") || str.includes("email")) return "email";
        if (str.includes("تلگرام") || str.includes("telegram"))
          return "telegram";
        if (str.includes("بله") || str.includes("bale")) return "bale";
        if (str.includes("ایتا") || str.includes("eitaa")) return "eitaa";
        if (str.includes("سروش") || str.includes("soroush")) return "soroush";
        const youtubeVariants = ["یوتیوب", "یوتوب", "youtube"];
  if (youtubeVariants.some(variant => str.includes(variant))) return "youtube";
        return str;
      };

      return settingsObject.contact_info.map((item: any) => {
        const type = normalizeType(item.label || item.type || "");
        const cleanValue = item.value?.replace("@", "") || "";

        const hrefs: Record<string, string> = {
          phone: `tel:${item.value}`,
          email: `mailto:${item.value}`,
          telegram: `https://t.me/${cleanValue}`,
          bale: `https://ble.ir/${cleanValue}`,
          eitaa: `https://eitaa.com/${cleanValue}`,
          soroush: `https://splus.ir/${cleanValue}`,
          youtube: `https://youtube.com/@${cleanValue}`,
          default: "#",
        };

        return {
          type: type,
          value: item.value || "",
          href: hrefs[type] || hrefs.default,
        };
      });
    }

    return [
      { type: "phone", value: "۰۲۱۱۲۳۴۵۶۷۸", href: "tel:02112345678" },
      {
        type: "email",
        value: "info@shikshop.com",
        href: "mailto:info@shikshop.com",
      },
      {
        type: "telegram",
        value: "shikshop_support",
        href: "https://t.me/shikshop_support",
      },
    ];
  }, [settingsObject]);

  const footerLinks: FooterLinkGroup[] = useMemo(() => {
    if (
      settingsObject?.footer_links &&
      Array.isArray(settingsObject.footer_links)
    ) {
      return settingsObject.footer_links;
    }
    return [
      {
        title: "راهنمای خرید",
        items: [
          { label: "قوانین و مقررات", url: "/terms" },
          { label: "رویه بازگرداندن کالا", url: "/returns" },
          { label: "پرسش‌های متداول", url: "/faq" },
        ],
      },
      {
        title: "شیک شاپ",
        items: [
          { label: "درباره ما", url: "/about-us" },
          { label: "تماس با ما", url: "/contact-us" },
          { label: "پشتیبانی / تیکت", url: "/tickets" },
        ],
      },
    ];
  }, [settingsObject]);

  const trustBadges: string =
    settingsObject?.trust_badges ||
    '<a href="#" target="_blank"><img src="/images/Enamad.png" alt="اینماد"></a>';

  const sitePhone = useMemo(() => {
    return (
      contactInfo.find((item) => item.type === "phone")?.value || "۰۲۱۱۲۳۴۵۶۷۸"
    );
  }, [contactInfo]);

  const logoUrl = useMemo(() => {
    if (!databaseLogoPath) return "";
    const rawPath = getImagePath(databaseLogoPath);
    return rawPath.replace(/([^:]\/)\/+/g, "$1");
  }, [databaseLogoPath]);

  return {
    siteName,
    sitePhone,
    footerText,
    logoUrl,
    socialLinks,
    contactInfo,
    footerLinks,
    trustBadges,
    loading,
    rawSettings: settingsObject,
  };
}
