"use client";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import useForm from "@/store/hooks/useForm";

import BasicInfoTab from "./product-form-parts/BasicInfoTab";
import WarrantiesTab from "./product-form-parts/WarrantiesTab";
import OptionsTab from "./product-form-parts/OptionsTab";
import SpecificationsTab from "./product-form-parts/SpecificationsTab";
import InventoryTab from "./product-form-parts/InventoryTab";

export default function ProductForm({ product, categories, onSave }: any) {
  const [formState, onInputHandler, setFormData] = useForm({
    name: { value: "", isValid: true },
    slug: { value: "", isValid: true },
    description: { value: "", isValid: true },
    price: { value: "", isValid: true },
    discount: { value: "", isValid: true },
    category_id: { value: "", isValid: true },
  });

  const category_id = formState.inputs.category_id?.value;

  const [colors, setColors] = useState<{ name: string; hex: string }[]>([]);
  const [specs, setSpecs] = useState<{ feature_id: string; name: string; value: string }[]>([]);
  const [editingSpecIndex, setEditingSpecIndex] = useState<number | null>(null);
  const [allFeatures, setAllFeatures] = useState<{ id: number; title: string; name?: string }[]>([]);

  const [stock, setStock] = useState<string | number>("");
  const [sku, setSku] = useState<string>("");

  const [introBlocks, setIntroBlocks] = useState<{ type: string; title: string; content: string; sort_order: number }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [options, setOptions] = useState<{ title: string; items: string[] }[]>([]);
  const [newItemText, setNewItemText] = useState<{ [key: number]: string }>({});

  const [allWarranties, setAllWarranties] = useState<{ id: number; title: string; duration_months: number }[]>([]);
  const [selectedWarranties, setSelectedWarranties] = useState<{ warranty_id: string; price: string; is_default: boolean }[]>([]);
  const [editingWarrantyIndex, setEditingWarrantyIndex] = useState<number | null>(null);

  const handleNameChange = (val: string) => {
    const newSlug = val
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, "")
      .replace(/\s+/g, "-");

    onInputHandler("name", val, true);
    onInputHandler("slug", newSlug, true);
  };

  const handleDeleteWarranty = async (warrantyId: number) => {
    if (!confirm("آیا از حذف این گارانتی از سیستم مطمئن هستید؟")) return;
    try {
      await axiosInstance.delete(`/warranties/${warrantyId}`);
      await fetchWarranties();
      setSelectedWarranties(selectedWarranties.filter((w: any) => w.warranty_id !== warrantyId.toString()));
    } catch (error) {
      console.error("خطا در حذف گارانتی:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const fetchWarranties = async () => {
    try {
      const { data } = await axiosInstance.get("/warranties");
      setAllWarranties(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("خطا در دریافت لیست گارانتی‌ها:", error);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: { value: product.name || "", isValid: true },
        slug: { value: product.slug || "", isValid: true },
        description: { value: product.description || "", isValid: true },
        price: { value: product.price ? product.price.toString() : "", isValid: true },
        discount: { value: product.discount ? product.discount.toString() : "", isValid: true },
        category_id: { value: product.category_id ? product.category_id.toString() : "", isValid: true },
      });

      setColors(product.colors || []);
      setStock(product.stock ?? "");
      setSku(product.sku || "");

      if (Array.isArray(product.specifications)) {
        setSpecs(
          product.specifications.map((s: any) => ({
            feature_id: s.feature_id ? s.feature_id.toString() : "",
            name: s.name || "",
            value: s.value || "",
          }))
        );
      } else {
        setSpecs([]);
      }

      setIntroBlocks(product.introductions || []);

      if (product.options) {
        if (typeof product.options === "string") {
          try {
            setOptions(JSON.parse(product.options));
          } catch (e) {
            setOptions([]);
          }
        } else {
          setOptions(product.options);
        }
      } else {
        setOptions([]);
      }

      if (Array.isArray(product.warranties)) {
        setSelectedWarranties(
          product.warranties.map((w: any) => ({
            warranty_id: w.id ? w.id.toString() : "",
            price: w.pivot?.price ? w.pivot.price.toString() : "",
            is_default: Boolean(w.pivot?.is_default),
          }))
        );
      } else {
        setSelectedWarranties([]);
      }

      if (product.img) {
        if (product.img.startsWith("http") || product.img.startsWith("/images")) {
          setPreviewUrl(product.img);
        } else {
          setPreviewUrl(`${process.env.NEXT_PUBLIC_ASSET_URL}/storage/${product.img}`);
        }
      } else {
        setPreviewUrl(null);
      }
    }
  }, [product, setFormData]);

  useEffect(() => {
    if (category_id) {
      axiosInstance
        .get(`/categories/${category_id}/features`)
        .then(({ data }) => setAllFeatures(data.features || data || []))
        .catch((err) => console.error("خطا در دریافت ویژگی‌ها:", err));
    }
  }, [category_id]);

  const handleSaveNewWarranty = async (index: number, title: string) => {
    if (!title.trim()) {
      setEditingWarrantyIndex(null);
      return;
    }
    try {
      const { data } = await axiosInstance.post("/warranties", {
        title,
        duration_months: 0,
      });
      const newWarranty = data.warranty || data;
      await fetchWarranties();

      const nw = [...selectedWarranties];
      nw[index].warranty_id = newWarranty.id.toString();
      setSelectedWarranties(nw);
    } catch (error) {
      console.error("خطا در ایجاد گارانتی جدید:", error);
    } finally {
      setEditingWarrantyIndex(null);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.isFormValid) {
      alert("لطفاً فیلدهای فرم را به درستی پر کنید.");
      return;
    }

    const data = new FormData();

    data.append("name", formState.inputs.name.value || "");
    data.append("slug", formState.inputs.slug.value || "");
    data.append("price", formState.inputs.price.value || "0");
    data.append("discount", formState.inputs.discount.value || "0");
    data.append("category_id", formState.inputs.category_id.value || "");
    data.append("description", formState.inputs.description.value || "");

    data.append("stock", stock.toString());
    data.append("sku", sku);

    data.append("introduction_blocks", JSON.stringify(introBlocks));
    data.append("colors", JSON.stringify(colors));
    data.append("options", JSON.stringify(options));
    data.append("warranties", JSON.stringify(selectedWarranties));

    const processedSpecs = specs
      .filter((s) => s.feature_id || s.name)
      .map((s) => ({
        ...s,
        feature_id: !isNaN(Number(s.feature_id)) && s.feature_id.trim() !== "" ? Number(s.feature_id) : s.feature_id,
        name: s.name || s.feature_id,
      }));

    data.append("specifications", JSON.stringify(processedSpecs));

    if (file) data.append("img", file);
    if (product) data.append("_method", "PATCH");

    onSave(data);
  };

  return (
    <form id="product-form" onSubmit={handleSubmitForm} className="space-y-6">
      <BasicInfoTab
        formState={formState}
        onInputHandler={onInputHandler}
        categories={categories}
        colors={colors}
        setColors={setColors}
        introBlocks={introBlocks}
        setIntroBlocks={setIntroBlocks}
        previewUrl={previewUrl}
        handleImageChange={handleImageChange}
        handleNameChange={handleNameChange}
      />

      <InventoryTab 
        stock={stock} 
        setStock={setStock} 
        sku={sku} 
        setSku={setSku} 
      />

      <WarrantiesTab
        selectedWarranties={selectedWarranties}
        setSelectedWarranties={setSelectedWarranties}
        allWarranties={allWarranties}
        editingWarrantyIndex={editingWarrantyIndex}
        setEditingWarrantyIndex={setEditingWarrantyIndex}
        handleSaveNewWarranty={handleSaveNewWarranty}
        handleDeleteWarranty={handleDeleteWarranty}
      />

      <OptionsTab
        options={options}
        setOptions={setOptions}
        newItemText={newItemText}
        setNewItemText={setNewItemText}
      />

      <SpecificationsTab
        specs={specs}
        setSpecs={setSpecs}
        allFeatures={allFeatures}
        editingSpecIndex={editingSpecIndex}
        setEditingSpecIndex={setEditingSpecIndex}
      />
    </form>
  );
}