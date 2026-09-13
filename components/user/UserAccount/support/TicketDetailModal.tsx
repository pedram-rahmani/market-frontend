"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import axiosInstance from "@/lib/axiosInstance";

interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any;
  onReplySuccess: (updatedTicket: any) => void;
}

export default function TicketDetailModal({
  isOpen,
  onClose,
  ticket,
  onReplySuccess,
}: TicketDetailModalProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
      onReplySuccess({ ...ticket, messages: newMessages });
      setReplyMessage("");
    } catch (error) {
      console.error("خطا در ارسال پاسخ:", error);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* هدر مدال */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <span className="text-xs text-violet-600 dark:text-violet-400 font-semibold">
              تیکت #{ticket.id}
            </span>
            <h3 className="font-bold text-gray-900 dark:text-white text-base mt-0.5">
              {ticket.subject}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* chat list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {ticket.messages?.map((msg: any, index: number) => {
            const isUserMessage = msg.user_id === ticket.user_id;

            return (
              <div
                key={msg.id || index}
                className={`flex flex-col ${isUserMessage ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                    isUserMessage
                      ? "bg-violet-600 text-white rounded-br-none" // حباب پیام کاربر (راست)
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none" // حباب پیام پشتیبان (چپ)
                  }`}
                >
                  <p>{msg.message}</p>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">
                  {new Date(msg.created_at).toLocaleDateString("fa-IR")}
                </span>
              </div>
            );
          })}
        </div>

        {/* send message form */}
        <form onSubmit={handleSendReply} className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex gap-2">
          <input
            type="text"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="پاسخ خود را بنویسید..."
            className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-800 dark:text-white focus:outline-none focus:border-violet-600 text-right"
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