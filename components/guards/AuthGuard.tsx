"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import SpinnerLoader from "@/components/ui/SpinnerLoader/SpinnerLoader";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermission?: string;
}

export default function AuthGuard({
  children,
  allowedRoles,
  requiredPermission,
}: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const userData = useSelector((state: any) => state.auth.user);
  const userObj = useMemo(() => userData?.user || userData, [userData]);

  useEffect(() => {
    if (!userData) {
      return;
    }

    const role = userObj?.role;
    const permissions = userObj?.permissions || [];

    if (userObj?.status !== "active") {
      router.push("/login");
      return;
    }

    if (role === "admin") {
      setIsChecking(false);
      return;
    }

    // بررسی نقش‌های مجاز (اگر allowedRoles پاس داده شده باشد)
    if (allowedRoles && allowedRoles.length > 0) {
      if (!role || !allowedRoles.includes(role)) {
        router.push("/my-account");
        return;
      }
    }

    if (requiredPermission) {
      if (!permissions.includes(requiredPermission)) {
        router.push("/my-account");
        return;
      }
    }
    setIsChecking(false);
  }, [userData, router, requiredPermission, allowedRoles, userObj]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        <SpinnerLoader variant="multi-color" className="w-12 h-12" />
      </div>
    );
  }

  return <>{children}</>;
}