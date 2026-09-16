"use client";

import Link from "next/link";
import { useSettings } from "@/store/hooks/useSettings";

export default function FooterLinks() {
  const { footerLinks, trustBadges } = useSettings();

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-8 rtl text-right px-4 sm:px-6">
      {/* Footer Link Groups */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 flex-1 w-full">
        {footerLinks?.map((group, index) => (
          <div key={index} className="flex flex-col gap-y-4">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {group.title}
            </span>
            <div className="flex flex-col gap-y-3 text-sm text-gray-500 dark:text-gray-400">
              {group.items?.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  href={link.url || "#"}
                  className="hover:text-green-500 hover:-translate-x-1 transition-all duration-300 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Trust Badges Container (Enamad / Samandehi) */}
      <div className="flex justify-center lg:justify-end items-start w-full lg:w-auto shrink-0 pt-2">
        <div 
          className="w-32 h-32 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-800/60 backdrop-blur-sm p-4 flex items-center justify-center hover:scale-105 transition-transform duration-300 [&>a]:w-full [&>a]:h-full [&>a]:flex [&>a]:items-center [&>a]:justify-center [&_img]:object-contain [&_img]:max-h-full"
          dangerouslySetInnerHTML={{ __html: trustBadges || "" }}
        />
      </div>
    </div>
  );
}