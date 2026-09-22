"use client";

interface ContentAuthorBadgeProps {
  name?: string;
  role?: string;
  size?: "sm" | "md";
  publicFacing?: boolean;
}

export default function ContentAuthorBadge({
  name,
  role,
  size = "sm",
  publicFacing = false,
}: ContentAuthorBadgeProps) {
  const normalizedRole = role?.toLowerCase();
  const isAdmin = normalizedRole === "admin";
  const isCoAdmin = normalizedRole === "co-admin";
  const isStaff = isAdmin || isCoAdmin;
  const useAdminLabel = publicFacing && isStaff;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`rounded-full border flex items-center justify-center font-bold ${
          size === "md" ? "size-9 text-xs" : "size-7 text-[10px]"
        } ${
          useAdminLabel || isAdmin
            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
            : isCoAdmin
              ? "bg-violet-500/15 text-violet-400 border-violet-500/30"
              : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
        }`}
      >
        {name?.charAt(0) || "ک"}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-text-on-light/80 dark:text-text-on-dark/90">
          {name || "کاربر مهمان"}
        </span>
        {isStaff && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
              useAdminLabel || isAdmin
                ? "bg-amber-500/10 text-amber-400"
                : "bg-violet-500/10 text-violet-400"
            }`}
            title={useAdminLabel || isAdmin ? "ادمین فروشگاه" : "همکار فروشگاه"}
          >
            <svg viewBox="0 0 24 24" className="size-3!" fill="currentColor">
              <path d="M12 2 4 5v5c0 5.25 3.4 9.95 8 12 4.6-2.05 8-6.75 8-12V5l-8-3Zm3.5 7.5-4.2 4.2-2.3-2.3-1.1 1.1 3.4 3.4 5.3-5.3-1.1-1.1Z" />
            </svg>
            {useAdminLabel || isAdmin ? "ادمین" : "پشتیبانی"}
          </span>
        )}
      </div>
    </div>
  );
}
