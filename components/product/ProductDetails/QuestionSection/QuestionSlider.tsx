"use client";

import React, { useRef, useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";

interface QuestionSliderProps {
  questions: any[];
  onQuestionClick?: (question: any) => void;
  onOpenAllQuestions?: () => void;
}

export default function QuestionSlider({
  questions: initialQuestions,
  onQuestionClick,
}: QuestionSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  // local state for questions to handle likes/replies dynamically
  const [questions, setQuestions] = useState(initialQuestions);

  // mouse drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // arrow lock states
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // active reply form map & show/hide replies map
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [showRepliesMap, setShowRepliesMap] = useState<{
    [key: number]: boolean;
  }>({});
  const [replyTextMap, setReplyTextMap] = useState<{ [key: number]: string }>(
    {},
  );

  const [popupState, setPopupState] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;
      const currentScroll = Math.abs(scrollLeft);

      setCanScrollRight(currentScroll > 5);
      setCanScrollLeft(currentScroll < maxScrollLeft - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [questions]);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const containerWidth = sliderRef.current.clientWidth;
      const scrollAmount = containerWidth * 0.85;

      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      setTimeout(checkScroll, 300);
    }
  };

  // Reactions handler (like/dislike)
  const handleReaction = async (
    questionId: number,
    type: "like" | "dislike",
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `/questions/${questionId}/react`,
        {
          type,
        },
      );

      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              likes_count: data.likes_count,
              dislikes_count: data.dislikes_count,
              user_reaction: data.user_reaction,
            };
          }
          return q;
        }),
      );
    } catch (error) {
      console.error("Failed to submit reaction:", error);
    }
  };

  // Send reply handler
  const handleSendReply = async (questionId: number) => {
    const comment = replyTextMap[questionId];
    if (!comment || !comment.trim()) return;

    const currentQuestion = questions.find((q) => q.id === questionId);

    try {
      const { data } = await axiosInstance.post("/questions", {
        parent_id: questionId,
        product_id: currentQuestion?.product_id,
        body: comment,
      });

      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              replies: [...(q.replies || []), data.question || data],
            };
          }
          return q;
        }),
      );

      setShowRepliesMap((prev) => ({ ...prev, [questionId]: true }));
      setReplyTextMap((prev) => ({ ...prev, [questionId]: "" }));
      setActiveReplyId(null);

      setPopupState({
        isOpen: true,
        message: "پاسخ شما با موفقیت ثبت شد.",
        type: "success",
      });
    } catch (error: any) {
      setPopupState({
        isOpen: true,
        message: error.response?.data?.message || "خطایی در ثبت پاسخ رخ داد.",
        type: "error",
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasMoved(false);
    if (sliderRef.current) {
      setStartX(e.pageX - sliderRef.current.offsetLeft);
      setScrollLeftState(sliderRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;

    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }

    sliderRef.current.scrollLeft = scrollLeftState - walk;
    checkScroll();
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 dark:bg-dark-700/50 rounded-xl border border-dashed border-gray-200 dark:border-white/10">
        <p className="text-xs text-text-on-light/80 dark:text-text-on-dark/90">
          هنوز سوالی برای این محصول ثبت نشده است. اولین نفر باشید!
        </p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        aria-label="scroll right"
        className={`absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white dark:bg-dark-700 border border-gray-200 dark:border-white/10 rounded-full shadow-md hidden md:flex items-center justify-center text-gray-700 dark:text-white transition ${
          !canScrollRight
            ? "opacity-30 cursor-not-allowed pointer-events-none"
            : "opacity-0 group-hover:opacity-100 hover:bg-gray-50 dark:hover:bg-dark-600"
        }`}
      >
        <svg viewBox="0 0 24 24" strokeWidth={1.5} className="size-4!">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        aria-label="scroll left"
        className={`absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white dark:bg-dark-700 border border-gray-200 dark:border-white/10 rounded-full shadow-md hidden md:flex items-center justify-center text-gray-700 dark:text-white transition ${
          !canScrollLeft
            ? "opacity-30 cursor-not-allowed pointer-events-none"
            : "opacity-0 group-hover:opacity-100 hover:bg-gray-50 dark:hover:bg-dark-600"
        }`}
      >
        <svg viewBox="0 0 24 24" strokeWidth={1.5} className="size-4!">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      <div
        ref={sliderRef}
        onScroll={checkScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-4 overflow-x-auto question-slider-scroll pb-4 pt-1 select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {questions.map((q, index) => {
          const repliesCount = q.replies?.length || 0;
          const areRepliesShown = showRepliesMap[q.id];
          const latestReply = repliesCount > 0 ? q.replies[0] : null;
          const isAdminAnswer =
            latestReply?.is_admin_answer || latestReply?.user?.role === "admin";

          return (
            <div
              key={q.id || index}
              className="min-w-75 max-w-87.5 shrink-0 bg-gray-50/80 dark:bg-dark-700/60 p-4 rounded-2xl border border-custom-gray-200/80 dark:border-custom-gray-200/5 flex flex-col justify-between"
            >
              <div>
                {/* Question Header & Body - Clicking here opens the Modal with this specific question */}
                <div
                  onClick={() => {
                    if (!hasMoved && onQuestionClick) {
                      onQuestionClick(q);
                    }
                  }}
                  className="space-y-3 cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-7 h-7 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      <svg viewBox="0 0 24 24" className="size-4!">
                        <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75m0 3h.007v.008H12v-.008Z" />
                      </svg>
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2">
                        {q.body || "بدون متن"}
                      </h4>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">
                        {q.created_at
                          ? new Date(q.created_at).toLocaleDateString("fa-IR")
                          : ""}
                      </span>
                    </div>
                  </div>

                  {/* Latest Reply Preview */}
                  {latestReply && !areRepliesShown && (
                    <div className="bg-white dark:bg-dark-800 p-3 rounded-xl border border-gray-100/80 dark:border-dark-600 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-medium ${
                            isAdminAnswer
                              ? "text-cyan-500 dark:text-cyan-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        >
                          {isAdminAnswer
                            ? "پاسخ فروشگاه (ادمین)"
                            : `پاسخ (${latestReply.user?.name || "کاربر"})`}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                        {latestReply.body || latestReply.comment || ""}
                      </p>
                    </div>
                  )}
                </div>

                {/* Expanded Replies List */}
                {areRepliesShown && q.replies && q.replies.length > 0 && (
                  <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
                    {q.replies.map((rep: any) => (
                      <div
                        key={rep.id}
                        className="bg-white dark:bg-dark-800 p-2.5 rounded-xl border border-gray-100 dark:border-white/5 text-[11px] space-y-1"
                      >
                        <span className="font-semibold text-cyan-500">
                          {rep.user?.name || "کاربر"}
                        </span>
                        <p className="text-gray-600 dark:text-gray-300">
                          {rep.body || rep.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form Toggle / Input */}
                {activeReplyId === q.id && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={replyTextMap[q.id] || ""}
                      onChange={(e) =>
                        setReplyTextMap({
                          ...replyTextMap,
                          [q.id]: e.target.value,
                        })
                      }
                      placeholder="پاسخ خود را بنویسید..."
                      className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-violet-500 text-gray-600 dark:text-gray-300"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveReplyId(null)}
                        className="px-3 py-1 text-[10px] text-gray-500 bg-gray-200 dark:bg-dark-600 rounded-lg"
                      >
                        انصراف
                      </button>
                      <button
                        onClick={() => handleSendReply(q.id)}
                        className="px-3 py-1 text-[10px] text-white bg-violet-600 rounded-lg"
                      >
                        ارسال پاسخ
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer: Reactions & Actions (Updated to trigger modal if needed) */}
              <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                <div className="flex items-center gap-3">
                  {repliesCount > 0 && (
                    <button
                      onClick={() => {
                        if (onQuestionClick) {
                          onQuestionClick(q);
                        } else {
                          setShowRepliesMap((prev) => ({
                            ...prev,
                            [q.id]: !areRepliesShown,
                          }));
                        }
                      }}
                      className="text-violet-600 dark:text-violet-400 font-medium hover:underline"
                    >
                      {areRepliesShown
                        ? "پنهان‌سازی پاسخ‌ها"
                        : `${repliesCount} پاسخ`}
                    </button>
                  )}
                </div>

                {/* Like / Dislike Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleReaction(q.id, "like")}
                    className={`flex items-center gap-1 transition-colors ${
                      q.user_reaction === "like"
                        ? "text-cyan-500 font-bold"
                        : "hover:text-cyan-500"
                    }`}
                  >
                    <svg className="size-4!" viewBox="0 0 24 24">
                      <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
                    </svg>{" "}
                    <span>{q.likes_count || 0}</span>
                  </button>
                  <button
                    onClick={() => handleReaction(q.id, "dislike")}
                    className={`flex items-center gap-1 transition-colors ${
                      q.user_reaction === "dislike"
                        ? "text-rose-500 font-bold"
                        : "hover:text-rose-500"
                    }`}
                  >
                    <svg className="size-4!" viewBox="0 0 24 24">
                      <path d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v5a2 2 0 002 2h.095c-.5 0 .905-.405.905-.905 0-.714-.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                    </svg>{" "}
                    <span>{q.dislikes_count || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <SimplePopup
        isOpen={popupState.isOpen}
        onClose={() => setPopupState((prev) => ({ ...prev, isOpen: false }))}
        message={popupState.message}
        type={popupState.type}
      />
    </div>
  );
}
