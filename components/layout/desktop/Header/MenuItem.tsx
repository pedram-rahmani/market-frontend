"use client";

import { Category } from "@/types/category";
import Link from "next/link";
import { memo, MouseEvent, useEffect, useState } from "react";

interface MenuItemProps {
  item: Category;
  onHover?: () => void;
  onClick?: () => void;
  onCloseMenu?: () => void;
  isActive: boolean;
  isLastLevel: boolean;
  menuItems: Category[];
  maxLevel: number;
}

const MenuItem = ({
  item,
  onHover,
  onClick,
  onCloseMenu,
  isActive,
  isLastLevel,
  menuItems,
  maxLevel,
}: MenuItemProps) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover)");
    setIsTouchDevice(!mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsTouchDevice(!e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const hasChildren = menuItems.some(
    (menuItem) => menuItem.parent_id === item.id,
  );

  const childCount = menuItems.filter(
    (menuItem) => menuItem.parent_id === item.id,
  ).length;

  let href = "#";
  if (item.parent_id === null) {
    href =
      maxLevel === 2 ? `/search/category-${item.name}` : `/search/${item.name}`;
  } else if (childCount > 0) {
    href = `/search/category-${item.id}`;
  } else {
    href = `/product-info/${item.id}/${item.name}`;
  }

  const handleMouseEnter = () => {
    if (!isTouchDevice && onHover) {
      onHover();
    }
  };

  const handleTextClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice && hasChildren && !isLastLevel) {
      e.preventDefault();
      if (onClick) onClick();
    }
  };

  return (
    <li className="relative w-full" onMouseEnter={handleMouseEnter}>
      {isTouchDevice && hasChildren && !isLastLevel ? (
        <div
          className={`
            flex items-center justify-between w-full px-4 py-3 text-sm transition-all duration-200 cursor-pointer
            ${
              isActive
                ? "text-sky-500 bg-sky-500/10 border-r-4 shadow-sm border-sky-500 font-medium"
                : "text-text-on-light/90 dark:text-text-on-dark/90 border-r-4 border-transparent hover:text-sky-500"
            }
          `}
        >
          <div onClick={handleTextClick} className="grow truncate">
            <span>{item.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <div onClick={handleTextClick}>
              <ArrowIcon isActive={isActive} />
            </div>
            <Link
              href={href}
              onClick={() => {
                if (onCloseMenu) onCloseMenu();
              }}
              title={`مشاهده صفحه ${item.name}`}
              className="p-1 text-gray-400 hover:text-sky-500 transition-colors"
            >
              <svg 
                className="size-3.5!" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </div>
      ) : (
        <Link
          href={href}
          onClick={() => {
            if (isTouchDevice && onClick) onClick();
            if (onCloseMenu) onCloseMenu();
          }}
          className={`
            flex items-center justify-between w-full px-4 py-3 text-sm transition-all duration-200
            ${
              isActive
                ? "text-sky-500 bg-sky-500/10 border-r-4 shadow-sm border-sky-500 font-medium"
                : "text-text-on-light/90 dark:text-text-on-dark/90 border-r-4 border-transparent hover:text-sky-500"
            }
          `}
        >
          <span>{item.name}</span>
          {hasChildren && !isLastLevel && <ArrowIcon isActive={isActive} />}
        </Link>
      )}
    </li>
  );
};

export default memo(MenuItem);

const ArrowIcon = ({ isActive }: { isActive: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`size-4! transition-transform duration-200 ${isActive ? "rotate-90" : "rotate-0"}`}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);