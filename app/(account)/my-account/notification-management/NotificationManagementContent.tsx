"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import Select from "@/components/ui/Form/Select";
import Checkbox from "@/components/ui/Form/Checkbox";
import EmptyState from "@/components/ui/emptyState/EmptyState";

interface Recipient {
  id: number;
  name: string;
  username: string;
  email?: string;
}

interface HistoryItem {
  title: string;
  message: string;
  created_at: string;
  recipient_count: number;
}

export default function NotificationManagementContent() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [recipientId, setRecipientId] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");

  const loadData = async () => {
    try {
      const response = await axiosInstance.get("/admin/notifications");
      setRecipients(response.data.recipients || []);
      setHistory(response.data.history || []);
    } catch (error) {
      console.error("Failed to load notification management data", error);
      setFeedback("دریافت اطلاعات مدیریت پیام‌ها ناموفق بود.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSending(true);
    setFeedback("");
    try {
      await axiosInstance.post("/admin/notifications", {
        title,
        message,
        recipient_id: sendToAll ? null : Number(recipientId),
        send_to_all: sendToAll,
      });
      setTitle("");
      setMessage("");
      setRecipientId("");
      setSendToAll(false);
      setFeedback("پیام با موفقیت ارسال شد.");
      await loadData();
    } catch (error: any) {
      console.error("Failed to send notification", error);
      setFeedback(error?.response?.data?.message || "ارسال پیام ناموفق بود.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="مدیریت پیام‌ها"
        description="ارسال پیام مستقیم یا اطلاعیه همگانی برای کاربران"
        icon={<span className="text-2xl">✉</span>}
      />

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-ui-blue-900 sm:p-6">
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
          <Checkbox
            id="send-to-all"
            label="ارسال برای همه کاربران"
            checked={sendToAll}
            onInputHandler={(_, checked) => setSendToAll(checked)}
            activeColor="bg-violet-600 border-violet-600"
          />
          {!sendToAll && (
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
          )}
          <button disabled={sending || loading} className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50 sm:w-fit">
            {sending ? "در حال ارسال..." : "ارسال پیام"}
          </button>
          {feedback && <p className="text-sm text-violet-600 dark:text-violet-300">{feedback}</p>}
        </div>
      </form>

      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-ui-blue-900 sm:p-6">
        <h2 className="mb-4 text-base font-bold">تاریخچه ارسال‌ها</h2>
        <div className="space-y-3">
          {history.length === 0 ? (
            <EmptyState
              tone="blue"
              eyebrow="تاریخچه پیام‌ها"
              title="هنوز پیامی ارسال نشده است"
              description="پیام‌های ارسال‌شده در این بخش نمایش داده می‌شوند."
              icon={<span className="text-3xl">✉</span>}
            />
          ) : history.map((item, index) => (
            <article key={`${item.created_at}-${index}`} className="rounded-xl border border-gray-100 p-3 dark:border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold">{item.title}</h3>
                <span className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleString("fa-IR")} - {item.recipient_count} گیرنده
                </span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">{item.message}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
