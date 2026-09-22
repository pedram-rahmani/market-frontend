"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import Select from "@/components/ui/Form/Select";
import Checkbox from "@/components/ui/Form/Checkbox";
import EmptyState from "@/components/ui/emptyState/EmptyState";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import DeleteConfirmModal from "@/components/feedback/MessageModal/DeleteConfirmModal";
import { getPersianErrorMessage, SUCCESS_MESSAGES } from "@/lib/errorMapper";

interface Recipient {
  id: number;
  name: string;
  username: string;
  email?: string;
  role?: string;
}

interface HistoryItem {
  title: string;
  message: string;
  level: "info" | "success" | "warning" | null;
  created_at: string;
  recipient_count: number;
  send_to_all: boolean;
  recipients?: { name: string; username: string }[];
}

export default function NotificationManagementContent() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [recipientId, setRecipientId] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [level, setLevel] = useState<"info" | "success" | "warning">("info");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [popup, setPopup] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({
    isOpen: false,
    message: "",
    type: "success",
  });
  const [expandedHistoryKey, setExpandedHistoryKey] = useState<string | null>(null);
  const [deleteHistoryOpen, setDeleteHistoryOpen] = useState(false);
  const [deletingHistory, setDeletingHistory] = useState(false);

  const loadData = async () => {
    try {
      const response = await axiosInstance.get("/admin/notifications");
      setRecipients(
        (response.data.recipients || []).filter(
          (recipient: Recipient) => recipient.role?.trim().toLowerCase() !== "admin",
        ),
      );
      setHistory(response.data.history || []);
    } catch (error) {
      console.error("Failed to load notification management data", error);
      setPopup({
        isOpen: true,
        message: getPersianErrorMessage(error, "دریافت اطلاعات مدیریت پیام‌ها ناموفق بود."),
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!sendToAll && !recipientId) {
      setPopup({
        isOpen: true,
        message: "لطفاً یک گیرنده انتخاب کنید یا گزینه «ارسال برای همه کاربران» را فعال کنید.",
        type: "error",
      });
      return;
    }
    setSending(true);
    try {
      await axiosInstance.post("/admin/notifications", {
        title,
        message,
        level,
        recipient_id: sendToAll || !recipientId ? null : Number(recipientId),
        send_to_all: sendToAll,
      });
      setTitle("");
      setMessage("");
      setLevel("info");
      setRecipientId("");
      setSendToAll(false);
      setPopup({ isOpen: true, message: SUCCESS_MESSAGES.notificationSent, type: "success" });
      await loadData();
    } catch (error: any) {
      console.error("Failed to send notification", error);
      setPopup({
        isOpen: true,
        message: getPersianErrorMessage(error, "ارسال پیام ناموفق بود."),
        type: "error",
      });
    } finally {
      setSending(false);
    }
  };

  const handleClearHistory = async () => {
    setDeletingHistory(true);
    try {
      await axiosInstance.delete("/admin/notifications");
      setHistory([]);
      setExpandedHistoryKey(null);
      setPopup({ isOpen: true, message: "تاریخچه پیام‌ها حذف شد.", type: "success" });
    } catch (error) {
      console.error("Failed to clear notification history", error);
      setPopup({
        isOpen: true,
        message: getPersianErrorMessage(error, "حذف تاریخچه پیام‌ها ناموفق بود."),
        type: "error",
      });
    } finally {
      setDeletingHistory(false);
      setDeleteHistoryOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="مدیریت پیام‌ها"
        description="ارسال پیام مستقیم یا اطلاعیه همگانی برای کاربران"
        icon={<span className="text-2xl">✉</span>}
      />

      <form onSubmit={handleSubmit} className="relative z-20 rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-ui-blue-900">
        <div className="border-b border-gray-100 bg-gradient-to-l from-violet-500/10 to-transparent px-4 py-4 dark:border-white/5 sm:px-6">
          <h2 className="font-bold">ارسال پیام جدید</h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">نوع پیام و گیرنده را مشخص کنید.</p>
        </div>
        <div className="p-4 sm:p-6">
        <div className="grid gap-4">
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="عنوان پیام"
            className="input-info w-full"
          />
          <textarea
            required
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="متن پیام"
            rows={5}
            className="input-info w-full resize-y"
          />
          <div className="grid gap-2 sm:grid-cols-3">
            {([
              ["info", "اطلاع‌رسانی"],
              ["success", "موفقیت"],
              ["warning", "هشدار"],
            ] as const).map(([value, label]) => (
              <label
                key={value}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-xs transition ${
                  level === value
                    ? "border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-300"
                    : "border-gray-200 text-gray-500 dark:border-white/10 dark:text-gray-400"
                }`}
              >
                <input
                  type="radio"
                  name="notification-level"
                  value={value}
                  checked={level === value}
                  onChange={() => setLevel(value)}
                  className="accent-violet-600"
                />
                {label}
              </label>
            ))}
          </div>
          <Checkbox
            id="send-to-all"
            label="ارسال برای همه کاربران"
            checked={sendToAll}
            onInputHandler={(_, checked) => setSendToAll(checked)}
            activeColor="bg-violet-600 border-violet-600"
          />
          {!sendToAll && (
            <div className="max-w-md">
              <Select
                variant="simple"
                value={recipientId}
                onChange={setRecipientId}
                placeholder="انتخاب گیرنده"
                options={recipients.map((recipient) => ({
                  value: String(recipient.id),
                  label: `${recipient.name} (${recipient.username})`,
                }))}
              />
            </div>
          )}
          <button disabled={sending || loading} className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50 sm:w-fit">
            {sending ? "در حال ارسال..." : "ارسال پیام"}
          </button>
        </div>
        </div>
      </form>

      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-ui-blue-900 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold">تاریخچه ارسال‌ها</h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">پیام‌های ارسال‌شده در این بخش ثبت می‌شوند.</p>
          </div>
          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-300">
            {loading ? "در حال بارگذاری" : `${history.length} پیام`}
          </span>
        </div>
        {!loading && history.length > 0 && (
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => setDeleteHistoryOpen(true)}
              className="rounded-xl border border-danger/20 px-3 py-2 text-xs font-semibold text-danger transition hover:bg-danger/10"
            >
              پاک کردن تاریخچه
            </button>
          </div>
        )}
        <div className="grid gap-3">
          {loading ? (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-4 text-center dark:border-white/10 dark:bg-white/[0.03]">
              <span className="mb-3 size-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
              <p className="font-semibold text-gray-700 dark:text-gray-200">در حال دریافت تاریخچه ارسال‌ها...</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">لطفاً کمی صبر کنید.</p>
            </div>
          ) : history.length === 0 ? (
            <EmptyState
              tone="blue"
              eyebrow="تاریخچه پیام‌ها"
              title="هنوز پیامی ارسال نشده است"
              description="پیام‌های ارسال‌شده در این بخش نمایش داده می‌شوند."
              icon={<span className="text-3xl">✉</span>}
            />
          ) : history.map((item, index) => (
            <article key={`${item.created_at}-${index}`} className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className={`absolute inset-y-0 right-0 w-1 ${item.level === "success" ? "bg-emerald-500" : item.level === "warning" ? "bg-amber-500" : "bg-violet-500"}`} />
              <div className="flex flex-wrap items-start justify-between gap-3 pr-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{item.title}</h3>
                  <span className="rounded-full bg-violet-500/10 px-2 py-1 text-[10px] text-violet-600 dark:text-violet-300">
                    {item.level === "success" ? "موفقیت" : item.level === "warning" ? "هشدار" : "اطلاع‌رسانی"}
                  </span>
                </div>
                <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString("fa-IR")}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap pr-3 text-sm leading-7 text-gray-600 dark:text-gray-300">{item.message}</p>
                  <div className="mt-4 border-t border-gray-200 pt-3 pr-3 text-xs dark:border-white/10">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const historyKey = `${item.created_at}-${index}`;
                          setExpandedHistoryKey((current) => current === historyKey ? null : historyKey);
                        }}
                        className="mr-auto rounded-lg border border-violet-200 px-2.5 py-1.5 font-semibold text-violet-600 transition hover:bg-violet-50 dark:border-violet-400/20 dark:text-violet-300 dark:hover:bg-violet-400/10"
                      >
                        {expandedHistoryKey === `${item.created_at}-${index}` ? "بستن گیرندگان" : "مشاهده گیرندگان"}
                      </button>
                    </div>
                    {expandedHistoryKey === `${item.created_at}-${index}` && (
                      <div className="mt-3 flex flex-wrap gap-1.5 rounded-xl bg-gray-100/70 p-2 dark:bg-white/[0.04]">
                        {(item.recipients ?? []).length > 0 ? (
                          item.recipients?.map((recipient) => (
                            <span key={recipient.username} className="rounded-md bg-white px-2 py-1 text-gray-600 shadow-sm dark:bg-white/10 dark:text-gray-300">
                              {recipient.name} ({recipient.username})
                            </span>
                          ))
                        ) : (
                          <span className="px-1 py-1 text-gray-500 dark:text-gray-400">
                            اطلاعات گیرندگان پس از به‌روزرسانی backend در دسترس خواهد بود.
                          </span>
                        )}
                      </div>
                    )}
                  </div>
            </article>
          ))}
        </div>
      </section>
      <SimplePopup
        isOpen={popup.isOpen}
        onClose={() => setPopup((current) => ({ ...current, isOpen: false }))}
        message={popup.message}
        type={popup.type}
      />
      <DeleteConfirmModal
        isOpen={deleteHistoryOpen}
        onClose={() => setDeleteHistoryOpen(false)}
        onConfirm={handleClearHistory}
        title="حذف کامل تاریخچه پیام‌های مدیریتی"
        isDeleting={deletingHistory}
      />
    </div>
  );
}
