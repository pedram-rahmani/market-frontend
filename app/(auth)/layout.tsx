"use client";

import { ReactNode, useEffect } from "react";

interface UserEntryLayoutProps {
  children: ReactNode;
}

const UserEntryLayout = ({ children }: UserEntryLayoutProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="relative w-screen h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/auth-bg.png')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#050b1e]/80 backdrop-blur-sm" />

      {/* Form Container */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default UserEntryLayout;