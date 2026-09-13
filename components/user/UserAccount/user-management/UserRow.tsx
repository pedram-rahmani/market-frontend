"use client";

import { useEffect, useState } from "react";
import { usePermissions } from "@/store/hooks/usePermissions";

interface UserRowProps {
  user: any;
  permissions: {
    canDelete: boolean;
    canPromote: boolean;
    canDemote: boolean;
    canEditUser: boolean;
  };
  onDelete: (id: number) => void;
  onEdit: (user: any) => void;
  onPromote: (id: number) => void;
  onDemote: (id: number) => void;
  type: "desktop" | "mobile";
  className?: string;
}

export default function UserRow({
  user,
  permissions,
  onDelete,
  onEdit,
  onPromote,
  onDemote,
  type,
  className = "",
}: UserRowProps) {
  const { canEditUser, canDeleteUser, isAuthorized } = usePermissions();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const canEdit = isAuthorized && permissions.canEditUser && canEditUser(user);
  const canDelete = isAuthorized && permissions.canDelete && canDeleteUser(user);

  const getStatusClass = (status: string) =>
    status === "active"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

  const getRoleClass = (role: string) => {
    if (role === "admin") return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
    if (role === "co-admin") return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400";
  };

  const renderActions = () => (
    <div className="flex gap-2.5 items-center flex-wrap">
      {permissions.canPromote && user.role === "user" && (
        <button onClick={() => onPromote(user.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          ارتقا
        </button>
      )}
      {permissions.canDemote && user.role === "co-admin" && (
        <button onClick={() => onDemote(user.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
          تنزل
        </button>
      )}
      {canEdit && (
        <button onClick={() => onEdit(user)} className="btn-edit text-xs">ویرایش</button>
      )}
      {canDelete && (
        <button onClick={() => onDelete(user.id)} className="btn-delete text-xs">حذف</button>
      )}
    </div>
  );

  const formatDate = (date: string, options?: Intl.DateTimeFormatOptions) =>
    date ? new Date(date).toLocaleDateString("fa-IR", options) : "-";

  // حالت دسکتاپ (حتماً باید تگ tr برگرداند)
  if (type === "desktop") {
    return (
      <tr className={`border-b border-gray-100 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-dark-700/30 transition-all ${className}`}>
        <td className="px-6 py-4">
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">عضویت: {formatDate(user.created_at)}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-gray-500">{user.email}</td>
        <td className="px-6 py-4 text-gray-500">{user.phone || "-"}</td>
        <td className="px-6 py-4 text-[10px] text-gray-400">
          {formatDate(user.updated_at, { hour: "2-digit", minute: "2-digit" })}
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRoleClass(user.role)}`}>
            {user.role.toUpperCase()}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(user.status)}`}>
            {user.status === "active" ? "فعال" : "مسدود"}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">{renderActions()}</td>
      </tr>
    );
  }

  // حالت موبایل (تگ div)
  return (
    <div className={`p-4 bg-white dark:bg-dark-800 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm space-y-4 mb-4 ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">عضویت: {formatDate(user.created_at)}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${getRoleClass(user.role)}`}>
          {user.role.toUpperCase()}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-500">
        <p>ایمیل: {user.email}</p>
        <p>تلفن: {user.phone || "-"}</p>
        <p className="text-[10px] text-gray-400 pt-1">
          آخرین فعالیت: {formatDate(user.updated_at, { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-white/5">
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${getStatusClass(user.status)}`}>
          {user.status === "active" ? "فعال" : "مسدود"}
        </span>
        {renderActions()}
      </div>
    </div>
  );
}