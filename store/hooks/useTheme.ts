"use client";

import { useState, useEffect } from "react";

function useTheme(): [string, () => void] {
  const [theme, setTheme] = useState<string>("light"); // Default to "light" to avoid SSR errors
  const [isClient, setIsClient] = useState<boolean>(false); // Track if running on the client

  useEffect(() => {
    setIsClient(true); // Now we are on the client

    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");

      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setTheme(prefersDark ? "dark" : "light");
      }
    }
  }, []);

  useEffect(() => {
    if (!isClient) return; // Prevent running on SSR

    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    const wDark = window.matchMedia("(prefers-color-scheme: dark)");
    wDark.addEventListener("change", handleSystemThemeChange);

    return () => {
      wDark.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme, isClient]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return [theme, toggleTheme];
}

export default useTheme;
