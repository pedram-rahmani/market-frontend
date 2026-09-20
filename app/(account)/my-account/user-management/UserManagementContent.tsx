"use client";

import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import UserRow from "@/components/user/UserAccount/user-management/UserRow";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import { EditUserModal } from "@/components/user/UserModal/EditUserModal";
import { AddUserModal } from "@/components/user/UserModal/addUserModal";
import DeleteConfirmModal from "@components/feedback/MessageModal/DeleteConfirmModal";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import DeletedUsersModal from "@/components/user/UserAccount/user-management/DeletedUsersModal";
import EmptyState from "@/components/ui/emptyState/EmptyState";
import { useAuth } from "@/store/hooks/useAuth";
import { getPersianErrorMessage, SUCCESS_MESSAGES } from "@/lib/errorMapper";

const INITIAL_PERMISSIONS = {
  "users.view": false,
  "users.create": false,
  "users.edit": false,
  "users.delete": false,
  "users.promote": false,
  "users.demote": false,
  "users.restore": false,
};

export default function UserManagementContent() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<Record<string, boolean>>(INITIAL_PERMISSIONS);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Modal States
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deletingUser, setDeletingUser] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);

  // Popup State
  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "success" as "success" | "error",
  });

  const showPopup = useCallback((message: string, type: "success" | "error" = "success") => {
    setPopup({ isOpen: true, message, type });
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsInitialLoading(true);
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data.users || []);
      if (response.data.permissions) {
        setPermissions((prev) => ({ ...prev, ...response.data.permissions }));
      }
    } catch (error: any) {
      console.error("خطا در دریافت اطلاعات:", error);
      showPopup(getPersianErrorMessage(error, "خطا در دریافت اطلاعات کاربران"), "error");
    } finally {
      setIsInitialLoading(false);
    }
  }, [showPopup]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const getPermissionsForUser = (targetUser: any) => ({
    canDelete: !!permissions["users.delete"] && targetUser.role !== "admin",
    canPromote: !!permissions["users.promote"] && targetUser.role === "user",
    canDemote: !!permissions["users.demote"] && targetUser.role === "co-admin",
    canEditUser: !!permissions["users.edit"],
    canViewDeleted: !!permissions["users.restore"],
  });

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      await axiosInstance.delete(`/users/${deletingUser.id}`);
      showPopup(SUCCESS_MESSAGES.userDeleted, "success");
      setDeletingUser(null);
      fetchUsers();
    } catch (error: any) {
      showPopup(getPersianErrorMessage(error, "خطا در حذف کاربر"), "error");
    }
  };

  const handleAdd = async (data: any) => {
    try {
      await axiosInstance.post("/users", data);
      setIsAddModalOpen(false);
      fetchUsers();
      showPopup(SUCCESS_MESSAGES.userCreated, "success");
    } catch (error: any) {
      const errorMsg = getPersianErrorMessage(error, "خطا در ثبت کاربر. لطفاً اطلاعات را بررسی کنید.");
      showPopup(errorMsg, "error");
      throw error;
    }
  };

  const handleUpdate = async (updatedData: any) => {
    try {
      const { permissions: newPerms, ...userData } = updatedData;

      if (userData.phone !== undefined && !userData.phone?.trim()) {
        delete userData.phone;
      }

      await axiosInstance.put(`/users/${editingUser.id}`, userData);

      if (newPerms) {
        let formattedPermissions = newPerms;
        if (!Array.isArray(newPerms) && typeof newPerms === "object") {
          formattedPermissions = Object.keys(newPerms).filter((key) => newPerms[key] === true);
        }
        if (Array.isArray(formattedPermissions)) {
          formattedPermissions = formattedPermissions.filter((p) => typeof p === "string" && p.trim() !== "");
        }

        await axiosInstance.put(`/users/${editingUser.id}/permissions`, {
          permissions: formattedPermissions,
        });
      }

      setEditingUser(null);
      fetchUsers();
      showPopup(SUCCESS_MESSAGES.saved, "success");
    } catch (error: any) {
      showPopup(getPersianErrorMessage(error, "خطا در ذخیره‌سازی اطلاعات"), "error");
    }
  };

  const handlePromote = async (userId: number) => {
    try {
      await axiosInstance.post(`/users/${userId}/promote`);
      showPopup(SUCCESS_MESSAGES.userPromoted, "success");
      fetchUsers();
    } catch (error: any) {
      showPopup(getPersianErrorMessage(error, "خطا در ارتقای کاربر."), "error");
    }
  };

  const handleDemote = async (userId: number) => {
    try {
      await axiosInstance.post(`/users/${userId}/demote`);
      showPopup(SUCCESS_MESSAGES.userDemoted, "success");
      fetchUsers();
    } catch (error: any) {
      showPopup(getPersianErrorMessage(error, "خطا در تنزل درجه."), "error");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="مدیریت کاربران"
        buttonText={permissions["users.create"] ? "+ افزودن کاربر" : undefined}
        onButtonClick={() => setIsAddModalOpen(true)}
      >
        {permissions["users.restore"] && (
          <button
            onClick={() => setIsDeletedModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-custom-gray-400/20 dark:bg-dark-700/50 hover:bg-ui-red-400/10 dark:hover:bg-ui-red-900/20 dark:text-text-on-dark/70 hover:text-ui-red-600 shadow border border-gray-200 dark:border-white/10 rounded-lg transition-all duration-200 group"
          >
            <svg className="size-4! opacity-70 group-hover:opacity-100" viewBox="0 0 24 24">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span>کاربران آرشیو شده</span>
          </button>
        )}
      </PageHeader>

      {/* Skeletons / Loading */}
      {isInitialLoading ? (
        <div className="space-y-4">
          <div className="hidden md:block space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 w-full bg-gray-200 dark:bg-dark-700 animate-pulse rounded-2xl" />
            ))}
          </div>
          <div className="md:hidden space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 w-full bg-gray-200 dark:bg-dark-700 animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          tone="violet"
          eyebrow="کاربران"
          title="کاربری یافت نشد"
          description="کاربران ثبت‌نام‌شده‌ی فروشگاه در این بخش نمایش داده می‌شوند."
          icon={
            <svg viewBox="0 0 24 24" className="size-12">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 8 0Zm6 3v-2a4 4 0 0 0-3-3.87m-1-4a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
            <table className="w-full min-w-200 text-sm text-right border-collapse">
              <thead className="bg-gray-50 dark:bg-dark-700 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-6 py-4">نام کاربر</th>
                  <th className="px-6 py-4">ایمیل</th>
                  <th className="px-6 py-4">تلفن</th>
                  <th className="px-6 py-4">آخرین فعالیت</th>
                  <th className="px-6 py-4">نقش</th>
                  <th className="px-6 py-4">وضعیت</th>
                  <th className="px-6 py-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {users.map((user: any) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    permissions={getPermissionsForUser(user)}
                    type="desktop"
                    onEdit={() => setEditingUser(user)}
                    onDelete={() => setDeletingUser(user)}
                    onPromote={() => handlePromote(user.id)}
                    onDemote={() => handleDemote(user.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List */}
          <div className="md:hidden space-y-4">
            {users.map((user: any) => (
              <UserRow
                key={user.id}
                user={user}
                permissions={getPermissionsForUser(user)}
                type="mobile"
                onEdit={() => setEditingUser(user)}
                onDelete={() => setDeletingUser(user)}
                onPromote={() => handlePromote(user.id)}
                onDemote={() => handleDemote(user.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
        canAssignStaff={currentUser?.role === "admin"}
      />

      {editingUser && (
        <EditUserModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onSave={handleUpdate}
        />
      )}

      <DeleteConfirmModal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleConfirmDelete}
        title={deletingUser?.name || "این کاربر"}
      />

      <SimplePopup
        isOpen={popup.isOpen}
        onClose={() => setPopup((prev) => ({ ...prev, isOpen: false }))}
        message={popup.message}
        type={popup.type}
      />

      <DeletedUsersModal
        isOpen={isDeletedModalOpen}
        onClose={() => setIsDeletedModalOpen(false)}
        onRestoreSuccess={fetchUsers}
      />
    </div>
  );
}