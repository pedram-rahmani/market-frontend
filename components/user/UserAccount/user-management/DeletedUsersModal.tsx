"use client";

import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import SpinnerLoader from "@/components/ui/SpinnerLoader/SpinnerLoader";
import DeleteConfirmModal from "@/components/feedback/MessageModal/DeleteConfirmModal";
import useClickOutside from "@/store/hooks/useClickOutside";

interface DeletedUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreSuccess: () => void;
}

export default function DeletedUsersModal({
  isOpen,
  onClose,
  onRestoreSuccess,
}: DeletedUsersModalProps) {
  const [deletedUsers, setDeletedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userToForceDelete, setUserToForceDelete] = useState<any>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const confirmModalRef = useRef<HTMLDivElement>(null);
  useClickOutside(onClose, [modalRef, confirmModalRef]);

  const fetchDeletedUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/users/deleted");
      setDeletedUsers(response.data.users || []);
    } catch (error) {
      console.error("خطا در دریافت لیست حذف شده‌ها:", error);
      setDeletedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchDeletedUsers();
  }, [isOpen]);

  const handleRestore = async (userId: number) => {
    try {
      await axiosInstance.post(`/users/${userId}/restore`);
      setDeletedUsers(deletedUsers.filter((u) => u.id !== userId));
      onRestoreSuccess();
    } catch (error) {
      console.error("خطا در بازیابی کاربر:", error);
    }
  };

  const handleForceDelete = async () => {
    if (!userToForceDelete) return;
    try {
      await axiosInstance.delete(`/users/${userToForceDelete.id}/force-delete`);
      setDeletedUsers(deletedUsers.filter((u) => u.id !== userToForceDelete.id));
      setUserToForceDelete(null);
    } catch (error) {
      console.error("خطا در حذف دائمی:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-dark-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl"
      >
        <h3 className="text-lg font-bold mb-4">کاربران حذف شده</h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <SpinnerLoader className="w-8 h-8" variant="simple" />
          </div>
        ) : deletedUsers.length === 0 ? (
          <p className="text-center py-4 text-gray-500">کاربر حذف‌شده‌ای یافت نشد.</p>
        ) : (
          <div className="max-h-60 overflow-y-auto space-y-1">
            {deletedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-white/5">
                <div>
                  <p className="font-bold text-sm">{user.name}</p>
                  <p className="text-[10px] text-gray-400">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleRestore(user.id)} className="text-xs bg-violet-600 shadow-sm text-white px-3 py-1.5 rounded-lg hover:bg-violet-700">بازیابی</button>
                  <button onClick={() => setUserToForceDelete(user)} className="text-xs bg-red-50 dark:bg-ui-red-900/10 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 border hover:border-ui-red-200/80">حذف دائم</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={onClose} className="w-full mt-6 py-2.5 rounded-xl bg-gray-100 dark:bg-neutral-700 text-sm font-bold">بستن</button>
      </div>

      <div ref={confirmModalRef} onClick={(e) => e.stopPropagation()}>
        <DeleteConfirmModal
          isOpen={!!userToForceDelete}
          onClose={() => setUserToForceDelete(null)}
          onConfirm={handleForceDelete}
          title={userToForceDelete?.name || "این کاربر"}
        />
      </div>
    </div>
  );
}