"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ChatToggleButton from "./ChatToggleButton";
import ChatBox from "./ChatBox";
import { useAuth } from "@/store/hooks/useAuth";
import axiosInstance from "@/lib/axiosInstance";

export default function SupportChatWidget() {
  const { user, isLoggedIn } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);

  // check if the user has an active conversation on login
  useEffect(() => {
    if (!isLoggedIn) return;
    axiosInstance
      .get("/chat/conversation")
      .then((res) => {
        if (res.data && res.data.id) {
          setConversationId(res.data.id);
        }
      })
      .catch(() => {
        // error
      });
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  const isAdminOrStaff = user?.role === "admin" || user?.role === "co-admin";

  return (
    <>
      {/* Floating toggle button */}
      <ChatToggleButton
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen((prev) => !prev)}
        conversationId={conversationId} 
      />

      {/* user chat modal */}
      {!isAdminOrStaff && isChatOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-0 backdrop-blur-sm sm:p-4"
          onClick={() => setIsChatOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full flex-col bg-white dark:bg-dark-900 sm:h-144 sm:max-w-xl sm:rounded-3xl sm:shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-4 dark:border-white/10">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-gray-800 dark:text-white">
                  پشتیبانی آنلاین
                </p>
                <p className="text-[11px] text-gray-400">سوالات و مشکلات خود را با ما در میان بگذارید</p>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="flex size-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 dark:hover:bg-white/10"
                aria-label="بستن"
              >
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Box Body */}
            <div className="flex-1 overflow-hidden">
              <ChatBox 
                conversationId={conversationId} 
                isAdmin={false} 
                onConversationCreated={(newId) => setConversationId(newId)}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}