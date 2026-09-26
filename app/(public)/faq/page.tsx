"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "چگونه می‌توانم در پشم استور ثبت سفارش کنم؟",
    answer: "پس از انتخاب محصول مورد نظر، آن را به سبد خرید اضافه کرده و با ورود به حساب کاربری، مراحل تسویه حساب و پرداخت را تکمیل نمایید."
  },
  {
    question: "ارسال سفارش‌ها چقدر زمان می‌برد؟",
    answer: "سفارش‌ها بسته به شهر مقصد، معمولاً بین ۲ تا ۵ روز کاری از طریق پست یا پیک تحویل داده می‌شوند."
  },
  {
    question: "چگونه می‌توانم وضعیت سفارش خود را پیگیری کنم؟",
    answer: "با ورود به حساب کاربری خود و مراجعه به بخش «سفارش‌های من»، می‌توانید وضعیت لحظه‌ای سفارش خود را مشاهده کنید."
  },
  {
    question: "شرایط مرجوع کردن و بازگرداندن کالا چیست؟",
    answer: "تا ۷ روز پس از دریافت کالا، در صورت داشتن مغایرت یا ایراد فنی، می‌توانید درخواست مرجوعی خود را از طریق پنل کاربری ثبت کنید."
  },
  {
    question: "چطور می‌توانم به عنوان فروشنده در سایت فعالیت کنم؟",
    answer: "از طریق بخش پنل فروشندگان می‌توانید درخواست خود را ثبت کنید تا پس از بررسی مدارک، حساب فروشندگی شما فعال شود."
  }
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl rtl" dir="rtl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">سوالات متداول</h1>
        <p className="text-gray-500">پاسخ پرسش‌های پرتکرار کاربران و مشتریان عزیز</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white transition-all"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full text-right px-6 py-4 font-semibold text-gray-800 flex justify-between items-center focus:outline-none hover:bg-gray-50 transition-colors"
            >
              <span>{faq.question}</span>
              <span className={`transform transition-transform duration-200 text-xl font-bold text-indigo-600 ${openIndex === index ? "rotate-45" : ""}`}>
                +
              </span>
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-5 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-100 bg-gray-50/50">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}