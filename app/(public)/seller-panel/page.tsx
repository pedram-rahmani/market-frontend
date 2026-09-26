"use client";

import { useState } from "react";

export default function SellerPanelPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    storeName: "",
    category: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl rtl" dir="rtl">
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          فضای همکاری با فروشندگان
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ثبت‌نام و درخواست همکاری</h1>
          <p className="text-gray-500 text-sm">
            محصولات خود را در پشم استور بفروشید و کسب‌وکارتان را گسترش دهید.
          </p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl text-center space-y-2">
            <h3 className="font-bold text-lg">درخواست شما با موفقیت ثبت شد!</h3>
            <p className="text-sm">کارشناسان ما به زودی جهت هماهنگی‌های لازم با شما تماس خواهند گرفت.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
            >
              ثبت درخواست جدید
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نام و نام خانوادگی</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="مثلاً علی رضایی"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس (موبایل)</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="09123456789"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نام فروشگاه یا برند</label>
              <input
                type="text"
                required
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="مثلاً پوشاک پشمینه"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نوع محصولات / دسته‌بندی</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="مثلاً کیف و کفش، پوشاک مردانه و..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات تکمیلی (اختیاری)</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="توضیح مختصر درباره محصولات یا وب‌سایت شما..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition shadow-md"
            >
              ارسال درخواست همکاری
            </button>
          </form>
        )}
      </div>
    </div>
  );
}