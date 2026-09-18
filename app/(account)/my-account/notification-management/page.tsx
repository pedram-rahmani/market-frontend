import AuthGuard from "@/components/guards/AuthGuard";
import NotificationManagementContent from "./NotificationManagementContent";
import { PERMISSIONS } from "@/types/permissions";

export const metadata = {
  title: "مدیریت پیام‌ها | پنل کاربری",
};

export default function Page() {
  return (
    <AuthGuard requiredPermission={PERMISSIONS.NOTIFICATIONS_MANAGE}>
      <NotificationManagementContent />
    </AuthGuard>
  );
}
