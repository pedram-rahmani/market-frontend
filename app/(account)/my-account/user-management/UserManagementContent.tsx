"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import UserRow from "@/components/user/UserAccount/user-management/UserRow";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import { EditUserModal } from "@/components/user/UserModal/EditUserModal";
import { AddUserModal } from "@/components/user/UserModal/addUserModal";
import DeleteConfirmModal from "@components/feedback/MessageModal/DeleteConfirmModal";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import DeletedUsersModal from "@/components/user/UserAccount/user-management/DeletedUsersModal";

export default function UserManagementContent() {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    "users.view": false,
    "users.create": false,
    "users.edit": false,
    "users.delete": false,
    "users.promote": false,
    "users.demote": false,
  });
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<any>(null);
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });
  const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false);

  const fetchUsers = async () => {
    setIsInitialLoading(true);
    try {
      const response = await axiosInstance.get("/users");

      setUsers(response.data.users);

      if (response.data.permissions) {
        setPermissions(response.data.permissions);
      }
    } catch (error) {
      console.error("خطا در دریافت اطلاعات:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getPermissionsForUser = (targetUser: any) => {
    return {
      canDelete: !!permissions["users.delete"] && targetUser.role !== "admin",
      canPromote: !!permissions["users.promote"] && targetUser.role === "user",
      canDemote:
        !!permissions["users.demote"] && targetUser.role === "co-admin",
      canEditUser: !!permissions["users.edit"],
      canViewDeleted: !!permissions["users.restore"],
    };
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    try {
      await axiosInstance.delete(`/users/${deletingUser.id}`);
      setDeletingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("خطا در حذف کاربر:", error);
    }
  };

  const handleAdd = async (data: any) => {
    try {
      await axiosInstance.post("/users", data);
      setIsAddModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("خطا در افزودن کاربر:", error);
    }
  };

  const handleUpdate = async (updatedData: any) => {
    try {
      const { permissions, ...userData } = updatedData;

      if (userData.phone !== undefined) {
        userData.phone = userData.phone?.trim() ? userData.phone : editingUser?.phone || "00000000000";
      }

      await axiosInstance.put(`/users/${editingUser.id}`, userData);

      if (permissions) {
        await axiosInstance.put(`/users/${editingUser.id}/permissions`, {
          permissions,
        });
      }

      setEditingUser(null);
      fetchUsers();
      showPopup("تغییرات با موفقیت ذخیره شد", "success");
    } catch (error: any) {
      // این بخش را تغییر دهید تا خطای دقیق سرور را چاپ کند
      console.error("Server Error Details:", error?.response?.data);
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error || "خطا در ذخیره‌سازی اطلاعات";
      showPopup(serverMessage, "error");
    }
  };

  const showPopup = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setPopup({ isOpen: true, message, type });
  };

  // user promotion
  const handlePromote = async (userId: number) => {
    try {
      await axiosInstance.post(`/users/${userId}/promote`);
      showPopup("کاربر با موفقیت به ادمین ارشد ارتقا یافت.", "success");
      fetchUsers();
    } catch (error) {
      showPopup("خطا در ارتقای کاربر.", "error");
      console.error(error);
    }
  };
  // user demotion
  const handleDemote = async (userId: number) => {
    try {
      await axiosInstance.post(`/users/${userId}/demote`);
      showPopup("کاربر تنزل درجه یافت.", "success");
      fetchUsers();
    } catch (error) {
      showPopup("خطا در تنزل درجه.", "error");
      console.error(error);
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
            <svg
              className="size-4! opacity-70 group-hover:opacity-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span>کاربران آرشیو شده</span>
          </button>
        )}
      </PageHeader>

      {/* desktop */}
      {isInitialLoading ? (
        <div className="space-y-4">
          {/* Skeleton (desktop) */}
          <div className="hidden md:block space-y-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 w-full bg-gray-200 dark:bg-dark-700 animate-pulse rounded-2xl"
              />
            ))}
          </div>
          {/* Skeleton (moblie)  */}
          <div className="md:hidden space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 w-full bg-gray-200 dark:bg-dark-700 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* desktop */}
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
                {users.length > 0 ? (
                  users.map((user: any) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-500">
                      کاربری یافت نشد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* mobile */}
          <div className="md:hidden space-y-4">
            {users.length > 0 ? (
              users.map((user: any) => (
                <UserRow
                  key={user.id}
                  user={user}
                  permissions={getPermissionsForUser(user)}
                  type="mobile"
                  onDelete={() => setDeletingUser(user)}
                  onEdit={() => setEditingUser(user)}
                  onPromote={() => handlePromote(user.id)}
                  onDemote={() => handleDemote(user.id)}
                />
              ))
            ) : (
              <p className="text-center py-6 text-gray-500">کاربری یافت نشد.</p>
            )}
          </div>
        </>
      )}

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
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
        onClose={() => setPopup({ ...popup, isOpen: false })}
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
