"use client";

import { useState, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";
import Link from "next/link";

import ValidationInput from "@/components/ui/Form/ValidationInput";
import SecurInput from "@/components/ui/SecureInput/SecureInput";
import Button from "@/components/ui/Form/Button";
import MessageModal from "@/components/feedback/MessageModal/MessageModal";
import Checkbox from "@/components/ui/Form/Checkbox";

import useForm from "@/store/hooks/useForm";
import {
  requiredValidator,
  minValidator,
  maxLengthValidator,
  passwordValidator,
} from "@/Validator/Rules";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [formState, onInputHandler] = useForm({
    identifier: { value: "", isValid: false },
    password: { value: "", isValid: false },
    rememberMe: { value: false, isValid: true },
  });

  const userLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsPending(true);

      try {
        const { identifier, password, rememberMe } = formState.inputs;
        const response = await axiosInstance.post("/login", {
          identifier: identifier.value,
          password: password.value,
          remember: rememberMe.value,
        });

        const { user, token } = response.data;

        // success
        setResult({ status: 201 });

        dispatch(setUser({ user, token }));

        // انتخاب محل ذخیره‌سازی بر اساس وضعیت تیک "مرا به خاطر بسپار"
        const storage = rememberMe.value ? localStorage : sessionStorage;

        // پاک کردن فضای ذخیره‌سازی دیگر برای جلوگیری از تداخل
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        // ذخیره اطلاعات در فضای انتخاب شده
        storage.setItem("token", token);
        storage.setItem("user_role", user.role);
        storage.setItem("user_id", user.id.toString());

      } catch (err: any) {
        setResult(
          err.response?.data || { status: err.response?.status || 500 },
        );
      } finally {
        setIsModalOpen(true);
        setIsPending(false);
      }
    },
    [formState, dispatch],
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAfterClose={() => {
          // if (result?.status === 201) router.push("/");
          const status = typeof result === "object" ? result?.status : result;
          if (status === 201) router.push("/");
        }}
        response={result}
      />

      <div className="w-full max-w-md bg-white/5 dark:bg-dark-600/50 backdrop-blur-xl border border-white/10 dark:border-white/5 p-8 rounded-3xl shadow-2xl transition-all">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-3">ورود به حساب</h2>
          <p className="text-sm text-gray-400">خوشحالم دوباره می‌بینمت</p>
        </div>

        <form onSubmit={userLogin} className="space-y-6">
          <ValidationInput
            id="identifier"
            type="text"
            placeholder="ایمیل یا نام کاربری"
            className="input-validation"
            validations={[
              requiredValidator(),
              minValidator(3),
              maxLengthValidator(30),
            ]}
            onInputHandler={onInputHandler}
          />

          <SecurInput
            id="password"
            placeholder="رمز عبور"
            className="input-validation"
            validations={[
              requiredValidator(),
              minValidator(8),
              maxLengthValidator(16),
              passwordValidator(),
            ]}
            onInputHandler={onInputHandler}
          />

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <Checkbox
              id="rememberMe"
              label="مرا به خاطر بسپار"
              required={false}
              onInputHandler={onInputHandler}
            />
            <Link
              href="/forgot-password"
              className="text-gray-400 hover:text-green-500 transition-colors"
            >
              فراموشی رمز عبور؟
            </Link>
          </div>

          <Button
            type="submit"
            className="btn btn--submit"
            disabled={!formState.isFormValid || isPending}
          >
            {isPending ? "در حال بررسی..." : "ورود به پنل"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          هنوز عضو نشده‌اید؟{" "}
          <Link
            href="/register"
            className="text-green-500 font-bold hover:underline underline-offset-4"
          >
            ساخت حساب جدید
          </Link>
        </div>
      </div>
    </div>
  );
}
