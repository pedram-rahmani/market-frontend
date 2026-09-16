"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import ReactDOM from "react-dom";
import { ERROR_MAPPINGS } from "@/lib/errorMappings";
import { ApiResponse } from "@/types/api";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAfterClose?: () => void;
  response: ApiResponse | number | null;
}

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  onAfterClose,
  response,
}) => {
  const [width, setWidth] = useState(100);
  const [mounted, setMounted] = useState(false);
  const wasOpenRef = useRef(isOpen);

  const statusCode = useMemo(() => {
    if (typeof response === "object" && response !== null)
      return response.status;
    if (typeof response === "number") return response;
    return 500;
  }, [response]);

  const isSuccess = statusCode >= 200 && statusCode < 300;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const totalDuration = 2500;
    const intervalTime = 10;
    const step = 100 / (totalDuration / intervalTime);
    setWidth(100);
    const interval = setInterval(() => {
      setWidth((prev) => (prev - step <= 0 ? 0 : prev - step));
    }, intervalTime);
    const timer = setTimeout(() => {
      onClose();
    }, totalDuration);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen && onAfterClose && isSuccess)
      onAfterClose();
    wasOpenRef.current = isOpen;
  }, [isOpen, onAfterClose, isSuccess]);

  const getErrorMessage = useCallback((): string => {
    // message
    if (
      typeof response === "object" &&
      response !== null &&
      "message" in response &&
      response.message
    ) {
      return response.message as string;
    }

    // failed (Validation Errors)
    if (typeof response === "object" && response !== null && response.errors) {
      const firstField = Object.keys(response.errors)[0];
      const rawMessage = response.errors[firstField][0];

      const matchedKey = Object.keys(ERROR_MAPPINGS).find((key) =>
        rawMessage.includes(key),
      );
      return matchedKey ? ERROR_MAPPINGS[matchedKey] : rawMessage;
    }

    // failed (error code)
    if (
      typeof response === "object" &&
      response !== null &&
      response.error_code
    ) {
      return (
        ERROR_MAPPINGS[response.error_code] ||
        response.message ||
        "خطایی رخ داد."
      );
    }

    // success
    if (isSuccess) {
      return (
        ERROR_MAPPINGS[statusCode.toString()] || "عملیات با موفقیت انجام شد."
      );
    }

    // default (for server errors)
    return (
      (statusCode
        ? ERROR_MAPPINGS[statusCode.toString()]
        : "خطای ناشناخته در سرور") || "خطایی رخ داد."
    );
  }, [response, statusCode, isSuccess]);

  if (!isOpen || !mounted) return null;
  const portalElement = document.getElementById("modal-portal");
  if (!portalElement) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-99999 isolate p-4"
      onClick={onClose}
    >
      <div
        className={`relative max-w-sm w-full bg-white rounded-xl shadow-2xl p-6 border-r-8 overflow-hidden transition-all ${
          isSuccess ? "border-green-600 text-green-900" : "border-red-600 text-red-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`absolute top-0 left-0 h-1.5 ${
            isSuccess ? "bg-green-600" : "bg-red-600"
          }`}
          style={{ width: `${width}%` }}
        />
        <div className="flex items-start gap-4">
          <p className="font-bold text-lg leading-relaxed">
            {getErrorMessage()}
          </p>
        </div>
      </div>
    </div>,
    portalElement,
  );
};

export default MessageModal;