"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/authSlice";

import useForm from "@/store/hooks/useForm";
import ValidationInput from "@/components/ui/Form/ValidationInput";
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

      // موفقیت: استتوس 201 برای مودال
      setResult({ status: 201 });

      dispatch(setUser({ user, token }));
      localStorage.setItem("token", token);
    } catch (err: any) {
      // خطا: کل پاسخ سرور را به مودال می‌سپاریم
      setResult(err.response?.data || { status: err.response?.status || 500 });
    } finally {
      setIsModalOpen(true);
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // اگر موفقیت (201) بود، ریدایرکت کن
        onAfterClose={() => {
            const status = typeof result === "object" ? result?.status : result;
            if (status === 201) router.push("/");
        }}
        response={result}
      />

      <div className="w-full max-w-md bg-white/5 dark:bg-dark-600/50 backdrop-blur-xl border border-white/10 dark:border-white/5 p-8 rounded-3xl shadow-2xl transition-all space-y-5">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-3">خوش آمدید</h2>
          <p className="text-sm text-gray-400">خوشحالیم قراره به جمع ما بپیوندی</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={newUserRegister}>
          <div className="flex flex-col gap-y-4">
            <ValidationInput id="name" type="text" placeholder="نام و نام خانوادگی" className="input-validation" validations={[requiredValidator(), minValidator(3), maxLengthValidator(30)]} onInputHandler={onInputHandler} />
            <ValidationInput id="username" type="text" placeholder="نام کاربری" className="input-validation" validations={[requiredValidator(), minValidator(3), maxLengthValidator(30), usernameValidator()]} onInputHandler={onInputHandler} />
            <ValidationInput id="email" type="email" placeholder="آدرس ایمیل" className="input-validation ltr" validations={[requiredValidator(), maxLengthValidator(38), emailValidator()]} onInputHandler={onInputHandler} />
            <ValidationInput id="password" type="password" placeholder="رمز عبور" className="input-validation" validations={[requiredValidator(), passwordValidator()]} onInputHandler={onInputHandler} />
            <ValidationInput id="passwordConfirmation" type="password" placeholder="تکرار رمز عبور" className="input-validation" validations={[requiredValidator(), passwordConfirmationValidator()]} allInputs={formState.inputs} onInputHandler={onInputHandler} />
          </div>

          <Button
            type="submit"
            className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white transition-all duration-300 ${
              formState.isFormValid && !isPending
                ? "bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
            disabled={!formState.isFormValid || isPending}
          >
            {isPending ? "در حال پردازش..." : "ثبت نام"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            قبلاً حساب ساخته‌اید؟{" "}
            <a href="/login" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
              وارد شوید
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;