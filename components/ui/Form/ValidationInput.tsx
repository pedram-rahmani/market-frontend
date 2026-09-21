"use client";

import React, { useEffect, useReducer, useRef, ReactNode } from "react";
import validator from "@/Validator/Validator";
import { Rules, ValidationRule } from "@/Validator/Rules";
import RequiredFieldMarker from "@/components/ui/RequiredFieldMarker/RequiredFieldMarker";

interface InputProps {
  id: string;
  type?: string;
  placeholder?: string;
  value?: string;
  className?: string;
  validations?: ValidationRule[];
  onInputHandler: (id: string, value: any, isValid: boolean) => void;
  elem?: "input" | "textarea";
  allInputs?: any;
  autoComplete?: string;
  showRequiredMarker?: boolean;
  children?: ReactNode;
}

const inputReducer = (state: any, action: any) => {
  switch (action.type) {
    case "CHANGE":
      const errors =
        validator(action.value, action.validations, action.allInputs) || [];
      const isValid = errors.length === 0;
      const hasSameErrors =
        state.errorMessages.length === errors.length &&
        state.errorMessages.every(
          (error: string, index: number) => error === errors[index],
        );

      if (
        state.value === action.value &&
        state.isValid === isValid &&
        state.touched &&
        hasSameErrors
      ) {
        return state;
      }

      return {
        ...state,
        value: action.value,
        isValid,
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
  value: controlledValue,
  className,
  validations = [],
  onInputHandler,
  elem,
  allInputs,
  autoComplete,
  showRequiredMarker = true,
  children,
}: InputProps) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: "",
    isValid: false,
    errorMessages: [],
    touched: false,
  });

  const { value, isValid, errorMessages, touched } = inputState;
  const isRequired = validations.some(
    (validation) => validation.value === Rules.requiredValue,
  );
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const hasUserChangedValue = useRef(false);
  const onInputHandlerRef = useRef(onInputHandler);
  const lastReportedValue = useRef<{
    id: string;
    value: string;
    isValid: boolean;
  } | null>(null);
  const validationsRef = useRef(validations);
  const allInputsRef = useRef(allInputs);

  validationsRef.current = validations;
  allInputsRef.current = allInputs;

  useEffect(() => {
    onInputHandlerRef.current = onInputHandler;
  }, [onInputHandler]);

  // pass information to parent form
  useEffect(() => {
    if (controlledValue !== undefined && !hasUserChangedValue.current) {
      return;
    }

    if (
      lastReportedValue.current?.id === id &&
      lastReportedValue.current.value === value &&
      lastReportedValue.current.isValid === isValid
    ) {
      return;
    }

    lastReportedValue.current = { id, value, isValid };
    onInputHandlerRef.current(id, value, isValid);
  }, [id, value, isValid]);

  const onChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    hasUserChangedValue.current = true;
    dispatch({
      type: "CHANGE",
      value: e.target.value,
      validations: validationsRef.current,
      allInputs: allInputsRef.current,
    });
  };

  // browser's autofill management (password , email ,...)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        controlledValue === undefined &&
        inputRef.current?.value &&
        !touched
      ) {
        hasUserChangedValue.current = true;
        dispatch({
          type: "CHANGE",
          value: inputRef.current.value,
          validations: validationsRef.current,
          allInputs: allInputsRef.current,
        });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [controlledValue, touched]);

  const statusClass = touched
    ? isValid
      ? "border-green-500 bg-green-500/5 ring-1 ring-green-500/20"
      : "border-red-500/50 ring-2 ring-red-500/10"
    : "border-white/10 focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500/20";

  const commonProps = {
    id,
    value: controlledValue ?? value,
    onChange: onChangeHandler,
    placeholder,
    autoComplete,
    required: isRequired,
    "aria-required": isRequired,
    className: `block box-border min-w-0 w-full outline-none py-3 px-4 transition-all duration-200 ${className}`,
    ref: inputRef,
  };

  return (
    <div className="w-full">
      <div
        className={`relative w-full border rounded-xl transition-all duration-300 ${statusClass}`}
      >
        {isRequired && showRequiredMarker && <RequiredFieldMarker />}
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
          errorMessages?.length && touched
            ? "max-h-40 mt-2 opacity-100"
            : "max-h-0 opacity-0"
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
