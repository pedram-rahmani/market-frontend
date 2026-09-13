import AuthGuard from "@/components/guards/AuthGuard";
import UserManagementContent from "./UserManagementContent";

export const metadata = {
  title: "مدیریت کاربران | پنل کاربری",
};

export default function Page() {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <UserManagementContent />
    </AuthGuard>
  );
}
