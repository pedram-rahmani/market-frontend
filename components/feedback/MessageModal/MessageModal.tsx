"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import ReactDOM from "react-dom";
import { getPersianErrorMessage } from "@/lib/errorMapper";
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

  // Using the centralized error mapper function to keep code DRY and clean
  const getErrorMessage = useCallback((): string => {
    // Wrap the response into an Axios-like error structure if it's passed as ApiResponse
    const errorLikeObject = {
      response: {
        status: statusCode,
        data: typeof response === "object" ? response : { message: response },
      },
    };

    return getPersianErrorMessage(errorLikeObject);
  }, [response, statusCode]);

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