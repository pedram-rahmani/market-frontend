"use client";

import { useState, useRef, useCallback } from "react";
import Select from "@/components/ui/Form/Select";
import useClickOutside from "@/store/hooks/useClickOutside";
import SecureInput from "@/components/ui/SecureInput/SecureInput";
import useLockBodyScroll from "@/store/hooks/useLockBodyScroll";

export function AddUserModal({ isOpen, onClose, onAdd, canAssignStaff = false }: any) {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    username:'',
    password: '', 
    role: 'user', 
    phone: '' 
  });

  const modalRef = useRef<HTMLDivElement>(null!);
  useLockBodyScroll(isOpen);
  const handlePasswordInput = useCallback((_id: string, value: string) => {
    setFormData((current) =>
      current.password === value ? current : { ...current, password: value },
    );
  }, []);

  useClickOutside(onClose, modalRef);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-800/60 backdrop-blur-sm">
      <div 
        ref={modalRef} 
        className="bg-light dark:bg-dark-800 p-6 rounded-2xl w-full max-w-sm shadow-xl flex flex-col gap-4"
      >
        <h3 className="text-lg font-bold">افزودن کاربر جدید</h3>
        
        <div className="flex flex-col gap-3">
          <input 
            placeholder="نام" 
            className="input-info w-full" 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
          <input 
            placeholder="ایمیل" 
            className="input-info w-full" 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          <input 
            placeholder="نام کاربری" 
            className="input-info w-full" 
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
          />
          <input 
            placeholder="شماره تماس" 
            className="input-info w-full" 
            onChange={(e) => setFormData({...formData, phone: e.target.value})} 
          />
          <SecureInput
            id="new-user-password"
            placeholder="رمز عبور"
            validations={[]}
            autoComplete="new-password"
            onInputHandler={handlePasswordInput}
            className="input-info"
          />
        </div>

        <div className="w-full">
          <label className="text-xs text-custom-gray-400 mb-1 block">نقش کاربر</label>
          <Select
            variant="simple"
            className="w-full"
            value={formData.role}
            onChange={(val) => setFormData({ ...formData, role: val })}
            options={[
              { value: "user", label: "کاربر عادی" },
              ...(canAssignStaff
                ? [
                    { value: "co-admin", label: "ادمین ارشد" },
                    { value: "admin", label: "مدیر کل" },
                  ]
                : []),
            ]}
          />
        </div>
        
        <div className="flex gap-3 mt-2">
          <button 
            onClick={onClose} 
            className="flex-1 py-2.5 rounded-xl bg-custom-gray-300/50 dark:bg-custom-gray-300/50 text-text-on-light dark:text-text-on-dark"
          >
            انصراف
          </button>
          <button 
            onClick={() => onAdd(formData)} 
            className="flex-1 py-2.5 rounded-xl bg-violet-600 text-text-on-dark"
          >
            افزودن
          </button>
        </div>
      </div>
    </div>
  );
}