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
    <div className="sticky top-22 z-30 mb-4 flex min-w-0 flex-col gap-3 rounded-2xl border border-gray-100 bg-white/95 p-3 shadow-sm backdrop-blur-md dark:border-ui-blue-700/70 dark:bg-dark-800/95 dark:shadow-ui-blue-900/30 sm:top-28 sm:mb-6 sm:gap-4 sm:p-5 md:top-22 md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        {icon && (
          <div className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-500 sm:flex sm:size-14">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="wrap-break-word text-base font-black leading-tight text-gray-800 dark:text-white sm:text-xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-xs text-gray-400">{description}</p>
          )}
        </div>
      </div>
      
      <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:gap-3">
        {children}
        
        {buttonText && (
          <button 
            type={formId ? "submit" : "button"} 
            form={formId} 
            onClick={onButtonClick} 
            disabled={isButtonDisabled}
            className={`flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-violet-600 px-3 py-2 text-xs font-bold text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-700 sm:flex-none sm:px-4 sm:py-2.5 ${
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