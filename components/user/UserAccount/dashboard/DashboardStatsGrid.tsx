import Link from "next/link";
import { SkeletonCard } from "@/components/ui/Skeletons/Skeletons";
import { openLiveChat } from "@/lib/chatEvents";

interface DashboardStatsGridProps {
  loading: boolean;
  stats: {
    order_count: number;
    unread_chat_count: number;
    wallet_balance: number;
  };
}

export default function DashboardStatsGrid({ loading, stats }: DashboardStatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:gap-4">
      <DashboardCard
        title="سفارشات من"
        value={`${stats.order_count} مورد`}
        link="/my-account/purchases"
        icon={
          <svg viewBox="0 0 24 24" className="size-5! text-violet-500">
            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        }
      />
      <DashboardCard
        title="موجودی کیف پول"
        value={`${(stats.wallet_balance || 0).toLocaleString()} تومان`}
        link="/my-account/transactions"
        icon={
          <svg viewBox="0 0 24 24" className="size-5! text-emerald-500">
            <path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4M4 6v12a2 2 0 002 2h14v-4M18 12a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        }
      />
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  link?: string;
  onClick?: () => void;
}

function DashboardCard({ title, value, link, onClick, icon }: DashboardCardProps) {
  const className =
    "group flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-violet-500/50 dark:border-white/5 dark:bg-ui-blue-900 dark:hover:border-violet-500/50 sm:p-5";

  const content = (
    <>
      <div className="min-w-0 space-y-1">
        <p className="truncate text-xs text-gray-500 dark:text-gray-400">{title}</p>
        <p className="break-words text-sm font-bold text-gray-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400 sm:text-lg">
          {value}
        </p>
      </div>
      <div className="shrink-0 rounded-xl bg-gray-50 p-2.5 transition-colors group-hover:bg-violet-50 dark:bg-dark-800 dark:group-hover:bg-violet-500/10 sm:p-3">
        {icon}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${className} text-right`}>
        {content}
      </button>
    );
  }

  return (
    <Link href={link || "#"} className={className}>
      {content}
    </Link>
  );
}