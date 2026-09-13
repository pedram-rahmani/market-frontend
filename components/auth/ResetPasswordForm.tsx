"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import MessageModal from "@/components/feedback/MessageModal/MessageModal";
import SecureInput from "../ui/SecureInput/SecureInput";
import { requiredValidator } from "@/Validator/Rules";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const tokenParam = searchParams.get("token") || "";

  const [email, setEmail] = useState(emailParam);
  const [token, setToken] = useState(tokenParam);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [isPending, setIsPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalResponse, setModalResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const response = await axiosInstance.post("/reset-password", {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      setModalResponse({
        status: 200,
        message: response.data.message || "رمز عبور با موفقیت تغییر کرد.",
      });
    } catch (err: any) {
      setModalResponse(
        err.response?.data || { status: err.response?.status || 500 }
      );
    } finally {
      setIsModalOpen(true);
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 dark:bg-dark-600/50 backdrop-blur-xl border border-white/10 dark:border-white/5 p-8 rounded-3xl shadow-2xl transition-all">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-3">بازنشانی رمز عبور</h2>
          <p className="text-sm text-gray-400">لطفاً رمز عبور جدید خود را وارد کنید.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">ایمیل</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent! border! border-white/10! rounded-xl px-4! py-3! text-sm text-white! focus:border-green-500! focus:ring-1! focus:ring-green-500!"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">رمز عبور جدید</label>
            <SecureInput
              id="password"
              placeholder="••••••••"
              className="w-full bg-transparent! border! border-white/10! rounded-xl px-4! py-3! text-sm text-white! focus:border-green-500! focus:ring-1! focus:ring-green-500!"
              validations={[requiredValidator()]}
              onInputHandler={(id: string, value: any, isValid: boolean) => setPassword(value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">تکرار رمز عبور جدید</label>
            <SecureInput
              id="passwordConfirmation"
              placeholder="••••••••"
              className="w-full bg-transparent! border! border-white/10! rounded-xl px-4! py-3! text-sm text-white! focus:border-green-500! focus:ring-1! focus:ring-green-500!"
              validations={[requiredValidator()]}
              onInputHandler={(id: string, value: any, isValid: boolean) => setPasswordConfirmation(value)}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-lg disabled:opacity-50"
          >
            {isPending ? "در حال ذخیره‌سازی..." : "تغییر رمز عبور"}
          </button>
        </form>
      </div>

      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAfterClose={() => {
          const status = typeof modalResponse === "object" ? modalResponse?.status : modalResponse;
          if (status === 200) {
            router.push("/login");
          }
        }}
        response={modalResponse}
      />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-8">در حال بارگذاری...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}