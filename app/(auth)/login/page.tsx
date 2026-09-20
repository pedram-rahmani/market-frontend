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
        const { identifier, password } = formState.inputs;
        const response = await axiosInstance.post("/login", {
          identifier: identifier.value,
          password: password.value,
        });

        const token = response.data.token;
        const user = response.data.user || response.data.data;

        if (!token || !user) {
          throw new Error("پاسخ سرور فاقد توکن یا اطلاعات کاربر است");
        }

        setResult({ status: 201 });
        dispatch(setUser({ user, token }));

        localStorage.setItem("token", token);
        localStorage.setItem("user_role", user.role);
        localStorage.setItem("user_id", String(user.id));
        localStorage.setItem("user", JSON.stringify(user));

      } catch (err: any) {
        console.error("Login Error:", err);
        setResult(
          err.response?.data || { status: err.response?.status || 500, message: err.message }
        );
      } finally {
        setIsModalOpen(true);
        setIsPending(false);
      }
    },
    [formState, dispatch],
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
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

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#08122d]/80 p-5 shadow-2xl shadow-violet-950/30 backdrop-blur-xl transition-all sm:p-8">
        <div className="pointer-events-none absolute -left-24 -top-24 size-56 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 size-56 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative z-10 mb-8 sm:mb-10">
          <p className="text-xs font-medium text-cyan-300">دوباره خوش آمدید</p>
          <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">ورود به حساب</h2>
        </div>

        <form onSubmit={userLogin} className="relative z-10 space-y-4">
          <ValidationInput
            id="identifier"
            type="text"
            placeholder="ایمیل یا نام کاربری"
            className="input-validation"
            showRequiredMarker={false}
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
            autoComplete="current-password"
            className="input-validation"
            showRequiredMarker={false}
            validations={[
              requiredValidator(),
              minValidator(8),
              maxLengthValidator(16),
              passwordValidator(),
            ]}
            onInputHandler={onInputHandler}
          />

          <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
            <Checkbox
              id="rememberMe"
              label="مرا به خاطر بسپار"
              required={false}
              onInputHandler={onInputHandler}
            />
            <Link
              href="/forgot-password"
              className="text-cyan-300 transition-colors hover:text-cyan-200"
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

        <div className="relative z-10 mt-7 border-t border-white/10 pt-5 text-center text-xs text-gray-400 sm:text-sm">
          هنوز عضو نشده‌اید؟{" "}
          <Link
            href="/register"
            className="font-bold text-cyan-300 underline-offset-4 hover:text-cyan-200 hover:underline"
          >
            ساخت حساب جدید
          </Link>
        </div>
      </div>
    </div>
  );
}
