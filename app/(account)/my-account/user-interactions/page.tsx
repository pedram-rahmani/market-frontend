
import AuthGuard from "@/components/guards/AuthGuard";
import { PERMISSIONS } from "@/types/permissions";
import UserInteractions from "./UserInteractionContent";

export const metadata = {
  title: "تعاملات کاربران | پنل کاربری",
};
export default function Page() {
  return (
    <AuthGuard requiredPermission={PERMISSIONS.INTERACTIONS_VIEW}>
      <UserInteractions />
    </AuthGuard>
  );
}
