"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import CurrentOrders from "@/components/user/UserAccount/purchases/current/CurrentOrders";
import DeliveredOrders from "@/components/user/UserAccount/purchases/delivered/DeliveredOrders";
import ReturnedOrders from "@/components/user/UserAccount/purchases/returned/ReturnedOrders";
import CancelledOrders from "@/components/user/UserAccount/purchases/cancelled/CancelledOrders";

const tabs = [
  { id: "current", label: "جاری", count: 0 },
  { id: "delivered", label: "تحویل شده", count: 1 },
  { id: "returned", label: "مرجوع شده", count: 0 },
  { id: "cancelled", label: "لغو شده", count: 0 },
];

export default function PurchasesContent() {
  const [activeTab, setActiveTab] = useState("current");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/user/orders`, {
          params: { status: activeTab },
        });

        if (response.data.status === "success") {
          setOrders(response.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "current":
        return <CurrentOrders orders={orders} />;
      case "delivered":
        return <DeliveredOrders orders={orders} />;
      case "returned":
        return <ReturnedOrders orders={orders} />;
      case "cancelled":
        return <CancelledOrders orders={orders} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-ui-blue-900 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="font-bold text-lg text-text-on-light dark:text-white shrink-0">
          تاریخچه سفارشات
        </h2>
        {/* tabs container */}
        <div className="w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-ui-red-600 text-white shadow-lg shadow-rose-500/20"
                      : "bg-custom-gray-100/40 dark:bg-white/5 hover:bg-dark-600/13 dark:hover:bg-white/10 hover:text-black/70 dark:hover:text-white"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-gray-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* tabs content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
}
