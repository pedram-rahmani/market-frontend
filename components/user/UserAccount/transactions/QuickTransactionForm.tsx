"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { e2f } from "@/lib/utils";

interface QuickTransactionFormProps {
  onSuccess: () => void;
}

export default function QuickTransactionForm({ onSuccess }: QuickTransactionFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [displayAmount, setDisplayAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const convertPersianToEnglishNumbers = (str: string) => {
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    const arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
    let converted = str;
    for (let i = 0; i < 10; i++) {
      converted = converted.replace(persianNumbers[i], String(i)).replace(arabicNumbers[i], String(i));
    }
    return converted;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.target.value;
    
    const englishNumbersOnly = convertPersianToEnglishNumbers(userInput);
    const rawValue = englishNumbersOnly.replace(/\D/g, ""); 
    
    setAmount(rawValue);
    
    if (!rawValue) {
      setDisplayAmount("");
    } else {
      setDisplayAmount(e2f(Number(rawValue)));
    }
  };

  const handleTransaction = async (type: "deposit" | "withdraw") => {
    if (!amount || Number(amount) <= 0) {
      setMessage({ text: "لطفاً مبلغ معتبری وارد کنید.", type: "error" });
      return;
    }

    try {
      setActionLoading(true);
      setMessage(null);
      const endpoint = type === "deposit" ? "/wallet/deposit" : "/wallet/withdraw";

      const response = await axiosInstance.post(endpoint, {
        amount: Number(amount),
        description: description || (type === "deposit" ? "شارژ کیف پول" : "برداشت وجه"),
      });

      setMessage({ text: response.data.message, type: "success" });
      setAmount("");
      setDisplayAmount("");
      setDescription("");
      onSuccess();
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.message || "خطایی رخ داد.",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        تراکنش آنی (تست)
      </h3>

      {/* status messages */}
      {message && (
        <div
          className={`p-3 rounded-lg text-xs ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <input
          type="text"
          inputMode="numeric"
          placeholder="مبلغ (تومان)"
          value={displayAmount}
          onChange={handleAmountChange}
          className="w-full px-4! py-2! text-sm bg-white! dark:bg-gray-800! border! border-gray-300! dark:border-gray-600! rounded-lg focus:ring-2! focus:ring-blue-500! text-gray-800! dark:text-white!"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="توضیحات (اختیاری)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4! py-2! text-sm bg-white! dark:bg-gray-800! border! border-gray-300! dark:border-gray-600! rounded-lg focus:ring-2! focus:ring-blue-500! text-gray-800! dark:text-white!"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* deposit btn */}
        <button
          onClick={() => handleTransaction("deposit")}
          disabled={actionLoading}
          className="group relative flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {actionLoading ? (
            <svg className="size-4! animate-spin text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="size-4! transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          )}
          <span>افزایش موجودی</span>
        </button>

        {/* withdrawal btn */}
        <button
          onClick={() => handleTransaction("withdraw")}
          disabled={actionLoading}
          className="group relative flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition-all duration-200 hover:from-rose-600 hover:to-pink-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {actionLoading ? (
            <svg className="size-4! animate-spin text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="size-4! transition-transform duration-200 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          )}
          <span>برداشت وجه</span>
        </button>
      </div>
    </div>
  );
}