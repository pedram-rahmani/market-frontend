"use client";

import { useState, useRef } from "react";
import Select from "@/components/ui/Form/Select";
import useClickOutside from "@/store/hooks/useClickOutside";
import { PERMISSION_GROUPS, PERMISSION_LABELS } from "@/types/permissions";
import { usePermissions } from "@/store/hooks/usePermissions";
import { User } from "@/types/user";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updatedData: Record<string, any>) => Promise<void>;
}

export function EditUserModal({
  isOpen,
  onClose,
  user,
  onSave,
}: EditUserModalProps) {
  const { canManagePermissions } = usePermissions();
  const [activeTab, setActiveTab] = useState<"info" | "permissions">("info");
  
  // استخراج آدرس فعلی کاربر (اگر رابطه آدرس‌ها آرایه باشد، اولین مورد یا آدرس پیش‌فرض را می‌گیرد)
  const existingAddress = user?.postal_address || (user as any)?.addresses?.[0]?.postal_address || "";

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    phone: user?.phone || "",
    postal_address: existingAddress,
    status: user?.status || "active",
    admin_notes: user?.admin_notes || "",
    permissions: user?.permissions || [],
  });

  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null!);
  useClickOutside(() => onClose(), [modalRef]);

  const togglePermission = (perm: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const isPermissionsTab = activeTab === "permissions";
      const dataToSend = isPermissionsTab
        ? { permissions: formData.permissions }
        : {
            name: formData.name,
            username: formData.username,
            phone: formData.phone?.trim() ? formData.phone : user?.phone || "00000000000",
            postal_address: formData.postal_address,
            status: formData.status,
            admin_notes: formData.admin_notes,
          };

      await onSave(dataToSend);
      onClose();
    } catch (error: any) {
      console.error("Server Validation Errors:", error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white dark:bg-dark-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl"
      >
        <h3 className="text-lg font-bold mb-4">ویرایش: {user?.name}</h3>

        <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-white/10">
          <button
            onClick={() => setActiveTab("info")}
            className={`pb-2 text-xs font-bold ${activeTab === "info" ? "text-violet-600 border-b-2 border-violet-600" : "text-gray-400"}`}
          >
            اطلاعات
          </button>

          {canManagePermissions && user?.role !== "user" && (
            <button
              onClick={() => setActiveTab("permissions")}
              className={`pb-2 text-xs font-bold ${activeTab === "permissions" ? "text-violet-600 border-b-2 border-violet-600" : "text-gray-400"}`}
            >
              دسترسی‌ها
            </button>
          )}
        </div>

        {activeTab === "info" ? (
          <div className="flex flex-col gap-4 mb-6">
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input-info w-full"
              placeholder="نام کاربر"
            />
            <input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="input-info w-full"
              placeholder="نام کاربری"
            />
            <input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="input-info w-full"
              placeholder="شماره تماس"
            />
            
            {/* نمایش و ویرایش آدرس پستی در Textarea */}
            <textarea
              value={formData.postal_address}
              onChange={(e) =>
                setFormData({ ...formData, postal_address: e.target.value })
              }
              className="input-info w-full resize-none h-20 text-xs p-2"
              placeholder="آدرس پستی"
            />

            <Select
              variant="simple"
              value={formData.status}
              onChange={(val) => setFormData({ ...formData, status: val })}
              options={[
                { value: "active", label: "فعال" },
                { value: "banned", label: "مسدود" },
              ]}
            />
          </div>
        ) : (
          <div className="h-60 overflow-y-auto scrollbar mb-6 px-1">
            {Object.entries(PERMISSION_GROUPS).map(([key, group]) => (
              <div key={key} className="mb-4">
                <h4 className="text-xs font-bold text-violet-600 mb-2 border-b border-violet-100 dark:border-violet-900 pb-1">
                  {group.label}
                </h4>

                <div className="grid grid-cols-1 gap-1">
                  {group.permissions.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-2 text-[11px] cursor-pointer p-1.5 rounded hover:bg-gray-50 dark:hover:bg-dark-900/50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                        className="w-3.5 h-3.5 accent-violet-600 rounded"
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {PERMISSION_LABELS[perm]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-neutral-700 text-xs"
          >
            انصراف
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-xs disabled:opacity-50"
          >
            {loading ? "ذخیره..." : "ذخیره"}
          </button>
        </div>
      </div>
    </div>
  );
}