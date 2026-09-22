"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import axiosInstance from "@/lib/axiosInstance";
import Select from "@/components/ui/Form/Select";
import { getPersianErrorMessage } from "@/lib/errorMapper";

interface AdminTicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
  onUpdate: (updatedTicket: any) => void;
  onError: (message: string) => void;
}

const statusOptions = [
  { value: "open", label: "باز" },
  { value: "pending", label: "در انتظار پاسخ" },
  { value: "closed", label: "بسته شده" },
];

export default function AdminTicketDetailModal({
  isOpen,
  onClose,
  ticket,
  onUpdate,
  onError,
}: AdminTicketDetailModalProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  if (!isOpen || !ticket) return null;

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/tickets/${ticket.id}/reply`, {
        message: replyMessage,
      });

      const newMessages = [...(ticket.messages || []), response.data.data];
      onUpdate({ ...ticket, messages: newMessages });
      setReplyMessage("");
    } catch (error) {
      onError(getPersianErrorMessage(error, "خطا در ارسال پاسخ."));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === ticket.status) return;

    setStatusLoading(true);
    try {
      const response = await axiosInstance.patch(`/admin/tickets/${ticket.id}/status`, {
        status: newStatus,
      });
      onUpdate(response.data.ticket);
    } catch (error) {
      onError(getPersianErrorMessage(error, "خطا در تغییر وضعیت تیکت."));
    } finally {
      setStatusLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-ui-blue-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50 dark:bg-white/[0.03]">
          <div className="min-w-0">
            <span className="text-xs text-violet-600 dark:text-violet-400 font-semibold">
              تیکت #{ticket.id} — {ticket.user?.name} ({ticket.user?.username})
            </span>
            <h3 className="font-bold text-gray-900 dark:text-white text-base mt-0.5 truncate">
              {ticket.subject}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-36">
              <Select
                options={statusOptions}
                value={ticket.status}
                onChange={handleStatusChange}
                variant="simple"
                disabled={statusLoading}
              />
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* chat list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {ticket.messages?.map((msg: any, index: number) => {
            const isUserMessage = msg.user_id === ticket.user_id;

            return (
              <div
                key={msg.id || index}
                className={`flex flex-col ${isUserMessage ? "items-start" : "items-end"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                    isUserMessage
                      ? "bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-200 rounded-bl-none"
                      : "bg-violet-600 text-white rounded-br-none"
                  }`}
                >
                  <p>{msg.message}</p>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {isUserMessage ? ticket.user?.name : msg.user?.name || "پشتیبانی"} ·{" "}
                  {new Date(msg.created_at).toLocaleDateString("fa-IR")}
                </span>
              </div>
            );
          })}
        </div>

        {/* send message form */}
        <form onSubmit={handleSendReply} className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] flex gap-2">
          <input
            type="text"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="پاسخ خود را بنویسید..."
            className="flex-1 px-4 py-2.5 bg-white dark:bg-ui-blue-900 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-800 dark:text-white focus:outline-none focus:border-violet-600 text-right"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "در حال ارسال..." : "ارسال"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
