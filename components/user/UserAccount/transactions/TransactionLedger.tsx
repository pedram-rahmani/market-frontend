import { BaseSkeleton } from "@/components/ui/Skeletons/Skeletons";
import EmptyState from "@/components/ui/emptyState/EmptyState";

interface Transaction {
  amount: number;
  type: "deposit" | "withdraw" | "purchase";
  status: string;
  description: string;
  ref_id: string;
  date: string;
}

interface TransactionLedgerProps {
  loading: boolean;
  transaction?: Transaction | null;
}

export default function TransactionLedger({ loading, transaction }: TransactionLedgerProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        آخرین تراکنش
      </h3>
      {loading ? (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between animate-pulse">
          <div className="space-y-2">
            <BaseSkeleton className="w-32 h-4" />
            <BaseSkeleton className="w-24 h-3" />
          </div>
          <BaseSkeleton className="w-20 h-6" />
        </div>
      ) : transaction ? (
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 text-xs rounded font-medium ${
                  transaction.type === "deposit" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}
              >
                {transaction.type === "deposit" ? "واریز" : "برداشت"}
              </span>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {transaction.description || "بدون توضیحات"}
              </span>
            </div>
            <div className="text-xs text-gray-400">
              کد پیگیری: <span className="font-mono">{transaction.ref_id}</span>
            </div>
          </div>
          <div className="text-left">
            <div
              className={`text-base font-bold ${
                transaction.type === "deposit" ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {transaction.type === "deposit" ? "+" : "-"}
              {transaction.amount.toLocaleString()} تومان
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(transaction.date).toLocaleDateString("fa-IR")}
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          tone="blue"
          eyebrow="تراکنش‌ها"
          title="هنوز تراکنشی ثبت نشده است"
          description="با انجام اولین واریز یا خرید، سوابق تراکنش‌های شما در این بخش نمایش داده خواهد شد."
          icon={
            <svg viewBox="0 0 24 24" className="size-10!">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M18 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
            </svg>
          }
        />
      )}
    </div>
  );
}