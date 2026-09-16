import Link from "next/link";
import { SkeletonCard } from "@/components/ui/Skeletons/Skeletons";

interface DashboardStatsGridProps {
  loading: boolean;
  stats: {
    order_count: number;
    ticket_count: number;
    wallet_balance: number;
  };
}

export default function DashboardStatsGrid({ loading, stats }: DashboardStatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        title="تیکت‌های پشتیبانی"
        value={`${stats.ticket_count} مورد`}
        link="/my-account/support"
        icon={
          <svg viewBox="0 0 24 24" className="size-5! text-blue-500">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
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
  link: string;
  icon: React.ReactNode;
}

function DashboardCard({ title, value, link, icon }: DashboardCardProps) {
  return (
    <Link
      href={link}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl shadow-sm hover:border-violet-500/50 dark:hover:border-violet-500/50 transition-all group flex items-center justify-between"
    >
      <div className="space-y-1">
        <p className="text-gray-500 dark:text-gray-400 text-xs">{title}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {value}
        </p>
      </div>
      <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 group-hover:bg-violet-50 dark:group-hover:bg-violet-500/10 transition-colors">
        {icon}
      </div>
    </Link>
  );
}