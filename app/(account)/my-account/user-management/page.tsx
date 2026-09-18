import AuthGuard from "@/components/guards/AuthGuard";
import UserManagementContent from "./UserManagementContent";
import { PERMISSIONS } from "@/types/permissions";

export const metadata = {
  title: "مدیریت کاربران | پنل کاربری",
};

export default function Page() {
  return (
    <AuthGuard requiredPermission={PERMISSIONS.USERS_VIEW}>
      <UserManagementContent />
    </AuthGuard>
  );
}
