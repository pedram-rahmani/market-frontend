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
import EmptyState from "@/components/ui/emptyState/EmptyState";
import { getPersianErrorMessage, SUCCESS_MESSAGES } from "@/lib/errorMapper";

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
  
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setPopup({ isOpen: true, message: SUCCESS_MESSAGES.categoryDeleted, type: "success" });
      await fetchData();
    } catch (error) {
      setPopup({ isOpen: true, message: getPersianErrorMessage(error, "خطا در حذف دسته‌بندی"), type: "error" });
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveWrapper = async () => {
    setIsSubmitting(true);
    try {
      setIsModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="مدیریت دسته‌بندی‌ها"
        buttonText={"+ افزودن دسته"}
        canClick={categoryPermissions.canAddSub}
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
        isLoading={isSubmitting} 
      >
        <CategoryForm
          allCategories={categories}
          category={editingCategory}
          defaultParentId={defaultParentId}
          onSave={handleSaveWrapper}
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
        ) : categories.length === 0 ? (
          <EmptyState
            tone="blue"
            eyebrow="دسته‌بندی‌ها"
            title="هنوز دسته‌بندی‌ای ثبت نشده است"
            description="برای مرتب‌سازی محصولات، اولین دسته‌بندی فروشگاه را ایجاد کنید."
            icon={
              <svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m3 12 9 4.5 9-4.5M3 16.5l9 4.5 9-4.5" />
              </svg>
            }
          />
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