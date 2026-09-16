"use client";
import { useState } from "react";

export default function ProductOverview({ specs, blocks }: { specs: any, blocks: any }) {
  const [activeTab, setActiveTab] = useState("specs");

  return (
    <div className="mt-16 w-full bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
      <div className="flex p-1.5 bg-gray-50 rounded-2xl gap-2">
        <TabButton active={activeTab === "specs"} onClick={() => setActiveTab("specs")}>
          مشخصات فنی
        </TabButton>
        <TabButton active={activeTab === "content"} onClick={() => setActiveTab("content")}>
          معرفی محصول
        </TabButton>
      </div>

      <div className="p-10 transition-all duration-500 ease-in-out">
        {activeTab === "specs" ? (
          <ProductSpecsList specs={specs} />
        ) : (
          <ProductContentList blocks={blocks} />
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 font-bold rounded-xl transition-all duration-300 ${
        active 
          ? "bg-white text-blue-600 shadow-md ring-1 ring-black/5" 
          : "text-gray-500 hover:text-gray-800"
      }`}
    >
      {children}
    </button>
  );
}

function ProductSpecsList({ specs }: { specs: any[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-x-16 gap-y-3">
      {specs.map((s, index) => (
        <div key={s.id} className={`flex justify-between items-center px-6 py-4 rounded-xl ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
          <span className="text-gray-500 font-medium">{s.feature.title}</span>
          <span className="font-bold text-gray-900">{s.value}</span>
        </div>
      ))}
    </div>
  );
}

function ProductContentList({ blocks }: { blocks: any[] }) {
  return (
    <div className="space-y-12">
      {blocks.map((b, i) => (
        <div key={i} className="max-w-3xl">
          <h3 className="text-2xl font-extrabold mb-4 text-gray-900 tracking-tight">{b.title}</h3>
          <p className="text-gray-600 leading-9 text-lg">{b.body}</p>
        </div>
      ))}
    </div>
  );
}