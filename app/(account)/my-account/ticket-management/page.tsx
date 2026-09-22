import AuthGuard from "@/components/guards/AuthGuard";
import { PERMISSIONS } from "@/types/permissions";
import TicketManagementContent from "./TicketManagementContent";

export const metadata = {
  title: "مدیریت تیکت‌ها | پنل کاربری",
};

export default function Page() {
  return (
    <AuthGuard requiredPermission={PERMISSIONS.TICKETS_VIEW}>
      <TicketManagementContent />
    </AuthGuard>
  );
}
