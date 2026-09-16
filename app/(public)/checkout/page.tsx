"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AddressCard from "@/components/checkout/AddressCard";
import ShippingMethod from "@/components/checkout/ShippingMethod";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import SimplePopup from "@/components/feedback/MessageModal/SimplePopup";
import EditAddressModal from "@/components/checkout/EditAddressModal";

export default function CheckoutPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  const [actualUser, setActualUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // هماهنگ‌سازی کلید address با اینترفیس مودال EditAddressModal
  const [tempData, setTempData] = useState({
    name: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const fetchedUser = (user as any)?.user || user;

    if (fetchedUser) {
      setActualUser(fetchedUser);
      
      // اولویت با آدرسی که پیش‌فرض است یا اولین آدرس ثبت‌شده
      const defaultAddress = fetchedUser.addresses?.find((addr: any) => addr.is_default) || fetchedUser.addresses?.[0];

      setTempData({
        name: fetchedUser.name || "",
        phone: defaultAddress?.phone || fetchedUser.phone || "",
        address: defaultAddress?.postal_address || ""
      });
    }
    setIsLoaded(true);
  }, [user]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("express");
  const [paymentMethod, setPaymentMethod] = useState("online");

  const shippingCosts: Record<string, number> = {
    express: 45000,
    vip: 90000,
  };

  const cartItemsPrice = 770000; 
  const currentShippingCost = shippingCosts[shippingMethod] || 0;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState<"success" | "error">("success");

  const handleSaveAddress = () => {
    setIsEditModalOpen(false);
    setPopupMessage("اطلاعات آدرس با موفقیت بروز شد.");
    setPopupType("success");
    setIsPopupOpen(true);
  };

  const handlePayment = () => {
    setPopupMessage("سفارش شما با موفقیت ثبت شد. در حال انتقال به درگاه...");
    setPopupType("success");
    setIsPopupOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        تکمیل فرایند خرید و تسویه حساب
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <AddressCard 
            userInfo={actualUser} 
            loading={!isLoaded || !user} 
            onEdit={() => { setIsEditModalOpen(true); }} 
          />
          <ShippingMethod selected={shippingMethod} onSelect={setShippingMethod} />
          <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod} />
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <CheckoutSummary 
            totalItemsPrice={cartItemsPrice} 
            shippingCost={currentShippingCost} 
            onPayment={handlePayment} 
          />
        </div>
      </div>

      <EditAddressModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formData={tempData}
        onChange={(e) => setTempData({ ...tempData, [e.target.name]: e.target.value })}
        onSave={handleSaveAddress}
      />

      <SimplePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        message={popupMessage}
        type={popupType}
      />
    </div>
  );
}