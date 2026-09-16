"use client";

import { Category } from "@/types/category";

export default function CategoryRow({
  category,
  permissions,
  onAddSub,
  onEdit,
  onDelete,
  className,
}: {
  category: Category;
  permissions: {
    canEdit: boolean;
    canDelete: boolean;
    canAddSub: boolean;
  };
  onAddSub: (id: number) => void;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}) {
  const indent = (category.level - 1) * 16;

  const levelStyles = {
    1: "bg-light dark:bg-dark-900/20 border border-custom-gray-100 dark:border-dark-600",
    2: "bg-ui-purple/10 dark:bg-ui-purple/12 border-r-4 border-r-violet-400",
    3: "bg-blue-200/35 dark:bg-ui-blue-900/70 border-r-4 border-r-blue-400",
  };

  const getLevelStyle = () => {
    if (category.level === 1) return levelStyles[1];
    if (category.level === 2) return levelStyles[2];
    return levelStyles[3];
  };

  const getBadgeStyle = () => {
    if (category.level === 1)
      return "bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400";
    if (category.level === 2)
      return "bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400";
    return "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400";
  };

  return (
    <div
      className={`p-4 rounded-xl shadow-sm transition-all duration-300 mt-2 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 ${getLevelStyle()} ${className}`}
      style={{ marginRight: `${indent}px` }}
    >
      <div className="flex justify-between items-start lg:items-center min-w-0 flex-1">
        <div className="flex flex-col gap-1 min-w-0 w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm md:text-base text-gray-800 dark:text-text-on-dark break-words">
              {category.name}
            </p>
            <span
              className={`text-[9px] px-2 py-0.5 rounded-md font-bold tracking-widest shrink-0 ${getBadgeStyle()}`}
            >
              L{category.level}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-mono truncate">
            slug: {category.slug}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full lg:w-auto shrink-0">
        <button
          onClick={() => onAddSub(category.id)}
          disabled={!permissions.canAddSub}
          className="btn-add justify-center text-xs py-2 px-3"
        >
          <svg className="size-3.5!" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          افزودن
        </button>

        <button
          onClick={onEdit}
          disabled={!permissions.canEdit}
          className="btn-edit justify-center text-xs py-2 px-3"
        >
          <svg className="size-3.5!" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          ویرایش
        </button>

        <button
          onClick={onDelete}
          disabled={!permissions.canDelete}
          className="btn-delete justify-center text-xs py-2 px-3"
        >
          <svg className="size-3.5!" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          حذف
        </button>
      </div>
    </div>
  );
}