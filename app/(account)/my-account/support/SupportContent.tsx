"use client";

import { useState, useEffect } from "react";
import SupportTicketList from "@/components/user/UserAccount/support/SupportTicketList";
import CreateTicketModal from "@/components/user/UserAccount/support/CreateTicketModal";
import TicketDetailModal from "@/components/user/UserAccount/support/TicketDetailModal";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import axiosInstance from "@/lib/axiosInstance";

export default function SupportContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [popup, setPopup] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const fetchTickets = async () => {
    try {
      const response = await axiosInstance.get("/tickets");
      setTickets(response.data);
    } catch (error) {
      console.error("خطا در دریافت تیکت‌ها:", error);
      setPopup({
        isOpen: true,
        message: "خطا در دریافت لیست تیکت‌ها",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (newTicketData: any) => {
    try {
      const response = await axiosInstance.post("/tickets", {
        subject: newTicketData.subject,
        department: newTicketData.department,
        priority: newTicketData.priority,
        message: newTicketData.message,
      });

      setTickets([response.data.ticket, ...tickets]);
      setIsModalOpen(false);
      
      setPopup({
        isOpen: true,
        message: response.data.message || "پیام شما با موفقیت ثبت شد.",
        type: "success",
      });
    } catch (error: any) {
      console.error("خطا در ثبت تیکت:", error);
      setPopup({
        isOpen: true,
        message: error.response?.data?.message || "خطایی در ثبت پیام رخ داد.",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm">
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base">
            پشتیبانی و تیکت‌ها
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            سوالات و مشکلات خود را از طریق تیکت با کارشناسان ما در میان بگذارید.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-xl transition shadow-lg shadow-violet-600/20 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>➕</span>
          <span>ثبت تیکت جدید</span>
        </button>
      </div>

      {/* tickets list */}
      {loading ? (
        <div className="text-center py-8 text-gray-400 text-xs">در حال بارگذاری تیکت‌ها...</div>
      ) : (
        <SupportTicketList
          tickets={tickets}
          onSelectTicket={(ticket) => {
            setSelectedTicket(ticket);
            setIsDetailModalOpen(true);
          }}
        />
      )}

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTicket}
      />

      {/* مدال جزئیات و گفتگو */}
      <TicketDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onReplySuccess={(updatedTicket) => {
          setSelectedTicket(updatedTicket);
          setTickets(tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
        }}
      />

      <SimplePopup
        isOpen={popup.isOpen}
        onClose={() => setPopup((prev) => ({ ...prev, isOpen: false }))}
        message={popup.message}
        type={popup.type}
      />
    </div>
  );
}