"use client";

import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface ReviewReportModalProps {
  reviewId: number;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function ReviewReportModal({
  reviewId,
  onClose,
  onSuccess,
  onError,
}: ReviewReportModalProps) {
  const [reportReason, setReportReason] = useState("اسپم یا تبلیغات");
  const [reportDescription, setReportDescription] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReport(true);
    try {
      const { data } = await axiosInstance.post(`/reviews/${reviewId}/report`, {
        reason: reportReason,
        description: reportDescription,
      });
      onSuccess(data.message || "گزارش شما با موفقیت ثبت شد.");
      onClose();
    } catch (error: any) {
      onError(error.response?.data?.message || "خطایی در ثبت گزارش رخ داد.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed z-100 inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-right relative"
      >
        {/* header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>⚠️</span> گزارش تخلف دیدگاه
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            title="بستن"
          >
            <svg className="size-4!" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-xs text-gray-400">
          لطفاً دلیل گزارش این دیدگاه را مشخص کنید تا توسط تیم پشتیبانی بررسی شود:
        </p>

        <form onSubmit={submitReport} className="space-y-4">
          <div className="space-y-2">
            {[
              "اسپم یا تبلیغات",
              "توهین، فحاشی یا لحن نامناسب",
              "اطلاعات نادرست",
              "محتوای نامربوط",
            ].map((reasonOpt) => (
              <label
                key={reasonOpt}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  reportReason === reasonOpt
                    ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-300 font-medium"
                    : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/15"
                }`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={reasonOpt}
                  checked={reportReason === reasonOpt}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="accent-cyan-500"
                />
                {reasonOpt}
              </label>
            ))}
          </div>

          <textarea
            placeholder="توضیحات بیشتر (اختیاری)..."
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            className="w-full bg-gray-950/60 border border-white/10 p-3 rounded-xl text-white text-xs min-h-[80px] focus:outline-none focus:border-cyan-500/50"
          />

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmittingReport}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 rounded-xl text-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmittingReport ? "در حال ارسال..." : "ارسال گزارش"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-xs transition-all cursor-pointer"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}