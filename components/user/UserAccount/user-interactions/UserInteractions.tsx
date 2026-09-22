"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import ProductReviews from "./ProductReviews";
import ProductQuestions from "./ProductQuestions";
import EditInteractionModal from "./EditInteractionModal";
import DeleteConfirmModal from "@/components/feedback/MessageModal/DeleteConfirmModal";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import axiosInstance from "@/lib/axiosInstance";
import { PERMISSIONS } from "@/types/permissions";
import { usePermissions } from "@/store/hooks/usePermissions";
import { getPersianErrorMessage, SUCCESS_MESSAGES } from "@/lib/errorMapper";

export interface ReplyItem {
  id: number;
  productName: string;
  content: string;
  date: string;
  status: "approved" | "pending" | "rejected";
  is_approved: number;
  is_admin_answer: boolean;
  user?: {
    name?: string;
    role?: string;
  };
}

export interface ReviewMediaItem {
  id: number;
  file_path: string;
  file_type: "image" | "video";
  disk: string;
  is_approved: number | boolean;
}

export interface InteractionItem {
  id: number;
  type: "review" | "question";
  productName: string;
  content: string;
  date: string;
  status: "approved" | "pending" | "rejected";
  is_approved: number;
  rating?: number;
  media?: ReviewMediaItem[];
  replies?: ReplyItem[];
  user?: {
    name?: string;
    role?: string;
  };
}

