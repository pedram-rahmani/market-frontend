"use client";

import React, { useEffect, useReducer, useRef, ReactNode } from "react";
import validator from "@/Validator/Validator";
import { ValidationRule } from "@/Validator/Rules";

interface InputProps {
  id: string;
  type?: string;
  placeholder?: string;
  className?: string;
  validations: ValidationRule[];
  onInputHandler: (id: string, value: any, isValid: boolean) => void;
  elem?: "input" | "textarea";
  allInputs?: any;
  children?: ReactNode;
}

const inputReducer = (state: any, action: any) => {
  switch (action.type) {
    case "CHANGE":
      const errors = validator(action.value, action.validations, action.allInputs) || [];
      return {
        ...state,
        value: action.value,
        isValid: errors.length === 0,
        errorMessages: errors,
        touched: true,
      };
    default:
      return state;
  }
};

export default function ValidationInput({
  id,
  type = "text",
  placeholder,
  className,
  validations,
  onInputHandler,
  elem,
  allInputs,
  children,
}: InputProps) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: "",
    isValid: false,
    errorMessages: [],
    touched: false,
  });

  const { value, isValid, errorMessages, touched } = inputState;
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  // pass information to parent form
  useEffect(() => {
    onInputHandler(id, value, isValid);
  }, [id, value, isValid, onInputHandler]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({ type: "CHANGE", value: e.target.value, validations, allInputs });
  };

  // browser's autofill management (password , email ,...) 
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current?.value && !touched) {
        dispatch({ type: "CHANGE", value: inputRef.current.value, validations, allInputs });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [validations, allInputs, touched]);

  const statusClass = touched
    ? isValid
      ? "border-green-500 bg-green-500/5 ring-1 ring-green-500/20" 
      : "border-red-500/50 ring-2 ring-red-500/10"
    : "border-white/10 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500/20";

  const commonProps = {
    id,
    value,
    onChange: onChangeHandler,
    placeholder,
    className: `w-full bg-transparent outline-none border-none! ring-0! py-3 px-4 transition-all duration-200 ${className}`,
    ref: inputRef,
  };

  return (
    <div className="w-full">
      <div className={`relative w-full border rounded-xl transition-all duration-300 ${statusClass}`}>
        {elem === "textarea" ? (
          <textarea {...(commonProps as any)} rows={4} />
        ) : (
          <input {...(commonProps as any)} type={type} />
        )}
        
        {/* eye icon */}
        {children}
      </div>

      {/* show errors */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          errorMessages?.length && touched ? "max-h-40 mt-2 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 space-y-1">
          {errorMessages.map((error: string, index: number) => (
            <p 
              key={index} 
              className="text-red-400 text-[10px] sm:text-xs flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300"
            >
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
              <span className="leading-relaxed">{error}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}