import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, forwardRef } from "react";

type BaseInputProps = {
  elem?: "input" | "textarea";
  label?: string;
  children?: ReactNode;
  rows?: number;
} & InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>;

const BaseInput = forwardRef<HTMLInputElement & HTMLTextAreaElement, BaseInputProps>(
  ({ elem = "input", label, className = "", children, ...props }, ref) => {
    const commonClasses = `w-full px-4! py-3! rounded-xl focus:shadow-sm! focus:shadow-ui-green-400! focus:ring-2 dark:border-2! focus:ring-ui-blue-400/40 border! border-custom-gray-400/50! dark:border-white/10! bg-light dark:bg-dark-600 text-text-on-light dark:text-text-on-dark transition-all ${className}`;

    return (
      <div className="w-full relative">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
          </label>
        )}
        {elem === "textarea" ? (
          <textarea ref={ref as any} className={commonClasses} {...props} />
        ) : (
          <input ref={ref as any} className={commonClasses} {...props} />
        )}
        {children}
      </div>
    );
  }
);

BaseInput.displayName = "BaseInput";

export default BaseInput;