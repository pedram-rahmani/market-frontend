"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import MessageModal from "@/components/feedback/MessageModal/MessageModal";
import ValidationInput from "@/components/ui/Form/ValidationInput";
import Button from "@/components/ui/Form/Button";
import Link from "next/link";
import useForm from "@/store/hooks/useForm";
import { requiredValidator } from "@/Validator/Rules";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalResponse, setModalResponse] = useState<any>(null);

  const [formState, onInputHandler] = useForm({
    email: { value: "", isValid: false },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const response = await axiosInstance.post("/forgot-password", {
        email: formState.inputs.email.value,
      });

      // گرفتن توکن از پاسخ سرور
      const token = response.data.token || response.data.reset_token;
      const email = formState.inputs.email.value;

      if (token) {
        // ریدایرکت خودکار به صفحه بازنشانی رمز عبور همراه با پارامترها
        router.push(`/reset-password?email=${encodeURIComponent(email)}&token=${token}`);
        return;
      }

      // اگر توکنی در پاسخ نبود (حالت استاندارد که ایمیل می‌شود)
      setModalResponse({
        status: 200,
        message: response.data.message || "لینک بازیابی رمز عبور ارسال شد.",
      });
      setIsModalOpen(true);
    } catch (err: any) {
      setModalResponse(
        err.response?.data || { status: err.response?.status || 500 }
      );
      setIsModalOpen(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 dark:bg-dark-600/50 backdrop-blur-xl border border-white/10 dark:border-white/5 p-8 rounded-3xl shadow-2xl transition-all">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-3">فراموشی رمز عبور</h2>
          <p className="text-sm text-gray-400">
            ایمیل خود را وارد کنید تا دستورالعمل بازیابی برای شما ارسال شود.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ValidationInput
            id="email"
            type="email"
            placeholder="example@gmail.com"
            className="input-validation"
            validations={[requiredValidator()]}
            onInputHandler={onInputHandler}
          />

          <Button
            type="submit"
            className="btn btn--submit"
            disabled={!formState.isFormValid || isPending}
          >
            {isPending ? "در حال ارسال..." : "ارسال لینک بازیابی"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          <Link
            href="/login"
            className="text-green-500 font-bold hover:underline underline-offset-4"
          >
            بازگشت به صفحه ورود
          </Link>
        </div>
      </div>

      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        response={modalResponse}
      />
    </div>
  );
}