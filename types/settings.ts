export interface SocialItem {
  name: string;
  url: string;
}

export interface ContactItem {
  label: string;
  value: string;
}

export interface SettingsFormData {
  site_name: string;
  footer_text: string;
  social_links: SocialItem[];
  contact_info: ContactItem[];
  trust_badges: string;
  [key: string]: any;
}