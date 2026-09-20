import type { HTMLAttributes } from "react";

interface RequiredFieldMarkerProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "title"> {
  title?: string;
}

export default function RequiredFieldMarker({
  title = "فیلد الزامی",
  className = "",
  ...props
}: RequiredFieldMarkerProps) {
  return (
    <span
      aria-hidden="true"
      title={title}
      className={`absolute -top-2 left-3 z-10 h-5! w-4.5! drop-shadow-sm text-ui-red-600 ${className}`}
      {...props}
    >
      <svg viewBox="0 0 24 26" className="h-5! w-4.5! fill-current!">
        <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
      </svg>
      <span className="absolute right-0 -top-0.5 text-[10px] font-black leading-none text-amber-300! drop-shadow-[0_0_1px_rgba(0,0,0,0.35)]">
        <svg viewBox="0 0 24 24" className="size-2.5! fill-current!">
          <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442L11.48 3.5Z" />
        </svg>
      </span>
    </span>
  );
}
