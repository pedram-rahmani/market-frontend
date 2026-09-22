"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import SupportTicketCard from "@/components/user/UserAccount/support/SupportTicketCard";
import AdminTicketDetailModal from "@/components/user/UserAccount/support/AdminTicketDetailModal";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import DeleteConfirmModal from "@/components/feedback/MessageModal/DeleteConfirmModal";
import EmptyState from "@/components/ui/emptyState/EmptyState";
import { getPersianErrorMessage, SUCCESS_MESSAGES } from "@/lib/errorMapper";
import { usePermissions } from "@/store/hooks/usePermissions";
import { PERMISSIONS } from "@/types/permissions";

const statusTabs = [
  { value: "all", label: "همه" },
  { value: "open", label: "باز" },
  { value: "pending", label: "در انتظار پاسخ" },
  { value: "closed", label: "بسته شده" },
];

export default function TicketManagementContent() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { can } = usePermissions();

  const [popup, setPopup] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({ isOpen: false, message: "", type: "success" });

  const showError = (message: string) => {
    setPopup({ isOpen: true, message, type: "error" });
  };

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/tickets");
      setTickets(response.data || []);
    } catch (error) {
      // خطای دریافت لیست را فقط لاگ می‌کنیم؛ نمایش خالی بودن به عهده emptyState است
      console.error("خطا در دریافت تیکت‌ها:", error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const counts = statusTabs.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.value] = tab.value === "all" ? tickets.length : tickets.filter((t) => t.status === tab.value).length;
    return acc;
  }, {});

  const visibleTickets =
    activeTab === "all" ? tickets : tickets.filter((t) => t.status === activeTab);

  const handleUpdate = (updatedTicket: any) => {
    setSelectedTicket(updatedTicket);
    setTickets((prev) => prev.map((t) => (t.id === updatedTicket.id ? updatedTicket : t)));
  };

  const handleDeleteConfirm = async () => {
    if (!ticketToDelete) return;
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/tickets/${ticketToDelete.id}`);
      setTickets((prev) => prev.filter((t) => t.id !== ticketToDelete.id));
      setPopup({
        isOpen: true,
        message: response.data.message || SUCCESS_MESSAGES.deleted,
        type: "success",
      });
      setTicketToDelete(null);
    } catch (error) {
      showError(getPersianErrorMessage(error, "خطا در حذف تیکت."));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="مدیریت تیکت‌های پشتیبانی"
        description="به تیکت‌های ثبت‌شده توسط کاربران رسیدگی کنید و وضعیت آن‌ها را مدیریت نمایید."
        icon={
          <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5a8.5 8.5 0 0 1 17 0v3.25a2.25 2.25 0 0 1-2.25 2.25H16l-3.2 3.2a1.125 1.125 0 0 1-1.925-.796V17H6.25A3.25 3.25 0 0 1 3 13.75V11.5Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h.01M12 11h.01M16 11h.01" />
          </svg>
        }
      />

      {/* status tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === tab.value
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                activeTab === tab.value ? "bg-white/20" : "bg-white dark:bg-white/10"
              }`}
            >
              {counts[tab.value] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-4 text-center dark:border-white/10 dark:bg-white/[0.03]">
          <span className="mb-3 size-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
          <p className="font-semibold text-gray-700 dark:text-gray-200">در حال دریافت تیکت‌ها...</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">لطفاً کمی صبر کنید.</p>
        </div>
      ) : visibleTickets.length === 0 ? (
        <EmptyState
          tone="violet"
          eyebrow="مدیریت تیکت‌ها"
          title="تیکتی برای نمایش وجود ندارد"
          description="تیکت‌های ثبت‌شده توسط کاربران در این بخش نمایش داده می‌شوند."
          icon={
            <svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5a8.5 8.5 0 0 1 17 0v3.25a2.25 2.25 0 0 1-2.25 2.25H16l-3.2 3.2a1.125 1.125 0 0 1-1.925-.796V17H6.25A3.25 3.25 0 0 1 3 13.75V11.5Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h.01M12 11h.01M16 11h.01" />
            </svg>
          }
        />
      ) : (
        <div className="space-y-3">
          {visibleTickets.map((ticket) => (
            <SupportTicketCard
              key={ticket.id}
              ticket={ticket}
              ownerName={ticket.user ? `${ticket.user.name} (${ticket.user.username})` : undefined}
              onClick={() => {
                setSelectedTicket(ticket);
                setIsDetailModalOpen(true);
              }}
              onDelete={can(PERMISSIONS.TICKETS_DELETE) ? () => setTicketToDelete(ticket) : undefined}
            />
          ))}
        </div>
      )}

      <AdminTicketDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onUpdate={handleUpdate}
        onError={showError}
      />

      <DeleteConfirmModal
        isOpen={!!ticketToDelete}
        onClose={() => { if (!isDeleting) setTicketToDelete(null); }}
        onConfirm={handleDeleteConfirm}
        title={ticketToDelete?.subject || ""}
        isDeleting={isDeleting}
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
