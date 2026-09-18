import Link from "next/link";
import { ReactNode } from "react";

type EmptyStateTone = "violet" | "pink" | "blue" | "amber" | "red" | "gray";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  eyebrow?: string;
  actionLabel?: string;
  actionHref?: string;
  tone?: EmptyStateTone;
}

const toneStyles: Record<
  EmptyStateTone,
  { glow: string; icon: string; badge: string; button: string }
> = {
  violet: {
    glow: "bg-violet-500/10",
    icon: "bg-violet-50 text-violet-600 dark:bg-violet-500/10",
    badge: "bg-violet-500/10 text-violet-500",
    button: "bg-violet-600 shadow-violet-600/20 hover:bg-violet-700",
  },
  pink: {
    glow: "bg-pink-500/10",
    icon: "bg-pink-50 text-pink-500 dark:bg-pink-500/10",
    badge: "bg-pink-500/10 text-pink-500",
    button: "bg-pink-500 shadow-pink-500/20 hover:bg-pink-600",
  },
  blue: {
    glow: "bg-blue-500/10",
    icon: "bg-blue-50 text-blue-500 dark:bg-blue-500/10",
    badge: "bg-blue-500/10 text-blue-500",
    button: "bg-blue-600 shadow-blue-600/20 hover:bg-blue-700",
  },
  amber: {
    glow: "bg-amber-500/10",
    icon: "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
    badge: "bg-amber-500/10 text-amber-500",
    button: "bg-amber-500 shadow-amber-500/20 hover:bg-amber-600",
  },
  red: {
    glow: "bg-red-500/10",
    icon: "bg-red-50 text-red-500 dark:bg-red-500/10",
    badge: "bg-red-500/10 text-red-500",
    button: "bg-red-500 shadow-red-500/20 hover:bg-red-600",
  },
  gray: {
    glow: "bg-gray-500/10",
    icon: "bg-gray-100 text-gray-500 dark:bg-gray-500/10",
    badge: "bg-gray-500/10 text-gray-500",
    button: "bg-gray-600 shadow-gray-600/20 hover:bg-gray-700",
  },
};

export default function EmptyState({
  icon,
  title,
  description,
  eyebrow,
  actionLabel,
  actionHref,
  tone = "violet",
}: EmptyStateProps) {
  const styles = toneStyles[tone];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-ui-blue-900 md:p-14">
      <div className={`pointer-events-none absolute -right-20 -top-24 size-64 rounded-full blur-3xl ${styles.glow}`} />
      <div className={`pointer-events-none absolute -bottom-24 -left-20 size-64 rounded-full blur-3xl ${styles.glow}`} />

      <div className="relative mx-auto flex max-w-lg flex-col items-center text-center">
        <div className={`mb-6 flex size-24 items-center justify-center rounded-[2rem] shadow-inner ${styles.icon}`}>
          {icon}
        </div>

        {eyebrow && (
          <span className={`mb-3 rounded-full px-3 py-1 text-[11px] font-bold ${styles.badge}`}>
            {eyebrow}
          </span>
        )}
        <h2 className="text-xl font-black text-gray-800 dark:text-white md:text-2xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}

        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className={`mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white shadow-lg transition ${styles.button}`}
          >
            <span>{actionLabel}</span>
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7 7-7-7 7-7" />
            </svg>
          </Link>
        )}
      </div>
    </section>
  );
}
