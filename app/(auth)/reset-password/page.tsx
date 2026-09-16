import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}