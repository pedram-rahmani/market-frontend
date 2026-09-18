import { ReactNode } from "react";
import Link from "next/link";

interface NavItemProps {
  label: string;
  href: string;
  icon: {
    default: ReactNode;
    active: ReactNode;
  };
  active: boolean;
}

export default function NavItem({ label, href, icon, active }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`relative flex flex-1 flex-col items-center justify-center rounded-xl py-1.5 text-[10px] transition-all duration-200 sm:text-xs
        ${
          active
            ? "bg-violet-500/10 font-bold text-violet-600 dark:bg-violet-500/15 dark:text-violet-300"
            : "text-gray-500 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:bg-white/5"
        }
      `}
    >
      {active ? icon.active : icon.default}
      <span className="mt-1 whitespace-nowrap">{label}</span>
    </Link>
  );
}