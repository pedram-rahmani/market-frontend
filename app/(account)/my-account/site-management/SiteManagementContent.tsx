"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/store/hooks/useAuth";
import { fetchSettings } from "@/store/slices/settingSlice";

import LogoUpload from "@/components/user/UserAccount/Site-management/LogoUpload";
import ContactSettings from "@/components/user/UserAccount/Site-management/ContactSettings";
import SocialSettings from "@/components/user/UserAccount/Site-management/SocialSettings";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import { usePermissions } from "@/store/hooks/usePermissions";
import { PERMISSIONS } from "@/types/permissions";
import { SettingsFormData, SocialItem, ContactItem } from "@/types/settings"; // ایمپورت تایپ‌های گلوبال

export default function SiteManagementContent() {
  const { token } = useAuth();
  const dispatch = useDispatch();
  const [submitting, setSubmitting] = useState(false);
  const [cacheKey, setCacheKey] = useState(Date.now());
  const [popup, setPopup] = useState<{ isOpen: boolean; message: string; type: "success" | "error"; }>({
    isOpen: false, message: "", type: "success",
  });

  const [formData, setFormData] = useState<SettingsFormData>({
    site_name: "", footer_text: "", social_links: [], contact_info: [], trust_badges: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { can } = usePermissions();
  const canEdit = can(PERMISSIONS.SETTINGS_EDIT);

  const loadSettings = async () => {
    try {
      const response = await axiosInstance.get("/settings");
      const d = response.data;
      if (d) {
        setFormData({
          site_name: d.site_name || "",
          footer_text: d.footer_text || "",
          social_links: Array.isArray(d.social_links) ? d.social_links : [],
          contact_info: Array.isArray(d.contact_info) ? d.contact_info : [],
          trust_badges: d.trust_badges || "",
        });
        if (d.site_logo) setLogoPreview(d.site_logo);
      }
    } catch (error) { console.error("خطای API:", error); }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    if (logoFile) data.append("site_logo", logoFile);
    data.append("site_name", formData.site_name);
    data.append("footer_text", formData.footer_text);
    data.append("trust_badges", formData.trust_badges);
    data.append("social_links", JSON.stringify(formData.social_links));
    data.append("contact_info", JSON.stringify(formData.contact_info));
    try {
      await axiosInstance.post("/settings", data, { headers: { Authorization: `Bearer ${token}` } });
      setLogoFile(null);
      setCacheKey(Date.now());
      // @ts-ignore
      dispatch(fetchSettings());
      setPopup({ isOpen: true, message: "تنظیمات با موفقیت ذخیره شدند.", type: "success" });
    } catch (error: any) {
      setPopup({ isOpen: true, message: "خطا در ذخیره.", type: "error" });
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
      
      <form id="settings-form" onSubmit={handleSubmit} className="space-y-6 rtl">
        <LogoUpload 
          disabled={!canEdit}
          preview={displayPreview} 
          onChange={handleLogoChange}
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
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">کد و اسکریپت‌های مجوزها</label>
            <textarea 
              disabled={!canEdit}
              rows={4} 
              value={formData.trust_badges} 
              onChange={(e) => setFormData({...formData, trust_badges: e.target.value})} 
              className={`input-info ${!canEdit ? 'opacity-50 bg-gray-100' : ''}`} 
            />
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
      
      <SimplePopup 
        isOpen={popup.isOpen} 
        message={popup.message} 
        type={popup.type} 
        onClose={() => setPopup({...popup, isOpen: false})} 
      />
    </div>
  );
}