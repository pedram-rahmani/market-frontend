"use client";

import { useAuth } from "@/store/hooks/useAuth";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import DashboardGreeting from "@/components/user/UserAccount/dashboard/DashboardGreeting";
import DashboardStatsGrid from "@/components/user/UserAccount/dashboard/DashboardStatsGrid";
import UserInfoCard from "@/components/user/UserAccount/dashboard/UserInfoCard";
import EditProfileModal from "@/components/user/UserAccount/dashboard/EditProfileModal";
import UserCoupons from "@/components/user/UserAccount/dashboard/UserCoupons"; // ۱. ایمپورت کامپوننت کدهای تخفیف

interface DashboardStats {
  order_count: number;
  ticket_count: number;
  wallet_balance: number;
}

export default function Page() {
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats>({
    order_count: 0,
    ticket_count: 0,
    wallet_balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [userData, setUserData] = useState(user);

  useEffect(() => {
    if (user) setUserData(user);
  }, [user]);

  useEffect(() => {
    axiosInstance
      .get("/dashboard-stats")
      .then((res) => {
        setStats(res.data.stats || res.data);
      })
      .catch((err) => {
        console.error("خطا در دریافت آمار:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const userName =
    (userData as any)?.user?.name || userData?.name || "کاربر عزیز";
  const userPhone = 
    (userData as any)?.user?.phone || 
    (userData as any)?.phone || 
    (userData as any)?.addresses?.[0]?.phone || "";
    
  const userEmail = (userData as any)?.user?.email || userData?.email || "";
  
  const rawAddresses = (userData as any)?.addresses || (userData as any)?.user?.addresses;
  const defaultAddressObj = 
    Array.isArray(rawAddresses) 
      ? (rawAddresses.find((addr: any) => addr.is_default === true || addr.is_default === 1) || rawAddresses[0])
      : null;

  const userAddress =
    defaultAddressObj?.postal_address ||
    (userData as any)?.user?.postal_address ||
    (userData as any)?.postal_address ||
    "";
    

  const handleUpdateSuccess = (updatedFields: any) => {
    setUserData((prev: any) => {
      const targetUser = prev?.user || prev;
      const updatedUser = { ...targetUser, ...updatedFields };
      
      let updatedAddresses = targetUser.addresses ? [...targetUser.addresses] : [];
      if (updatedFields.postal_address || updatedFields.phone) {
        if (updatedAddresses.length > 0) {
          updatedAddresses[0] = {
            ...updatedAddresses[0],
            postal_address: updatedFields.postal_address ?? updatedAddresses[0].postal_address,
            phone: updatedFields.phone ?? updatedAddresses[0].phone,
          };
        } else {
          updatedAddresses.push({
            postal_address: updatedFields.postal_address,
            phone: updatedFields.phone,
            is_default: true,
          });
        }
      }

      return {
        ...prev,
        user: { ...updatedUser, addresses: updatedAddresses },
        addresses: updatedAddresses,
        postal_address: updatedFields.postal_address ?? prev?.postal_address,
      };
    });
  };

  return (
    <div className="p-6 space-y-8" dir="rtl">
      <DashboardGreeting userName={userName} />
      <DashboardStatsGrid loading={loading} stats={stats} />
      <UserInfoCard
        user={userData}
        onOpenEditModal={() => setIsModalOpen(true)}
      />

      {/* ۲. اضافه کردن بخش کدهای تخفیف به داشبورد */}
      <UserCoupons />

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={{
          name: userName,
          phone: userPhone,
          email: userEmail,
          address: userAddress,
        }}
        onSuccess={handleUpdateSuccess}
      />
    </div>
  );
}