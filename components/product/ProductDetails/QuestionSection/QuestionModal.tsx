"use client";

import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useLockBodyScroll from "@/store/hooks/useLockBodyScroll";
import useClickOutside from "@/store/hooks/useClickOutside";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: any[];
  productId: number | string;
  onQuestionAdded: () => void;
  initialSelectedQuestion?: any;
}

export default function QuestionModal({
  isOpen,
  onClose,
  questions,
  productId,
  onQuestionAdded,
  initialSelectedQuestion,
}: QuestionModalProps) {
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newReplyText, setNewReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(
    initialSelectedQuestion || null,
  );

  const [popup, setPopup] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const handleSafeClose = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
    onClose();
  };

  const modalContentRef = useRef<HTMLDivElement>(null);

  useClickOutside(() => {
    if (!popup.isOpen) {
      handleSafeClose();
    }
  }, modalContentRef);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (initialSelectedQuestion) {
      const updated = questions.find(
        (q) => q.id === initialSelectedQuestion.id,
      );
      setSelectedQuestion(updated || initialSelectedQuestion);
    } else {
      setSelectedQuestion(null);
    }
  }, [initialSelectedQuestion, questions]);

  if (!isOpen) return null;

  // new question submission
  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    try {
      setLoading(true);
      await axiosInstance.post(`/questions`, {
        product_id: productId,
        body: newQuestionText,
      });

      setNewQuestionText("");
      onQuestionAdded();

      setPopup({
        isOpen: true,
        message: "سوال شما با موفقیت ثبت شد و پس از تایید نمایش داده می‌شود.",
        type: "success",
      });

      setTimeout(() => {
        handleSafeClose();
      }, 1500);
    } catch (error: any) {
      console.error("Failed to submit question", error);
      setPopup({
        isOpen: true,
        message:
          error.response?.data?.message ||
          "خطایی در ثبت سوال رخ داد. لطفاً دوباره تلاش کنید.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // new answer submission
  const handleSubmitReply = async (
    e: React.FormEvent,
    questionId: number | string,
  ) => {
    e.preventDefault();
    if (!newReplyText.trim()) return;

    try {
      setReplyLoading(true);
      await axiosInstance.post(`/questions`, {
        product_id: productId,
        parent_id: questionId,
        body: newReplyText,
      });

      setNewReplyText("");
      onQuestionAdded();

      setPopup({
        isOpen: true,
        message: "پاسخ شما با موفقیت ثبت شد.",
        type: "success",
      });

      setTimeout(() => {
        handleSafeClose();
      }, 1500);
    } catch (error: any) {
      console.error("Failed to submit reply", error.response?.data);
      setPopup({
        isOpen: true,
        message:
          error.response?.data?.message ||
          "خطایی در ثبت پاسخ رخ داد. لطفاً دوباره تلاش کنید.",
        type: "error",
      });
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div
          ref={modalContentRef}
          className="bg-white dark:bg-dark-800 w-full max-w-2xl rounded-3xl border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {selectedQuestion
                ? "جزئیات سوال و پاسخ‌ها"
                : "پرسش و پاسخ کاربران"}
            </h3>
            <button
              onClick={handleSafeClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
            >
              <svg viewBox="0 0 24 24" className="size-5!">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto scrollbar space-y-6 custom-scrollbar flex-1 mx-1">
            {selectedQuestion ? (
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="text-xs text-violet-600 dark:text-violet-400 font-medium hover:underline flex items-center gap-1"
                >
                  <svg viewBox="0 0 24 24" className="size-4!">
                    <path d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                  </svg>
                  بازگشت به همه سوالات
                </button>

                {/* question body */}
                <div className="bg-gray-50 dark:bg-dark-700/50 p-4 rounded-2xl border border-gray-100 dark:border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
                    <span className="w-6 h-6 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg flex items-center justify-center text-xs">
                      <svg viewBox="0 0 24 24" className="size-4!">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75m0 3h.007v.008H12v-.008Z"
                        />
                      </svg>
                    </span>
                    {selectedQuestion.body}
                  </div>
                  <span className="text-[10px] text-gray-400 block pr-8">
                    {selectedQuestion.created_at
                      ? new Date(
                          selectedQuestion.created_at,
                        ).toLocaleDateString("fa-IR")
                      : ""}
                  </span>
                </div>

                {/* answers list */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    پاسخ‌ها ({selectedQuestion.replies?.length || 0})
                  </h4>
                  {selectedQuestion.replies &&
                  selectedQuestion.replies.length > 0 ? (
                    selectedQuestion.replies.map((reply: any, idx: number) => {
                      const userRole = reply.user?.role?.toLowerCase();
                      const isAdmin =
                        reply.is_admin_answer === true ||
                        userRole === "admin" ||
                        userRole === "co-admin" ||
                        userRole === "co_admin";

                      return (
                        <div
                          key={reply.id || idx}
                          className="bg-gray-50/50 dark:bg-dark-700/30 p-3.5 rounded-xl border border-gray-100 dark:border-white/5 space-y-1 text-xs"
                        >
                          <span
                            className={`font-medium block ${isAdmin ? "text-cyan-500" : "text-emerald-500"}`}
                          >
                            {isAdmin
                              ? "پاسخ فروشگاه (ادمین)"
                              : `پاسخ خریدار (${reply.user?.name || "کاربر"})`}
                          </span>
                          <p className="text-gray-600 dark:text-gray-300">
                            {reply.body}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      هنوز پاسخی برای این سوال ثبت نشده است.
                    </p>
                  )}
                </div>

                {/* new answer form */}
                <form
                  onSubmit={(e) => handleSubmitReply(e, selectedQuestion.id)}
                  className="space-y-3 bg-gray-50 dark:bg-dark-700/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5 mt-4"
                >
                  <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                    شما هم به این سوال پاسخ دهید:
                  </label>
                  <textarea
                    value={newReplyText}
                    onChange={(e) => setNewReplyText(e.target.value)}
                    placeholder="پاسخ خود را بنویسید..."
                    className="w-full h-20 p-3 text-xs bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-violet-500 text-gray-900 dark:text-white resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={replyLoading || !newReplyText.trim()}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                    >
                      {replyLoading ? "در حال ثبت پاسخ..." : "ارسال پاسخ"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                {/* new question form */}
                <form
                  onSubmit={handleSubmitQuestion}
                  className="space-y-3 bg-gray-50 dark:bg-dark-700/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5"
                >
                  <label className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
                    سوال خود را درباره این محصول بپرسید:
                  </label>
                  <textarea
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="مثلاً: آیا این مدل رنگ مشکی مات هم دارد؟"
                    className="w-full h-24 p-3 text-xs bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-violet-500 text-gray-900 dark:text-white resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading || !newQuestionText.trim()}
                      className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                    >
                      {loading ? "در حال ثبت..." : "ثبت سوال"}
                    </button>
                  </div>
                </form>

                {/* questions list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    پرسش‌های دیگران ({questions.length})
                  </h4>
                  {questions.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-6">
                      سوالی ثبت نشده است.
                    </p>
                  ) : (
                    questions.map((q, idx) => (
                      <div
                        key={q.id || idx}
                        onClick={() => setSelectedQuestion(q)}
                        className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-700/40 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-violet-500/50 transition flex items-center justify-between"
                      >
                        <div className="space-y-1.5 flex-1 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-violet-500/10 text-violet-600 rounded-md flex items-center justify-center text-[10px] font-bold">
                              <svg viewBox="0 0 24 24" className="size-3.5!">
                                <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75m0 3h.007v.008H12v-.008Z" />
                              </svg>
                            </span>
                            <h5 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">
                              {q.body}
                            </h5>
                          </div>
                          <span className="text-[10px] text-gray-400 block pr-7">
                            {q.replies?.length || 0} پاسخ •{" "}
                            {q.created_at
                              ? new Date(q.created_at).toLocaleDateString(
                                  "fa-IR",
                                )
                              : ""}
                          </span>
                        </div>
                        <button className="flex items-center justify-center text-xs text-violet-600 dark:text-violet-400 font-medium hover:underline">
                          مشاهده پاسخ‌ها{" "}
                          <svg viewBox="0 0 24 24" className="size-4! mr-1">
                            <path d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                          </svg>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* message modal */}
      <SimplePopup
        isOpen={popup.isOpen}
        onClose={() => setPopup((prev) => ({ ...prev, isOpen: false }))}
        message={popup.message}
        type={popup.type}
      />
    </>
  );
}