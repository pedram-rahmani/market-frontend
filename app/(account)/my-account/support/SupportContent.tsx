"use client";

import { useState, useEffect } from "react";
import SupportTicketList from "@/components/user/UserAccount/support/SupportTicketList";
import CreateTicketModal from "@/components/user/UserAccount/support/CreateTicketModal";
import TicketDetailModal from "@/components/user/UserAccount/support/TicketDetailModal";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import axiosInstance from "@/lib/axiosInstance";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import { getPersianErrorMessage, SUCCESS_MESSAGES } from "@/lib/errorMapper";

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
        message: getPersianErrorMessage(error, "خطا در دریافت لیست تیکت‌ها"),
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
        message: response.data.message || SUCCESS_MESSAGES.ticketCreated,
        type: "success",
      });
    } catch (error: any) {
      console.error("خطا در ثبت تیکت:", error);
      setPopup({
        isOpen: true,
        message: getPersianErrorMessage(error, "خطایی در ثبت پیام رخ داد."),
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="پشتیبانی و تیکت‌ها"
        description="سوالات و مشکلات خود را از طریق تیکت با کارشناسان ما در میان بگذارید."
        onButtonClick={() => setIsModalOpen(true)}
        buttonText="ثبت تیکت جدید"
        icon={
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5a8.5 8.5 0 0 1 17 0v3.25a2.25 2.25 0 0 1-2.25 2.25H16l-3.2 3.2a1.125 1.125 0 0 1-1.925-.796V17H6.25A3.25 3.25 0 0 1 3 13.75V11.5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h.01M12 11h.01M16 11h.01" />
          </svg>
        }
      />

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