export default function UserInteractions() {
  const { can } = usePermissions();
  const [activeTab, setActiveTab] = useState<"reviews" | "questions">("reviews");
  const [reviewsList, setReviewsList] = useState<InteractionItem[]>([]);
  const [questionsList, setQuestionsList] = useState<InteractionItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InteractionItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null);
  const [bulkDeleteType, setBulkDeleteType] = useState<"reviews" | "questions" | null>(null);
  const [popup, setPopup] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  // Mark notifications as read & fetch data.
  useEffect(() => {
    axiosInstance
      .post("/notifications/mark-as-read", { type: "user-interactions" })
      .catch((err) => console.error("Failed to mark notifications as read", err));

    fetchInteractions();

    const handlePageShow = (event: PageTransitionEvent) => {
      const shouldRefresh =
        event.persisted ||
        sessionStorage.getItem("account-page-refresh") === "1";

      if (!shouldRefresh) return;

      sessionStorage.removeItem("account-page-refresh");
      fetchInteractions();
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const fetchInteractions = async () => {
    try {
      setIsLoading(true);
      const [reviewsRes, questionsRes] = await Promise.all([
        axiosInstance.get("/admin/reviews"),
        axiosInstance.get("/admin/questions"),
      ]);

      setReviewsList(
        reviewsRes.data.map((item: any) => ({
          id: item.id,
          type: "review" as const,
          productName: item.product?.name || "محصول",
          content: item.comment,
          date: item.created_at,
          status: item.is_approved ? "approved" : "pending",
          is_approved: item.is_approved ? 1 : 0,
          rating: item.rating,
          media: item.media || [],
          user: item.user,
          replies: (item.replies || []).map((reply: any) => ({
            id: reply.id,
            productName: item.product?.name || "محصول",
            content: reply.comment || "",
            date: reply.created_at,
            status: reply.is_approved ? "approved" : "pending",
            is_approved: reply.is_approved ? 1 : 0,
            is_admin_answer: false,
            user: reply.user,
          })),
        }))
      );

      setQuestionsList(
        questionsRes.data.map((item: any) => ({
          id: item.id,
          type: "question" as const,
          productName: item.product?.name || "محصول",
          content: item.comment || item.question || item.body || "",
          date: item.created_at,
          status: item.is_approved ? "approved" : "pending",
          is_approved: item.is_approved ? 1 : 0,
          user: item.user,
          replies: (item.replies || []).map((reply: any) => ({
            id: reply.id,
            productName: reply.product?.name || item.product?.name || "محصول",
            content: reply.comment || reply.answer || reply.body || "",
            date: reply.created_at,
            status: reply.is_approved ? "approved" : "pending",
            is_approved: reply.is_approved ? 1 : 0,
            is_admin_answer: Boolean(reply.is_admin_answer),
            user: reply.user,
          })),
        }))
      );
    } catch (err: any) {
      setError(getPersianErrorMessage(err, "خطا در دریافت اطلاعات از سرور"));
    } finally {
      setIsLoading(false);
    }
  };

  // Counts
  const totalPendingReviews =
    reviewsList.filter((i) => i.is_approved === 0).length +
    reviewsList.reduce(
      (acc, item) =>
        acc + (item.media?.filter((m) => Number(m.is_approved) === 0).length || 0),
      0
    );

  const pendingQuestionsCount = questionsList.filter(
    (item) => item.is_approved === 0 || item.replies?.some((r) => r.is_approved === 0)
  ).length;

  // Handlers
  const handleOpenEdit = (id: number) => {
    const items = activeTab === "reviews" ? reviewsList : questionsList;
    const item = items.find((i) => i.id === id);
    const parent = items.find((question) =>
      question.replies?.some((reply) => reply.id === id),
    );
    const reply = parent?.replies?.find((item) => item.id === id);
    if (item) {
      setSelectedItem(item);
      setIsEditModalOpen(true);
    } else if (parent && reply) {
      setSelectedItem({
        id: reply.id,
        type: "question",
        productName: reply.productName || parent.productName,
        content: reply.content,
        date: reply.date,
        status: reply.status,
        is_approved: reply.is_approved,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDeleteId && !bulkDeleteType) return;
    setIsDeleting(true);
    try {
      if (bulkDeleteType) {
        await axiosInstance.delete(`/admin/${bulkDeleteType}`);
        if (bulkDeleteType === "reviews") setReviewsList([]);
        else setQuestionsList([]);
        setBulkDeleteType(null);
        setIsDeleteModalOpen(false);
        setPopup({
          isOpen: true,
          message: bulkDeleteType === "reviews"
            ? "تمام دیدگاه‌ها و پاسخ‌ها حذف شدند."
            : "تمام پرسش‌ها و پاسخ‌ها حذف شدند.",
          type: "success",
        });
        return;
      }

      const endpoint = activeTab === "reviews" ? `/reviews/${itemToDeleteId}` : `/questions/${itemToDeleteId}`;
      await axiosInstance.delete(endpoint);

      if (activeTab === "reviews") {
        setReviewsList((prev) =>
          prev
            .filter((item) => item.id !== itemToDeleteId)
            .map((item) => ({
              ...item,
              replies: item.replies?.filter((reply) => reply.id !== itemToDeleteId),
            })),
        );
      } else {
        setQuestionsList((prev) =>
          prev
            .filter((item) => item.id !== itemToDeleteId)
            .map((item) => ({
              ...item,
              replies: item.replies?.filter((reply) => reply.id !== itemToDeleteId),
            }))
        );
      }

      setIsDeleteModalOpen(false);
      setItemToDeleteId(null);
      setPopup({ isOpen: true, message: SUCCESS_MESSAGES.deleted, type: "success" });
    } catch (err: any) {
      setPopup({
        isOpen: true,
        message: getPersianErrorMessage(err, "خطا در حذف اطلاعات"),
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleApproval = async (id: number, currentStatus: number, isReply = false) => {
    try {
      const newApprovalStatus = currentStatus === 1 ? 0 : 1;
      const newStatus = newApprovalStatus === 1 ? "approved" : "pending";

      let endpoint = `/admin/reviews/${id}/approval`;
      if (activeTab === "questions") {
        endpoint = isReply ? `/admin/answers/${id}/approval` : `/admin/questions/${id}/approval`;
      }

      await axiosInstance.patch(endpoint, { is_approved: newApprovalStatus });

      if (activeTab === "reviews") {
        setReviewsList((prev) =>
          prev.map((item) => {
            if (item.id === id) {
              return { ...item, is_approved: newApprovalStatus, status: newStatus };
            }
            return {
              ...item,
              replies: item.replies?.map((reply) =>
                reply.id === id
                  ? { ...reply, is_approved: newApprovalStatus, status: newStatus }
                  : reply,
              ),
            };
          })
        );
      } else {
        setQuestionsList((prev) =>
          prev.map((item) => {
            if (item.id === id) return { ...item, is_approved: newApprovalStatus, status: newStatus };
            if (item.replies?.length) {
              return {
                ...item,
                replies: item.replies.map((r) => (r.id === id ? { ...r, is_approved: newApprovalStatus, status: newStatus } : r)),
              };
            }
            return item;
          })
        );
      }
    } catch (err: any) {
      alert(getPersianErrorMessage(err, "خطا در تغییر وضعیت تایید"));
    }
  };

  const handleToggleMediaApproval = async (mediaId: number) => {
    try {
      const res = await axiosInstance.patch(`/admin/media/${mediaId}/approval`);
      const newStatus = res.data.is_approved ?? (res.data.status === "approved" ? 1 : 0);

      setReviewsList((prev) =>
        prev.map((review) => ({
          ...review,
          media: review.media?.map((m) => (m.id === mediaId ? { ...m, is_approved: newStatus } : m)),
        }))
      );
    } catch (err: any) {
      alert(getPersianErrorMessage(err, "خطا در تغییر وضعیت تایید فایل مدیا"));
    }
  };

  const handleSaveEdit = async (updatedData: { content: string; rating?: number }) => {
    if (!selectedItem) return;

    const isReview = selectedItem.type === "review";

    const endpoint = isReview 
      ? `/reviews/${selectedItem.id}` 
      : `/questions/${selectedItem.id}`;

    const payload = isReview 
      ? { comment: updatedData.content, rating: updatedData.rating }
      : { body: updatedData.content };

    try {
      await axiosInstance.put(endpoint, payload);
    } catch (error: any) {
      setPopup({
        isOpen: true,
        message: getPersianErrorMessage(error, "خطا در ویرایش اطلاعات"),
        type: "error",
      });
      throw error;
    }

    const setter = isReview ? setReviewsList : setQuestionsList;
    setter((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              content: updatedData.content,
              ...(updatedData.rating ? { rating: updatedData.rating } : {}),
              status: "pending",
              is_approved: 0,
            }
          : item
      )
    );
    setPopup({ isOpen: true, message: SUCCESS_MESSAGES.interactionEdited, type: "success" });
  };

  const itemToDelete = (activeTab === "reviews" ? reviewsList : questionsList)
    .find((item) =>
      item.id === itemToDeleteId ||
      item.replies?.some((reply) => reply.id === itemToDeleteId)
    );
  const itemToDeleteReply = itemToDelete?.replies?.find((reply) => reply.id === itemToDeleteId);
  const itemToDeleteText = itemToDeleteReply?.content || itemToDelete?.content || "این مورد";
  const itemToDeleteTitle = itemToDeleteText.length > 100
    ? `${itemToDeleteText.slice(0, 100)}…`
    : itemToDeleteText;

  // tab btns
  const renderTabButton = (tab: "reviews" | "questions", label: string, badgeCount: number) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`relative px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
        activeTab === tab
          ? "bg-violet-600 border-violet-700 text-white font-bold shadow-lg"
          : "bg-white/50 dark:bg-dark-900/40 border-gray-200 dark:border-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      {label}
      {badgeCount > 0 && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 border-2 border-gray-100 dark:border-dark-800 rounded-full shadow-sm" />
      )}
    </button>
  );

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <PageHeader title="تعاملات کاربران">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-dark-800 p-2 rounded-xl border border-gray-300 dark:border-white/5">
          {renderTabButton("reviews", `دیدگاه‌ها (${reviewsList.length})`, totalPendingReviews)}
          {renderTabButton("questions", `پرسش و پاسخ‌ها (${questionsList.length})`, pendingQuestionsCount)}
        </div>
      </PageHeader>

      {isLoading && (
        <div className="text-center py-12 bg-white/70 dark:bg-dark-700/70 rounded-2xl border border-gray-200 dark:border-white/5">
          <p className="text-xs text-gray-400 animate-pulse">در حال بارگذاری اطلاعات...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center py-12 bg-rose-500/10 rounded-2xl border border-rose-500/20">
          <p className="text-xs text-rose-400">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        activeTab === "reviews" ? (
          <ProductReviews
            items={reviewsList}
            onEdit={handleOpenEdit}
            onDelete={(id) => { setItemToDeleteId(id); setIsDeleteModalOpen(true); }}
            onToggleApproval={handleToggleApproval}
            onToggleMediaApproval={handleToggleMediaApproval}
            canApproveComments={can(PERMISSIONS.COMMENTS_APPROVE)}
            canApproveCommentMedia={can(PERMISSIONS.COMMENTS_MEDIA_APPROVE)}
            canDeleteAll={can(PERMISSIONS.COMMENTS_DELETE)}
            onDeleteAll={() => {
              setBulkDeleteType("reviews");
              setIsDeleteModalOpen(true);
            }}
          />
        ) : (
          <ProductQuestions
            items={questionsList}
            onEdit={handleOpenEdit}
            onDelete={(id) => { setItemToDeleteId(id); setIsDeleteModalOpen(true); }}
            onToggleApproval={handleToggleApproval}
            canApproveQuestions={can(PERMISSIONS.QUESTIONS_APPROVE)}
            canApproveAnswers={can(PERMISSIONS.ANSWERS_APPROVE)}
            canDeleteAll={can(PERMISSIONS.QUESTIONS_DELETE)}
            onDeleteAll={() => {
              setBulkDeleteType("questions");
              setIsDeleteModalOpen(true);
            }}
          />
        )
      )}

      <EditInteractionModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedItem(null); }}
        item={selectedItem}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => { if (!isDeleting) { setIsDeleteModalOpen(false); setItemToDeleteId(null); setBulkDeleteType(null); } }}
        onConfirm={handleDeleteConfirm}
        title={
          bulkDeleteType === "reviews"
            ? "تمام دیدگاه‌ها و پاسخ‌های آن‌ها"
            : bulkDeleteType === "questions"
              ? "تمام پرسش‌ها و پاسخ‌های آن‌ها"
              : itemToDeleteTitle
        }
        isDeleting={isDeleting}
      />

      <SimplePopup
        isOpen={popup.isOpen}
        onClose={() => setPopup((current) => ({ ...current, isOpen: false }))}
        message={popup.message}
        type={popup.type}
      />
    </div>
  );
}