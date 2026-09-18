"use client";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  isLoading?: boolean;
  canClick?: boolean;
  formId?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ 
  title, 
  description,
  icon,
  buttonText, 
  onButtonClick, 
  isLoading, 
  canClick = true,
  formId, 
  children
}: PageHeaderProps) {
  
  const isButtonDisabled = isLoading || !canClick;

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-ui-blue-900 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        {icon && (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl font-black text-gray-800 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-xs text-gray-400">{description}</p>
          )}
        </div>
      </div>
      
      <div className="flex w-full items-center justify-end gap-2 overflow-x-auto pb-1 sm:w-auto sm:gap-4 sm:pb-0">
        {children}
        
        {buttonText && (
          <button 
            type={formId ? "submit" : "button"} 
            form={formId} 
            onClick={onButtonClick} 
            disabled={isButtonDisabled}
            className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700 ${
              isButtonDisabled ? "opacity-50 cursor-not-allowed!" : ""
            }`}
          >
            {isLoading ? "در حال پردازش..." : buttonText}
          </button>
        )}
      </div>
    </div>
  );
}