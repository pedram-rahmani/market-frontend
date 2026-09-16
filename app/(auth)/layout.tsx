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
    <div className="relative  w-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/auth-bg.png')" }}
      />
      <div className="absolute inset-0 bg-[#050b1e]/80 backdrop-blur-sm" />
      <div className="relative z-10 w-full h-screen flex flex-col justify-center max-w-md  overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default UserEntryLayout;
