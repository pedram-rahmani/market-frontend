"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useAuth } from "@/store/hooks/useAuth";

import PageHeader from "@/components/user/UserAccount/PageHeader";
import ProductRow from "@/components/user/UserAccount/product-management/ProductRow";
import ProductModal from "@/components/user/UserModal/ProductModal";
import ProductForm from "@/components/user/UserAccount/product-management/ProductForm";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import DeleteConfirmModal from "@/components/feedback/MessageModal/DeleteConfirmModal";
import { usePermissions } from "@/store/hooks/usePermissions";
import { PERMISSIONS } from "@/types/permissions";
import EmptyState from "@/components/ui/emptyState/EmptyState";
import { getPersianErrorMessage, SUCCESS_MESSAGES } from "@/lib/errorMapper";

type ProductItem = {
  id: number;
  name: string;
  price: string;
  discount: string | null;
  img: string | null;
  [key: string]: any;
};

export default function ProductManagement() {
  const { token } = useAuth();
  const { can } = usePermissions();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const [popup, setPopup] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error";
  }>({ isOpen: false, message: "", type: "success" });

  const productPermissions = {
    canEdit: can(PERMISSIONS.PRODUCTS_EDIT),
    canDelete: can(PERMISSIONS.PRODUCTS_DELETE),
    canCreate: can(PERMISSIONS.PRODUCTS_CREATE),
  };

  const fetchData = async () => {
    setIsInitialLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosInstance.get("/products"),
        axiosInstance.get("/categories"),
      ]);
      setProducts(prodRes.data.products || []);
      const cats = Array.isArray(catRes.data) ? catRes.data : catRes.data.data || [];
      setCategories(cats);
    } catch (error) {
      console.error("خطا در بارگذاری اولیه:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const fetchProducts = async () => {
    try {
      const { data } = await axiosInstance.get("/products", {
        params: { _t: Date.now() },
      });
      setProducts(data.products || []);
    } catch (error) {
      console.error("خطا در دریافت محصولات:", error);
    }
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    setLoadingAction("delete");
    try {
      await axiosInstance.delete(`/products/${deleteId}`);
      setPopup({ isOpen: true, message: SUCCESS_MESSAGES.productDeleted, type: "success" });
      await fetchProducts();
    } catch (error) {
      setPopup({ isOpen: true, message: getPersianErrorMessage(error, "خطا در حذف محصول رخ داد."), type: "error" });
    } finally {
      setLoadingAction(null);
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleSave = async (data: FormData) => {
    setLoadingAction("save");
    try {
      const url = editingProduct ? `/products/${editingProduct.id}` : "/products";

      await axiosInstance.post(url, data);

      setPopup({
        isOpen: true,
        message: editingProduct ? SUCCESS_MESSAGES.productUpdated : SUCCESS_MESSAGES.productCreated,
        type: "success",
      });
      setIsModalOpen(false);
      setEditingProduct(null);
      setLoadingAction(null);
      void fetchProducts();
    } catch (error: any) {
      console.error("Server Error:", error.response?.data);
      const message = error.response?.status === 403 
        ? "شما اجازه انجام این عملیات را ندارید." 
        : getPersianErrorMessage(error, "خطایی در عملیات رخ داد!");
      
      setPopup({ isOpen: true, message, type: "error" });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="مدیریت محصولات"
        buttonText="+ افزودن محصول"
        canClick={can(PERMISSIONS.PRODUCTS_CREATE)}
        onButtonClick={() => {
          setEditingProduct(null);
          setIsModalOpen(true);
        }}
      />

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "ویرایش محصول" : "افزودن محصول جدید"}
        isLoading={loadingAction === "save"}
      >
        <ProductForm product={editingProduct} categories={categories} onSave={handleSave} />
      </ProductModal>

      <SimplePopup
        isOpen={popup.isOpen}
        onClose={() => setPopup({ ...popup, isOpen: false })}
        message={popup.message}
        type={popup.type}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title={products.find((p) => p.id === deleteId)?.name || "این محصول"}
      />

      <div className="mt-4">
        {isInitialLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 w-full bg-gray-200 dark:bg-dark-700 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {products.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                permissions={productPermissions}
                onDelete={() => {
                  setDeleteId(p.id);
                  setIsDeleteModalOpen(true);
                }}
                onEdit={() => {
                  setEditingProduct(p);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            tone="blue"
            eyebrow="محصولات فروشگاه"
            title="هنوز محصولی ثبت نشده است"
            description="اولین محصول فروشگاه را ایجاد کنید تا در این بخش نمایش داده شود."
            icon={
              <svg viewBox="0 0 24 24" className="size-12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3 7.5 9-5.25 9 5.25m-18 0 9 5.25m-9-5.25v9l9 5.25m9-14.25-9 5.25m9-5.25v9l-9 5.25m0-9v9" />
              </svg>
            }
          />
        )}
      </div>
    </div>
  );
}