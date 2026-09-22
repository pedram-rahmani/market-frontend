import AuthGuard from "@/components/guards/AuthGuard";
import { PERMISSIONS } from "@/types/permissions";
import ChatManagementContent from "./ChatManagementContent";

export default function Page() {
  return (
    <AuthGuard requiredPermission={PERMISSIONS.CHATS_VIEW}>
      <ChatManagementContent />
    </AuthGuard>
  );
}
