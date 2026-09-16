"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "./Navbar";
import HeaderActions from "./HeaderActions";
import { Category } from "@/types/category";

interface HeaderProps {
  menuItems: Category[];
}

export default function Header({ menuItems }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`header ${isScrolled ? "sticky-header" : ""}`}
    >
      <div className="hidden md:flex items-center justify-between mx-auto w-full h-24 px-3 md:px-4 lg:px-12 transition-all">
        <Navbar menuItems={menuItems} />
        <HeaderActions />
      </div>
    </header>
  );
}