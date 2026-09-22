interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: "info" | "success" | "warning";
}

interface NotificationRowProps {
  notification: Notification;
  onDelete: (id: number) => void;
  onRead: (id: number) => void;
}

export default function NotificationRow({ notification, onDelete, onRead }: NotificationRowProps) {
  const tone = {
    success: {
      accent: "border-emerald-500/40",
      rail: "bg-emerald-500",
      icon: "bg-emerald-500/10 text-emerald-500",
    },
    warning: {
      accent: "border-amber-500/40",
      rail: "bg-amber-500",
      icon: "bg-amber-500/10 text-amber-500",
    },
    info: {
      accent: "border-ui-purple/40",
      rail: "bg-ui-purple",
      icon: "bg-ui-purple/10 text-ui-purple",
    },
  }[notification.type];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 transition sm:p-5 ${
        notification.isRead
          ? `bg-light dark:bg-dark-800/30 border-custom-gray-200 dark:border-custom-gray-400/10 text-text-on-light dark:text-custom-gray-400`
          : `cursor-pointer bg-white dark:bg-dark-700/60 ${tone.accent} text-gray-800 dark:text-text-on-dark shadow-sm`
      }`}
      onClick={() => {
        if (!notification.isRead) onRead(notification.id);
      }}
    >
      {!notification.isRead && (
        <span className={`absolute inset-y-0 right-0 w-1.5 ${tone.rail}`} />
      )}

      <div className="flex items-start gap-3.5">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
          notification.isRead
            ? "bg-custom-gray-200/50 text-custom-gray-400 dark:bg-dark-700"
            : tone.icon
        }`}>
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7">
            {notification.type === "success" ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 6" />
            ) : notification.type === "warning" ? (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3h.008v.008H12v-.008Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 3.94 2.93 17.06A1.5 1.5 0 0 0 4.23 19.3h15.54a1.5 1.5 0 0 0 1.3-2.24L13.66 3.94a1.9 1.9 0 0 0-3.32 0Z" />
              </>
            ) : (
              <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 18.75a2.25 2.25 0 0 1-4.5 0m8.25-4.5V9a6 6 0 1 0-12 0v5.25l-1.5 2.25h15.5l-1.5-2.25Z" />
              </>
            )}
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-text-on-dark">
              {notification.title}
            </h3>
            {!notification.isRead && (
              <span className="rounded-full border border-ui-purple/20 bg-ui-purple/10 px-2 py-0.5 text-[10px] font-medium text-ui-purple">
                جدید
              </span>
            )}
          </div>
          <p className="mt-1.5 text-xs leading-6 text-text-on-light dark:text-custom-gray-200">
            {notification.message}
          </p>
          <span className="mt-2 block text-[10px] text-custom-gray-400">
            {notification.date}
          </span>
        </div>
      </div>

      <button
        onClick={(event) => {
          event.stopPropagation();
          onDelete(notification.id);
        }}
        aria-label="حذف پیام"
        className="absolute left-4 top-4 rounded-lg px-2 py-1 text-[11px] text-custom-gray-400 transition hover:bg-danger/10 hover:text-danger cursor-pointer"
      >
        حذف
      </button>
    </div>
  );
}