"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import useLockBodyScroll from "@/store/hooks/useLockBodyScroll";
import ReviewReply from "./ReviewReply";
import ReviewReplyForm from "./ReviewReplyForm";
import ReviewReportModal from "./ReviewReportModal";

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at?: string;
  user?: {
    id?: number;
    name?: string;
  };
  likes_count?: number;
  dislikes_count?: number;
  user_reaction?: "like" | "dislike" | null;
  replies?: Review[];
}

interface ReviewListProps {
  productId: number;
  initialReviews?: Review[];
  onReviewAdded?: () => void;
}

export default function ReviewList({
  productId,
  initialReviews = [],
  onReviewAdded,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // Report Modal States
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);

  // Active Reply Form State
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);

  // Show/Hide Replies State (open/close for each review)
  const [showRepliesMap, setShowRepliesMap] = useState<{
    [key: number]: boolean;
  }>({});

  // Pagination for Replies (number of replies to show for each review)
  const [visibleCountMap, setVisibleCountMap] = useState<{
    [key: number]: number;
  }>({});

  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  useLockBodyScroll(reportModalOpen);

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  const handleReaction = async (reviewId: number, type: "like" | "dislike") => {
    try {
      const { data } = await axiosInstance.post(`/reviews/${reviewId}/react`, {
        type,
      });

      setReviews((prev) =>
        prev.map((rev) => {
          if (rev.id === reviewId) {
            return {
              ...rev,
              likes_count: data.likes_count,
              dislikes_count: data.dislikes_count,
              user_reaction: data.user_reaction,
            };
          }
          return rev;
        }),
      );
    } catch (error) {
      console.error("Failed to submit reaction:", error);
    }
  };

  const handleSendReply = async (parentId: number, comment: string) => {
    try {
      const { data } = await axiosInstance.post("/reviews", {
        product_id: productId,
        parent_id: parentId,
        comment: comment,
        rating: null,
      });

      setReviews((prevReviews) =>
        prevReviews.map((review) => {
          if (review.id === parentId) {
            const updatedReplies = [...(review.replies || []), data.review];
            return {
              ...review,
              replies: updatedReplies,
            };
          }
          return review;
        }),
      );

      setShowRepliesMap((prev) => ({ ...prev, [parentId]: true }));
      setVisibleCountMap((prev) => {
        const currentTotal =
          reviews.find((r) => r.id === parentId)?.replies?.length || 0;
        return {
          ...prev,
          [parentId]: Math.max(prev[parentId] || 6, currentTotal + 1),
        };
      });

      setPopupState({
        isOpen: true,
        message: "پاسخ شما با موفقیت ثبت شد و پس از بررسی نمایش داده خواهد شد.",
        type: "success",
      });

      setActiveReplyId(null);
    } catch (error: any) {
      setPopupState({
        isOpen: true,
        message: error.response?.data?.message || "خطایی در ثبت پاسخ رخ داد.",
        type: "error",
      });
    }
  };

  const handleToggleReplyForm = (reviewId: number) => {
    const willBeActive = activeReplyId === reviewId ? null : reviewId;
    setActiveReplyId(willBeActive);

    if (willBeActive !== null) {
      setTimeout(() => {
        const replyFormElement = document.getElementById(
          `reply-form-${reviewId}`,
        );
        if (replyFormElement) {
          replyFormElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 150);
    }
  };

  const toggleShowReplies = (reviewId: number, totalReplies: number) => {
    const isCurrentlyShown = showRepliesMap[reviewId];
    setShowRepliesMap((prev) => ({
      ...prev,
      [reviewId]: !isCurrentlyShown,
    }));

    if (!isCurrentlyShown && visibleCountMap[reviewId] === undefined) {
      setVisibleCountMap((prev) => ({
        ...prev,
        [reviewId]: Math.min(6, totalReplies),
      }));
    }
  };

  const handleShowMoreReplies = (reviewId: number, totalReplies: number) => {
    setVisibleCountMap((prev) => {
      const currentVisible = prev[reviewId] || 6;
      return {
        ...prev,
        [reviewId]: Math.min(currentVisible + 6, totalReplies),
      };
    });
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 ? (
        <p className="text-center text-xs text-gray-400 py-8 bg-gray-900/30 rounded-2xl border border-white/5">
          هنوز دیدگاهی برای این محصول ثبت نشده است. اولین نفری باشید که نظر
          می‌دهید!
        </p>
      ) : (
        reviews.map((review) => {
          const repliesCount = review.replies?.length || 0;
          const areRepliesShown = showRepliesMap[review.id];

          const visibleCount =
            visibleCountMap[review.id] ?? Math.min(6, repliesCount);
          const currentVisibleReplies =
            review.replies?.slice(0, visibleCount) || [];
          const hasMoreReplies = visibleCount < repliesCount;

          return (
            <div key={review.id} className="space-y-3">
              {/* comment text */}
              <div className="p-5 bg-white dark:bg-dark-700/70 rounded-2xl border border-custom-gray-100/70 dark:border-dark-600 space-y-3 relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-bold">
                      {review.user?.name ? review.user.name.charAt(0) : "ک"}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-text-on-light/80 dark:text-text-on-dark/90 block">
                        {review.user?.name || "کاربر مهمان"}
                      </span>
                      {review.created_at && (
                        <div className="flex items-center gap-1.5 text-[10px] text-text-on-light/60 dark:text-text-on-dark/60 mt-0.5" dir="ltr">
                          <span className="opacity-80">
                            {new Date(review.created_at).toLocaleTimeString("fa-IR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="text-cyan-500/50 dark:text-cyan-400/40">•</span>
                          <span>
                            {new Date(review.created_at).toLocaleDateString("fa-IR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedReviewId(review.id);
                        setReportModalOpen(true);
                      }}
                      title="گزارش تخلف"
                      className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1.5 text-custom-gray-400 hover:text-ui-red-600/70 bg-dark-600/5 dark:bg-light/5 hover:bg-dark/10 hover:dark:bg-light/5 rounded-lg border border-white/5 cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" className="size-3.5!">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                      </svg>
                    </button>

                    {review.rating && (
                      <div className="flex items-center justify-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg cursor-default">
                        <svg
                          className="size-3.5! text-amber-400"
                          viewBox="0 0 24 24"
                        >
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span className="text-xs font-semibold text-amber-400 leading-none mt-0.5">
                          {review.rating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-text-on-light/90 dark:text-text-on-dark/90 leading-relaxed">
                  {review.comment}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-custom-gray-100/40 dark:border-dark-600">
                  <button
                    onClick={() => handleToggleReplyForm(review.id)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <svg className="size-4!" viewBox="0 0 24 24">
                      <path d="M9 14l-4-4 4-4m-4 4h11a4 4 0 014 4v1" />
                    </svg>
                    <span>پاسخ</span>
                  </button>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleReaction(review.id, "like")}
                      className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                        review.user_reaction === "like"
                          ? "text-cyan-400 font-semibold"
                          : "text-gray-400 hover:text-cyan-400"
                      }`}
                    >
                      <svg className="size-4!" viewBox="0 0 24 24">
                        <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
                      </svg>
                      <span>{review.likes_count || 0}</span>
                    </button>

                    <button
                      onClick={() => handleReaction(review.id, "dislike")}
                      className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                        review.user_reaction === "dislike"
                          ? "text-rose-400 font-semibold"
                          : "text-gray-400 hover:text-rose-400"
                      }`}
                    >
                      <svg className="size-4!" viewBox="0 0 24 24">
                        <path d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c-.5 0 .905-.405.905-.905 0-.714-.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                      </svg>
                      <span>{review.dislikes_count || 0}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* show-hide replies button */}
              {repliesCount > 0 && (
                <div className="mr-6 sm:mr-10">
                  <button
                    onClick={() => toggleShowReplies(review.id, repliesCount)}
                    className="text-xs text-cyan-400/95 hover:text-cyan-300 font-medium flex items-center gap-1.5 cursor-pointer py-1 transition-colors"
                  >
                    <svg
                      className={`size-3.5! transition-transform duration-200 ${
                        areRepliesShown ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                    <span>
                      {areRepliesShown
                        ? "پنهان کردن پاسخ‌ها"
                        : `مشاهده ${repliesCount} پاسخ`}
                    </span>
                  </button>
                </div>
              )}

              {/* replies list */}
              <div
                className={`review-reply-collapse ${areRepliesShown ? "is-open" : ""}`}
              >
                <div className="review-reply-wrapper pt-1">
                  {review.replies && review.replies.length > 0 && (
                    <div className="mr-6 sm:mr-10 border-r-2 border-cyan-500/20 pr-4 space-y-3">
                      {currentVisibleReplies.map((reply) => (
                        <ReviewReply key={reply.id} reply={reply} />
                      ))}

                      {hasMoreReplies && (
                        <div className="pt-1">
                          <button
                            onClick={() =>
                              handleShowMoreReplies(review.id, repliesCount)
                            }
                            className="text-[11px] text-cyan-400/80 hover:text-cyan-300 font-medium cursor-pointer transition-colors py-1 px-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 inline-flex items-center gap-1"
                          >
                            <span>
                              مشاهده پاسخ‌های بیشتر (
                              {repliesCount - visibleCount} پاسخ دیگر)
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* reply form */}
              <div
                id={`reply-form-${review.id}`}
                className={`review-reply-collapse ${activeReplyId === review.id ? "is-open" : ""}`}
              >
                <div className="review-reply-wrapper pt-2">
                  <ReviewReplyForm
                    onSubmitReply={(comment) =>
                      handleSendReply(review.id, comment)
                    }
                    onCancel={() => setActiveReplyId(null)}
                  />
                </div>
              </div>
            </div>
          );
        })
      )}

      {reportModalOpen && selectedReviewId && (
        <ReviewReportModal
          reviewId={selectedReviewId}
          onClose={() => setReportModalOpen(false)}
          onSuccess={(msg) =>
            setPopupState({ isOpen: true, message: msg, type: "success" })
          }
          onError={(msg) =>
            setPopupState({ isOpen: true, message: msg, type: "error" })
          }
        />
      )}

      <SimplePopup
        isOpen={popupState.isOpen}
        onClose={() => setPopupState((prev) => ({ ...prev, isOpen: false }))}
        message={popupState.message}
        type={popupState.type}
      />
    </div>
  );
}