"use client";

import { useState } from "react";
import QuestionSlider from "./QuestionSlider";
import QuestionModal from "./QuestionModal";
import axiosInstance from "@/lib/axiosInstance";

interface QuestionSectionProps {
  questions: any[];
  productId: number | string;
}

export default function QuestionSection({ questions: initialQuestions, productId }: QuestionSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedQuestionFromSlider, setSelectedQuestionFromSlider] = useState<any>(null);

  const handleRefresh = async () => {
    try {
      const res = await axiosInstance.get(`/products/${productId}/questions`);
      setQuestions(res.data);
    } catch (e) {
      console.error("Failed to fetch updated questions:", e);
    }
  };

  const handleOpenModalWithQuestion = (question?: any) => {
    setSelectedQuestionFromSlider(question || null);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white/80 dark:bg-dark-700/70 border border-custom-gray-100/70 dark:border-dark-600 rounded-3xl p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-text-on-light/80 dark:text-text-on-dark/90">پرسش و پاسخ کاربران</h2>
          <p className="text-xs text-gray-400 mt-1">
            سوالات خود درباره محصول را بپرسید یا پاسخ سایرین را بخوانید.
          </p>
        </div>
        <button
          onClick={() => handleOpenModalWithQuestion()}
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-violet-600/20"
        >
          پرسیدن سوال / مشاهده همه
        </button>
      </div>

      <QuestionSlider 
        questions={questions} 
        onQuestionClick={(q) => handleOpenModalWithQuestion(q)} 
      />

      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuestionFromSlider(null);
        }}
        questions={questions}
        productId={productId}
        onQuestionAdded={handleRefresh}
        initialSelectedQuestion={selectedQuestionFromSlider}
      />
    </div>
  );
}