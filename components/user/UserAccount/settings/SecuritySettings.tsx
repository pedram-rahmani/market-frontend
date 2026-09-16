"use client";

import { useState, useCallback } from "react";
import SecureInput from "@/components/ui/SecureInput/SecureInput";
import { Rules } from "@/Validator/Rules";
import axiosInstance from "@/lib/axiosInstance";

export default function SecuritySettings() {
  const [formState, setFormState] = useState({
    currentPassword: { value: "", isValid: false },
    newPassword: { value: "", isValid: false },
    confirmPassword: { value: "", isValid: false },
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentRules = [{ value: Rules.requiredValue }];
  const passwordRules = [
    { value: Rules.requiredValue },
    { value: Rules.minValue, min: 8 },
    { value: Rules.passwordValue },
  ];
  const confirmRules = [
    { value: Rules.requiredValue },
    { value: Rules.passwordConfirmationValue },
  ];

  const handleInputHandler = useCallback((id: string, value: any, isValid: boolean) => {
    setFormState((prevState) => ({
      ...prevState,
      [id]: { value, isValid },
    }));
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (
      formState.currentPassword.isValid &&
      formState.newPassword.isValid &&
      formState.confirmPassword.isValid
    ) {
      try {
        setIsLoading(true);
        const response = await axiosInstance.put("/user/password", {
          current_password: formState.currentPassword.value,
          password: formState.newPassword.value,
          password_confirmation: formState.confirmPassword.value,
        });

        setSuccessMessage(response.data.message || "رمز عبور با موفقیت تغییر کرد.");
      } catch (error: any) {
        if (error.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("خطایی در ارتباط با سرور رخ داد.");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage("لطفاً فرم را به صورت صحیح تکمیل کنید.");
    }
  };

  return (
    <div>
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-ui-purple">
        تغییر رمز عبور
      </h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-ui-green-500/10 border border-ui-green-500/20 text-ui-green-500 text-xs sm:text-sm rounded-xl">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs sm:text-sm rounded-xl">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <SecureInput
          id="currentPassword"
          placeholder="رمز عبور فعلی"
          validations={currentRules}
          onInputHandler={handleInputHandler}
          className="input-info min-w-full text-xs sm:text-sm bg-custom-gray-400/20! dark:bg-dark-800/50! border! border-dark-600/20! dark:border-dark-600! text-text-on-light dark:text-text-on-dark focus:border-ui-purple!"
        />

        <SecureInput
          id="newPassword"
          placeholder="رمز عبور جدید"
          validations={passwordRules}
          onInputHandler={handleInputHandler}
          className="input-info min-w-full text-xs sm:text-sm bg-custom-gray-400/20! dark:bg-dark-800/50! border! border-dark-600/20! dark:border-dark-600! text-text-on-light dark:text-text-on-dark focus:border-ui-purple!"
        />

        <SecureInput
          id="confirmPassword"
          placeholder="تکرار رمز عبور جدید"
          validations={confirmRules}
          allInputs={{ password: { value: formState.newPassword.value } }}
          onInputHandler={handleInputHandler}
          className="input-info min-w-full text-xs sm:text-sm bg-custom-gray-400/20! dark:bg-dark-800/50! border! border-dark-600/20! dark:border-dark-600! text-text-on-light dark:text-text-on-dark focus:border-ui-purple!"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-ui-purple hover:bg-ui-purple/80 transition px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium cursor-pointer w-full sm:w-auto text-white text-center disabled:opacity-50"
        >
          {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
}