import { useSelector } from "react-redux";

export const usePermissions = () => {
  const authUser = useSelector((state: any) => state.auth.user);
  const reduxUser = authUser?.user || authUser;
  const lsRole = typeof window !== 'undefined' ? localStorage.getItem("user_role") : null;
  const lsId = typeof window !== 'undefined' ? localStorage.getItem("user_id") : null;

  const role = reduxUser?.role || lsRole;
  const id = reduxUser?.id?.toString() || lsId;

  let rawPermissions = reduxUser?.permissions;
  if (!rawPermissions && typeof window !== "undefined") {
    try {
      rawPermissions = JSON.parse(localStorage.getItem("user") || "null")?.permissions;
    } catch {
      rawPermissions = [];
    }
  }
  
  const permissions = Array.isArray(rawPermissions)
    ? rawPermissions
    : typeof rawPermissions === "string"
      ? (() => {
          try {
            return JSON.parse(rawPermissions);
          } catch {
            return [];
          }
        })()
      : rawPermissions && typeof rawPermissions === "object"
        ? Object.entries(rawPermissions)
            .filter(([, enabled]) => Boolean(enabled))
            .map(([permission]) => permission)
        : [];

  const isAuthorized = !!role;
  const can = (permission: string) => {
    if (!isAuthorized) return false;
    
    if (role?.toLowerCase() === 'admin') return true;
    
    return permissions.includes(permission);
  };

  const canManagePermissions = role?.toLowerCase() === 'admin';

  const canEditUser = (targetUser: any) => {
    if (!isAuthorized || !targetUser) return false;
    if (role.toLowerCase() === 'admin') return true;
    if (role.toLowerCase() === 'co-admin' && targetUser.role?.toLowerCase() === 'user') return true;
    return false;
  };

  const canDeleteUser = (targetUser: any) => {
    if (!isAuthorized || !targetUser) return false;
    if (role.toLowerCase() === 'admin' && String(id) !== String(targetUser.id)) return true;
    if (role.toLowerCase() === 'co-admin' && targetUser.role?.toLowerCase() === 'user') return true;
    return false;
  };

  return { canEditUser, canDeleteUser, canManagePermissions, isAuthorized, can };
};