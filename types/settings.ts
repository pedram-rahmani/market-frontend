export interface SocialItem {
  name: string;
  url: string;
}

export interface ContactItem {
  label: string;
  value: string;
}

export interface TrustBadge {
  image_url: string;
  link_url: string;
  alt: string;
}

export interface FooterLinkItem {
  label: string;
  url: string;
}

export interface FooterLinkGroup {
  title: string;
  items: FooterLinkItem[];
}

export interface SettingsFormData {
  site_name: string;
  footer_text: string;
  social_links: SocialItem[];
  contact_info: ContactItem[];
  trust_badges: TrustBadge;
  footer_links: FooterLinkGroup[];
  [key: string]: any;
}