"use client";

import ContactAndSocial from "./ContactAndSocial";
import FooterLinks from "./FooterLinks";
import { useSettings } from "@/store/hooks/useSettings";

export default function Footer() {
  const { footerText } = useSettings();

  return (
    <footer className="hidden md:flex mt-auto w-full bg-white dark:bg-[#0f0f12] border-t border-gray-100 dark:border-white/5 pt-12 pb-10 flex-col rtl text-right">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <ContactAndSocial />
        <FooterLinks />

        <div className="flex flex-col items-center justify-center pt-8 mt-8 border-t border-gray-100 dark:border-white/5 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium tracking-wide" dir="rtl">
            {footerText} &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}