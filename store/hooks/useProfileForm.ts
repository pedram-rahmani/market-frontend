"use client";

import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useImageCompressor } from "@/store/hooks/useImageCompressor";
import { getImagePath } from "@/lib/utils";
import { User } from "@/types/user";

export interface EditProfileFormValues {
  name: string;
  phone: string;
  email: string;
  address: string;
  avatar?: string;
}

export function useProfileForm(
  initialData: EditProfileFormValues,
  isOpen: boolean,
  onSuccess: (updatedData: EditProfileFormValues) => void,
  onClose: () => void,
) {
  const [formData, setFormData] = useState<EditProfileFormValues>(initialData);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(true);
  const [avatarImageLoading, setAvatarImageLoading] = useState(true);

  const { processAvatar, isProcessing } = useImageCompressor();
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
    null,
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData.avatar || null,
  );

  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    let storedUser: any = null;
    if (typeof window !== "undefined") {
      try {
        storedUser = JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        storedUser = null;
      }
    }

    const storedAddress = Array.isArray(storedUser?.addresses)
      ? storedUser.addresses.find(
          (address: any) =>
            address?.is_default === true || address?.is_default === 1,
        ) || storedUser.addresses[0]
      : null;
    const fallbackData: EditProfileFormValues = {
      name: initialData.name || storedUser?.name || "",
      phone: initialData.phone || storedUser?.phone || storedAddress?.phone || "",
      email: initialData.email || storedUser?.email || "",
      address:
        initialData.address ||
        storedUser?.address ||
        storedUser?.postal_address ||
        storedAddress?.postal_address ||
        "",
      avatar: initialData.avatar || storedUser?.avatar || "",
    };

    setFormData(fallbackData);
    setAvatarPreview(fallbackData.avatar || null);
    setSelectedAvatarFile(null);
    setProfileLoading(false);
    setAvatarLoading(false);
    setAvatarImageLoading(Boolean(fallbackData.avatar));
  }, [
    isOpen,
    initialData.name,
    initialData.phone,
    initialData.email,
    initialData.address,
    initialData.avatar,
  ]);

  const handleInputChange = (
    field: keyof EditProfileFormValues,
    value: string,
  ) => {
    setFormData((prev) =>
      prev[field] === value ? prev : { ...prev, [field]: value },
    );
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimizedFile = await processAvatar(file, 300, 0.85);
      setSelectedAvatarFile(optimizedFile);
        setAvatarImageLoading(true);
        setAvatarPreview(URL.createObjectURL(optimizedFile));
    } catch (err) {
      console.error("Error processing image:", err);
    }
  };

  // استفاده از تابع متمرکز getImagePath برای مدیریت یکپارچه آدرس آواتار
  const getAvatarUrl = () => {
    if (!avatarPreview) return null;
    if (avatarPreview.startsWith("blob:") || avatarPreview.startsWith("http")) {
      return avatarPreview;
    }
    return getImagePath(avatarPreview);
  };

  const handleAvatarImageError = () => {
    setAvatarImageLoading(false);
    setAvatarPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("email", formData.email);
      data.append("postal_address", formData.address);
      if (selectedAvatarFile) {
        data.append("avatar", selectedAvatarFile);
      }
      data.append("_method", "PUT");

      const res = await axiosInstance.post("/user/profile", data);

      const resUser: User = res.data?.user || res.data;
      const newAvatarPath = resUser?.avatar || formData.avatar;

      const updatedFormData: EditProfileFormValues = {
        ...formData,
        avatar: newAvatarPath,
      };

      setFormData(updatedFormData);
      setAvatarPreview(newAvatarPath || null);

      setApiResponse({
        status: res.status || 200,
        ...res.data,
      });
      setMessageModalOpen(true);

      onSuccess(updatedFormData);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setApiResponse({
        status: err.response?.status || 500,
        errors: err.response?.data?.errors,
        message: err.response?.data?.message,
      });
      setMessageModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    profileLoading,
    avatarLoading,
    avatarImageLoading,
    setAvatarImageLoading,
    isProcessing,
    messageModalOpen,
    setMessageModalOpen,
    apiResponse,
    fileInputRef,
    handleInputChange,
    handleAvatarChange,
    handleAvatarImageError,
    getAvatarUrl,
    handleSubmit,
  };
}