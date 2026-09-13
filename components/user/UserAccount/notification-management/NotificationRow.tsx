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
}

export default function NotificationRow({ notification, onDelete }: NotificationRowProps) {
  return (
    <div
      className={`p-4 rounded-xl border transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
        notification.isRead
          ? "bg-light dark:bg-dark-800/30 border-custom-gray-200 dark:border-custom-gray-400/10 text-text-on-light dark:text-custom-gray-400"
          : "bg-white dark:bg-dark-700/60 border-ui-purple/40 dark:border-ui-purple/30 text-gray-800 dark:text-text-on-dark shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`size-2.5 mt-2 rounded-full shrink-0 ${
            notification.isRead ? "bg-custom-gray-300 dark:bg-custom-gray-400/50" : "bg-ui-purple"
          }`}
        />
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm text-gray-900 dark:text-text-on-dark">{notification.title}</h3>
            {!notification.isRead && (
              <span className="bg-ui-purple/10 text-ui-purple text-[10px] px-2 py-0.5 rounded-full border border-ui-purple/20">
                جدید
              </span>
            )}
          </div>
          <p className="text-sm mt-1 text-text-on-light dark:text-custom-gray-200">{notification.message}</p>
          <span className="text-[11px] text-custom-gray-400 mt-2 block">{notification.date}</span>
        </div>
      </div>

      <button
        onClick={() => onDelete(notification.id)}
        className="text-custom-gray-400 hover:text-danger transition text-sm self-end sm:self-center cursor-pointer"
      >
        حذف
      </button>
    </div>
  );
}