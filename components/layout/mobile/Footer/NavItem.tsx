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
      className={`flex-1 flex flex-col items-center justify-center relative text-xs transition-all duration-200 py-1.5
        ${
          active
            ? "text-ui-blue-600 bg-ui-blue-300/10 dark:text-ui-blue-300 dark:bg-ui-blue-800/50 rounded-full font-bold"
            : "text-text-on-light dark:text-text-on-dark"
        }
      `}
    >
      {active ? icon.active : icon.default}
      <span className="mt-1">{label}</span>
    </Link>
  );
}