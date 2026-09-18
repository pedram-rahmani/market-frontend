"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";

import useForm from "@/store/hooks/useForm";
import ValidationInput from "@/components/ui/Form/ValidationInput";
import SecureInput from "@/components/ui/SecureInput/SecureInput";
import Button from "@/components/ui/Form/Button";
import MessageModal from "@/components/feedback/MessageModal/MessageModal";

import {
  requiredValidator,
  minValidator,
  maxLengthValidator,
  emailValidator,
  passwordValidator,
  usernameValidator,
  passwordConfirmationValidator,
} from "@/Validator/Rules";

const Register: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [result, setResult] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [formState, onInputHandler] = useForm(
    {
      name: { value: "", isValid: false },
      username: { value: "", isValid: false },
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
      passwordConfirmation: { value: "", isValid: false },
    }
  );

  const newUserRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const newUserInfo = {
      name: formState.inputs.name.value,
      username: formState.inputs.username.value,
      email: formState.inputs.email.value,
      password: formState.inputs.password.value,
      password_confirmation: formState.inputs.passwordConfirmation.value,
    };

    try {
      const response = await axiosInstance.post("/register", newUserInfo);
      const { user, token } = response.data;

      setResult({ status: 201 });

      dispatch(setUser({ user, token }));

      localStorage.setItem("token", token);
      localStorage.setItem("user_role", user.role);
      localStorage.setItem("user_id", user.id.toString());
      localStorage.setItem("user", JSON.stringify(user));

    } catch (err: any) {
      setResult(err.response?.data || { status: err.response?.status || 500 });
    } finally {
      setIsModalOpen(true);
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-6">
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAfterClose={() => {
            const status = typeof result === "object" ? result?.status : result;
            if (status === 201) router.push("/");
        }}
        response={result}
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#08122d]/80 p-5 shadow-2xl shadow-violet-950/30 backdrop-blur-xl transition-all sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 size-56 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="relative z-10 mb-8 sm:mb-10">
          <p className="text-xs font-medium text-cyan-300">به خانواده ما بپیوندید</p>
          <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">ساخت حساب جدید</h2>
        </div>

        <form className="relative z-10 space-y-4" onSubmit={newUserRegister}>
          <div className="flex flex-col gap-y-4">
            <ValidationInput id="name" type="text" autoComplete="name" placeholder="نام و نام خانوادگی" className="input-validation" validations={[requiredValidator(), minValidator(3), maxLengthValidator(30)]} onInputHandler={onInputHandler} />
            <ValidationInput id="username" type="text" autoComplete="username" placeholder="نام کاربری" className="input-validation" validations={[requiredValidator(), minValidator(3), maxLengthValidator(30), usernameValidator()]} onInputHandler={onInputHandler} />
            <ValidationInput id="email" type="email" autoComplete="email" placeholder="آدرس ایمیل" className="input-validation ltr" validations={[requiredValidator(), maxLengthValidator(38), emailValidator()]} onInputHandler={onInputHandler} />
            <SecureInput id="password" autoComplete="new-password" placeholder="رمز عبور" className="input-validation" validations={[requiredValidator(), passwordValidator()]} onInputHandler={onInputHandler} />
            <SecureInput id="passwordConfirmation" autoComplete="new-password" placeholder="تکرار رمز عبور" className="input-validation" validations={[requiredValidator(), passwordConfirmationValidator()]} allInputs={formState.inputs} onInputHandler={onInputHandler} />
          </div>

          <Button
            type="submit"
            className={`group relative mt-2 flex w-full justify-center rounded-2xl border border-transparent px-4 py-3.5 text-sm font-bold text-white transition-all duration-300 sm:py-4 ${
              formState.isFormValid && !isPending
                ? "bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
            disabled={!formState.isFormValid || isPending}
          >
            {isPending ? "در حال پردازش..." : "ثبت نام"}
          </Button>
        </form>

        <div className="relative z-10 mt-7 border-t border-white/10 pt-5 text-center">
          <p className="text-xs text-gray-400 sm:text-sm">
            قبلاً حساب ساخته‌اید؟{" "}
            <a href="/login" className="font-bold text-cyan-300 transition-colors hover:text-cyan-200">
              وارد شوید
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;