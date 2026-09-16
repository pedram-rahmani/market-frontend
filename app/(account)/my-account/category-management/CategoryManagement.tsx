"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/store/hooks/useAuth";
import { Category } from "@/types/category";
import PageHeader from "@/components/user/UserAccount/PageHeader";
import CategoryRow from "@/components/user/UserAccount/category-management/CategoryRow";
import CategoryModal from "@/components/user/UserModal/CategoryModal";
import CategoryForm from "@/components/user/UserAccount/category-management/CategoryForm";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import DeleteConfirmModal from "@/components/feedback/MessageModal/DeleteConfirmModal";
import { usePermissions } from "@/store/hooks/usePermissions";

export default function CategoryManagement() {
  const { token } = useAuth();
  const { can } = usePermissions();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [defaultParentId, setDefaultParentId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteCategoryName, setDeleteCategoryName] = useState<string>("");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [popup, setPopup] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({ isOpen: false, message: "", type: "success" });

  const categoryPermissions = {
    canAddSub: can("categories.create"),
    canEdit: can("categories.edit"),
    canDelete: can("categories.delete"),
  };

  const sortCategories = (
    list: Category[],
    parentId: number | null = null,
    level: number = 1,
  ): Category[] => {
    let result: Category[] = [];
    const children = list.filter((c) => c.parent_id === parentId);
    children.forEach((child) => {
      result.push({ ...child, level });
      result = [...result, ...sortCategories(list, child.id, level + 1)];
    });
    return result;
  };

  const fetchData = async () => {
    setIsInitialLoading(true);
    try {
      const { data } = await axiosInstance.get("/categories");
      const list = Array.isArray(data) ? data : data.data || [];
      setCategories(sortCategories(list));
    } catch (error) {
      console.error("خطا در بارگذاری:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleOpenAddSubModal = (parentId: number) => {
    setEditingCategory(null);
    setDefaultParentId(parentId);
    setIsModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      await axiosInstance.delete(`/categories/${deleteId}`);
      setPopup({ isOpen: true, message: "حذف شد", type: "success" });
      fetchData();
    } catch {
      setPopup({ isOpen: true, message: "خطا در حذف", type: "error" });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="مدیریت دسته‌بندی‌ها"
        buttonText={"+ افزودن دسته"}
        canClick={categoryPermissions.canAddSub}
        isLoading={isInitialLoading}
        onButtonClick={() => {
          setEditingCategory(null);
          setDefaultParentId(null);
          setIsModalOpen(true);
        }}
      />

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "ویرایش" : "افزودن"}
      >
        <CategoryForm
          allCategories={categories}
          category={editingCategory}
          defaultParentId={defaultParentId}
          onSave={() => {
            setIsModalOpen(false);
            fetchData();
          }}
        />
      </CategoryModal>

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title={deleteCategoryName}
      />

      <SimplePopup
        isOpen={popup.isOpen}
        onClose={() => setPopup({ ...popup, isOpen: false })}
        message={popup.message}
        type={popup.type}
      />

      <div className="p-4">
        {isInitialLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-12 w-full bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : (
          categories.map((c) => (
            <CategoryRow
              key={c.id}
              category={c}
              permissions={categoryPermissions}
              onAddSub={() => handleOpenAddSubModal(c.id)}
              onEdit={() => {
                setEditingCategory(c);
                setDefaultParentId(c.parent_id ?? null);
                setIsModalOpen(true);
              }}
              onDelete={() => {
                setDeleteId(c.id);
                setDeleteCategoryName(c.name);
                setIsDeleteModalOpen(true);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}