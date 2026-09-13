"use client";

import { useState } from "react";
import ValidationInput from "@/components/ui/Form/ValidationInput";
import { ValidationRule } from "@/Validator/Rules";

interface SecureInputProps {
  id: string;
  placeholder: string;
  validations: ValidationRule[];
  onInputHandler: (id: string, value: any, isValid: boolean) => void;
  className?: string;
  allInputs?: any;
}

export default function SecureInput({
  id,
  placeholder,
  validations,
  onInputHandler,
  className = "",
  allInputs,
}: SecureInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ValidationInput
      id={id}
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      validations={validations}
      onInputHandler={onInputHandler}
      allInputs={allInputs}
      className={`${className} [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden`}
    >
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-black/60 dark:hover:text-white transition-colors z-10"
      >
        {showPassword ? (
          <svg className="size-5!" viewBox="0 0 24 24">
            <path d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        ) : (
          <svg className="size-5!" viewBox="0 0 24 24">
            <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.644C3.67 8.5 7.652 6 12 6c4.348 0 8.332 2.5 9.964 5.678a1.012 1.012 0 0 1 0-.644C20.33 15.5 16.348 18 12 18c-4.348 0-8.332-2.5-9.964-5.678z" />
            <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
          </svg>
        )}
      </button>
    </ValidationInput>
  );
}
