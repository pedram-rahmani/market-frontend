"use client";

import Image from "next/image";
import Link from "next/link";
import { useSettings } from "@/store/hooks/useSettings";
import { ICONS } from "./SocialIcons";

export default function ContactAndSocial() {
  const { logoUrl, siteName, socialLinks, contactInfo } = useSettings();

  return (
    <div className="pb-8 mb-8 border-b border-gray-200 dark:border-b-white/10 rtl px-4 sm:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link href="/" className="relative flex items-center h-10 w-32">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={siteName || "Logo"}
              fill
              unoptimized
              priority
              className="object-contain object-right"
            />
          ) : (
            <span className="text-lg tracking-wider text-my-Txt2 dark:text-my-Txt1 font-bold">
              {siteName}
            </span>
          )}
        </Link>

        {/* Social Media Links */}
        <div className="flex gap-x-4 [&>a]:flex [&>a]:items-center [&>a]:justify-center [&>a]:w-6 [&>a]:h-6 [&>a_svg]:w-full [&>a_svg]:h-full [&>a_svg]:block text-gray-600 dark:text-gray-300">
          {socialLinks.map((social, index) => {
            const icon = ICONS[social.name.toLowerCase()] || ICONS.default;
            return (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-500 duration-200"
              >
                {icon}
              </a>
            );
          })}
        </div>
      </div>

      {/* Contact Info Links */}
      <div className="flex items-center flex-wrap justify-between gap-y-4 gap-x-8 mt-8">
        {contactInfo.map((contact, index) => {
          const icon = ICONS[contact.type.toLowerCase()] || ICONS.default;
          return (
            <a
              key={index}
              href={contact.href}
              className="flex items-center gap-x-2 text-sm dark:text-neutral-300 text-gray-600 hover:text-green-500 duration-200"
            >
              <div className="flex items-center w-5 h-5 shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:block text-green-500">
                {icon}
              </div>
              <span dir="ltr" className="pt-1">{contact.value}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}