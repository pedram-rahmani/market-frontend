"use client";

import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useImageCompressor } from "@/store/hooks/useImageCompressor";
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
  const [avatarLoading, setAvatarLoading] = useState(true);

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

    setFormData(initialData);
    setAvatarPreview(initialData.avatar || null);
    setSelectedAvatarFile(null);
    setAvatarLoading(true);

    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get("/me");
        const userData: User = res.data?.user || res.data;

        if (userData) {
          const fetchedData: EditProfileFormValues = {
            name: userData.name || "",
            phone: userData.phone || "",
            email: userData.email || "",
            address: userData.address || userData.postal_address || "",
            avatar: userData.avatar || "",
          };
          setFormData(fetchedData);
          setAvatarPreview(userData.avatar || null);
        }
      } catch (err) {
        console.error("Error fetching current user profile:", err);
      } finally {
        setAvatarLoading(false);
      }
    };

    fetchUserData();
  }, [isOpen, initialData]);

  const handleInputChange = (
    field: keyof EditProfileFormValues,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimizedFile = await processAvatar(file, 300, 0.85);
      setSelectedAvatarFile(optimizedFile);
      setAvatarPreview(URL.createObjectURL(optimizedFile));
    } catch (err) {
      console.error("Error processing image:", err);
    }
  };

  const getAvatarUrl = () => {
    if (!avatarPreview) return null;
    if (avatarPreview.startsWith("blob:") || avatarPreview.startsWith("http")) {
      return avatarPreview;
    }
    return `http://127.0.0.1:8000/storage/${avatarPreview}`;
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
    avatarLoading,
    isProcessing,
    messageModalOpen,
    setMessageModalOpen,
    apiResponse,
    fileInputRef,
    handleInputChange,
    handleAvatarChange,
    getAvatarUrl,
    handleSubmit,
  };
}
