"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/store/hooks/useAuth";

import LogoUpload from "@/components/user/UserAccount/Site-management/LogoUpload";
import ContactSettings from "@/components/user/UserAccount/Site-management/ContactSettings";
import SocialSettings from "@/components/user/UserAccount/Site-management/SocialSettings";
import FooterLinksSettings from "@/components/user/UserAccount/Site-management/FooterLinksSettings";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import { BaseSkeleton } from "@/components/ui/Skeletons/Skeletons";
import { usePermissions } from "@/store/hooks/usePermissions";
import { PERMISSIONS } from "@/types/permissions";
import {
  SettingsFormData,
  SocialItem,
  ContactItem,
  FooterLinkGroup,
} from "@/types/settings";
import { getPersianErrorMessage, SUCCESS_MESSAGES } from "@/lib/errorMapper";

const DEFAULT_FOOTER_LINKS: FooterLinkGroup[] = [
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
    ],
  },
];

export default function SiteManagementContent() {
  const { token } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [cacheKey, setCacheKey] = useState(Date.now());
  const [popup, setPopup] = useState<{ isOpen: boolean; message: string; type: "success" | "error"; }>({
    isOpen: false, message: "", type: "success",
  });

  const [formData, setFormData] = useState<SettingsFormData>({
    site_name: "",
    footer_text: "",
    social_links: [],
    contact_info: [],
    footer_links: DEFAULT_FOOTER_LINKS,
    trust_badges: {
      image_url: "/images/Enamad.png",
      link_url: "",
      alt: "نماد اعتماد",
    },
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  const { can } = usePermissions();
  const canEdit = can(PERMISSIONS.SETTINGS_EDIT);

  const loadSettings = async () => {
    try {
      const response = await axiosInstance.get("/settings");
      const d = response.data?.data || response.data;
      if (d) {
        setFormData({
          site_name: d.site_name || "",
          footer_text: d.footer_text || "",
          social_links: Array.isArray(d.social_links) ? d.social_links : [],
          contact_info: Array.isArray(d.contact_info) ? d.contact_info : [],
          footer_links: Array.isArray(d.footer_links)
            ? d.footer_links
            : DEFAULT_FOOTER_LINKS,
          trust_badges: {
            image_url: d.trust_badges?.image_url || "/images/Enamad.png",
            link_url: d.trust_badges?.link_url || "",
            alt: d.trust_badges?.alt || "نماد اعتماد",
          },
        });
        if (d.site_logo) setLogoPreview(d.site_logo);
        if (d.site_favicon) setFaviconPreview(d.site_favicon);
      }
    } catch (error) {
      console.error("خطای API:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleFaviconChange = (file: File) => {
    if (faviconPreview?.startsWith("blob:")) URL.revokeObjectURL(faviconPreview);
    setFaviconFile(file);
    setFaviconPreview(URL.createObjectURL(file));
  };

  useEffect(() => { loadSettings(); }, []);

  const handleLogoChange = (file: File) => {
    if (logoPreview?.startsWith('blob:')) URL.revokeObjectURL(logoPreview);
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const updateContactInfo = (index: number, key: keyof ContactItem, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.contact_info];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, contact_info: updated };
    });
  };

  const updateSocialLink = (index: number, key: keyof SocialItem, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.social_links];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, social_links: updated };
    });
  };

  const updateFooterLinks = (footer_links: FooterLinkGroup[]) => {
    setFormData((prev) => ({ ...prev, footer_links }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    if (logoFile) data.append("site_logo", logoFile);
    if (faviconFile) data.append("site_favicon", faviconFile);
    data.append("site_name", formData.site_name);
    data.append("footer_text", formData.footer_text);
    data.append("trust_badges", JSON.stringify(formData.trust_badges));
    data.append("social_links", JSON.stringify(formData.social_links));
    data.append("contact_info", JSON.stringify(formData.contact_info));
    data.append("footer_links", JSON.stringify(formData.footer_links));
    try {
      await axiosInstance.post("/settings", data, { headers: { Authorization: `Bearer ${token}` } });
      setLogoFile(null);
      setFaviconFile(null);
      setCacheKey(Date.now());
      await loadSettings();
      setPopup({ isOpen: true, message: SUCCESS_MESSAGES.siteSettingsSaved, type: "success" });
    } catch (error: any) {
      setPopup({ isOpen: true, message: getPersianErrorMessage(error, "خطا در ذخیره."), type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const displayPreview = logoFile ? logoPreview : (logoPreview ? (logoPreview.startsWith('blob:') ? logoPreview : `${logoPreview}?t=${cacheKey}`) : null);

  return (
    <div className="px-4 md:px-0">
      <PageHeader 
        title="تنظیمات عمومی" 
        buttonText={canEdit ? "ذخیره تغییرات" : undefined} 
        isLoading={submitting} 
        formId="settings-form" 
      />
      
      {isInitialLoading ? (
        <div className="space-y-4">
          <BaseSkeleton className="h-36 w-full rounded-2xl" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <BaseSkeleton className="h-48 w-full rounded-2xl" />
            <BaseSkeleton className="h-48 w-full rounded-2xl" />
            <BaseSkeleton className="h-40 w-full rounded-2xl md:col-span-2" />
          </div>
        </div>
      ) : (
      <form id="settings-form" onSubmit={handleSubmit} className="space-y-6 rtl">
        <LogoUpload 
          disabled={!canEdit}
          preview={displayPreview} 
          onChange={handleLogoChange}
          faviconPreview={faviconPreview}
          onFaviconChange={handleFaviconChange}
          siteName={formData.site_name}
          onSiteNameChange={(val) => setFormData({...formData, site_name: val})}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ContactSettings 
            disabled={!canEdit}
            items={formData.contact_info} 
            onAdd={() => setFormData(p => ({...p, contact_info: [...p.contact_info, {label: "", value: ""}]}))} 
            onRemove={(idx) => setFormData(p => ({...p, contact_info: p.contact_info.filter((_, i) => i !== idx)}))} 
            onUpdate={updateContactInfo} 
          />
          
          <SocialSettings 
            disabled={!canEdit}
            items={formData.social_links} 
            onAdd={() => setFormData(p => ({...p, social_links: [...p.social_links, {name: "", url: ""}]}))} 
            onRemove={(idx) => setFormData(p => ({...p, social_links: p.social_links.filter((_, i) => i !== idx)}))} 
            onUpdate={updateSocialLink} 
          />

          <FooterLinksSettings
            disabled={!canEdit}
            groups={formData.footer_links}
            onChange={updateFooterLinks}
          />
          
          <div className="md:col-span-2 p-6 rounded-2xl border border-custom-gray-200 dark:border-custom-gray-400/20 bg-light/50 dark:bg-dark-700/30 space-y-4">
            <label className="block text-sm font-medium mb-2">نشان اعتماد</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                disabled={!canEdit}
                value={formData.trust_badges.image_url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    trust_badges: {
                      ...prev.trust_badges,
                      image_url: e.target.value,
                    },
                  }))
                }
                placeholder="لینک تصویر نشان"
                className={`input-info ${!canEdit ? "opacity-50 bg-gray-100" : ""}`}
              />
              <input
                disabled={!canEdit}
                value={formData.trust_badges.link_url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    trust_badges: {
                      ...prev.trust_badges,
                      link_url: e.target.value,
                    },
                  }))
                }
                placeholder="لینک مقصد نشان"
                className={`input-info ${!canEdit ? "opacity-50 bg-gray-100" : ""}`}
              />
              <input
                disabled={!canEdit}
                value={formData.trust_badges.alt}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    trust_badges: {
                      ...prev.trust_badges,
                      alt: e.target.value,
                    },
                  }))
                }
                placeholder="متن جایگزین"
                className={`input-info ${!canEdit ? "opacity-50 bg-gray-100" : ""}`}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              فقط لینک تصویر و لینک مقصد ذخیره می‌شود؛ امکان اجرای کد یا اسکریپت وجود ندارد.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">متن کپی‌رایت فوتر</label>
            <textarea 
              disabled={!canEdit}
              rows={3} 
              value={formData.footer_text} 
              onChange={(e) => setFormData({...formData, footer_text: e.target.value})} 
              className={`input-info ${!canEdit ? 'opacity-50 bg-gray-100' : ''}`} 
            />
          </div>
        </div>
      </form>
      )}
      
      <SimplePopup 
        isOpen={popup.isOpen} 
        message={popup.message} 
        type={popup.type} 
        onClose={() => setPopup({...popup, isOpen: false})} 
      />
    </div>
  );
}