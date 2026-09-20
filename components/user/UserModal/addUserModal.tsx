"use client";

import { useState, useRef, useCallback } from "react";
import Select from "@/components/ui/Form/Select";
import useClickOutside from "@/store/hooks/useClickOutside";
import SecureInput from "@/components/ui/SecureInput/SecureInput";
import useLockBodyScroll from "@/store/hooks/useLockBodyScroll";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import {
  getPersianErrorMessage,
  SUCCESS_MESSAGES,
  VALIDATION_MESSAGES,
} from "@/lib/errorMapper";
import ValidationInput from "@/components/ui/Form/ValidationInput";
import {
  emailValidator,
  maxLengthValidator,
  minValidator,
  nameValidator,
  passwordValidator,
  phoneValidator,
  requiredValidator,
  usernameValidator,
} from "@/Validator/Rules";

export function AddUserModal({ isOpen, onClose, onAdd, canAssignStaff = false }: any) {
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    username:'',
    password: '', 
    role: 'user', 
    phone: '' 
  });

  const [isLoading, setIsLoading] = useState(false);
  const [fieldValidity, setFieldValidity] = useState<Record<string, boolean>>({});

  // استیت‌های مربوط به کنترل پاپ‌آپ
  const [popup, setPopup] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({
    isOpen: false,
    message: "",
    type: "success"
  });

  const modalRef = useRef<HTMLDivElement>(null!);
  useLockBodyScroll(isOpen);
  
  const handlePasswordInput = useCallback((_id: string, value: string, isValid: boolean) => {
    setFormData((current) =>
      current.password === value ? current : { ...current, password: value },
    );
    setFieldValidity((current) => ({ ...current, password: isValid }));
  }, []);

  const handleValidatedInput = (id: string, value: string, isValid: boolean) => {
    setFormData((current) => ({ ...current, [id]: value }));
    setFieldValidity((current) => ({ ...current, [id]: isValid }));
  };

  useClickOutside(onClose, modalRef);

  const handleSubmit = async () => {
    const requiredFields = ["name", "email", "username", "password"];
    if (!requiredFields.every((field) => fieldValidity[field])) {
      setPopup({
        isOpen: true,
        message: VALIDATION_MESSAGES.formInvalid,
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // فرض بر اینه که onAdd در صورت موفقیت کار رو انجام میده و در صورت خطا اکسپشن (Error) پرت میکنه
      await onAdd(formData); 

      // نمایش پیام موفقیت
      setPopup({
        isOpen: true,
        message: SUCCESS_MESSAGES.userCreated,
        type: "success"
      });

      // بعد از چند ثانیه که پاپ‌آپ بسته شد، مودال اصلی رو هم می‌بندیم
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error: any) {
      // نمایش پیام خطا (گرفتن پیام از ارور بک‌اند یا یک متن پیش‌فرض)
      const errorMsg = getPersianErrorMessage(error, "خطایی در ثبت کاربر رخ داد. لطفاً دوباره تلاش کنید.");
      setPopup({
        isOpen: true,
        message: errorMsg,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-800/60 backdrop-blur-sm">
        <div 
          ref={modalRef} 
          className="bg-light dark:bg-dark-800 p-6 rounded-2xl w-full max-w-sm shadow-xl flex flex-col gap-4"
        >
          <h3 className="text-lg font-bold">افزودن کاربر جدید</h3>
          
          <div className="flex flex-col gap-3">
            <ValidationInput
              id="name"
              placeholder="نام"
              className="input-info w-full"
              validations={[
                requiredValidator(),
                minValidator(3),
                maxLengthValidator(30),
                nameValidator(),
              ]}
              onInputHandler={handleValidatedInput}
            />
            <ValidationInput
              id="email"
              type="email"
              placeholder="ایمیل"
              className="input-info w-full ltr"
              validations={[
                requiredValidator(),
                maxLengthValidator(38),
                emailValidator(),
              ]}
              onInputHandler={handleValidatedInput}
            />
            <ValidationInput
              id="username"
              placeholder="نام کاربری"
              className="input-info w-full"
              validations={[
                requiredValidator(),
                minValidator(3),
                maxLengthValidator(30),
                usernameValidator(),
              ]}
              onInputHandler={handleValidatedInput}
            />
            <ValidationInput
              id="phone"
              type="tel"
              placeholder="شماره تماس"
              className="input-info w-full ltr"
              validations={[phoneValidator()]}
              onInputHandler={handleValidatedInput}
            />
            <SecureInput
              id="new-user-password"
              placeholder="رمز عبور"
              validations={[requiredValidator(), passwordValidator()]}
              autoComplete="new-password"
              onInputHandler={handlePasswordInput}
              className="input-info"
            />
          </div>

          <div className="w-full">
            <label className="text-xs text-custom-gray-400 mb-1 block">نقش کاربر</label>
            <Select
              variant="simple"
              className="w-full"
              value={formData.role}
              onChange={(val) => setFormData({ ...formData, role: val })}
              options={[
                { value: "user", label: "کاربر عادی" },
                ...(canAssignStaff
                  ? [
                      { value: "co-admin", label: "ادمین ارشد" },
                      { value: "admin", label: "مدیر کل" },
                    ]
                  : []),
              ]}
            />
          </div>
          
          <div className="flex gap-3 mt-2">
            <button 
              type="button"
              disabled={isLoading}
              onClick={onClose} 
              className="flex-1 py-2.5 rounded-xl bg-custom-gray-300/50 dark:bg-custom-gray-300/50 text-text-on-light dark:text-text-on-dark disabled:opacity-50"
            >
              انصراف
            </button>
            <button 
              type="button"
              disabled={isLoading}
              onClick={handleSubmit} 
              className="flex-1 py-2.5 rounded-xl bg-violet-600 text-text-on-dark flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>در حال افزودن...</span>
                </>
              ) : (
                "افزودن"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* پاپ‌آپ موفقیت یا خطا که روی همه چیز قرار می‌گیرد */}
      <SimplePopup
        isOpen={popup.isOpen}
        onClose={() => setPopup(prev => ({ ...prev, isOpen: false }))}
        message={popup.message}
        type={popup.type}
      />
    </>
  );
}