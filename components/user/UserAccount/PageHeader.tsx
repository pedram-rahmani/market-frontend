"use client";

interface PageHeaderProps {
  title: string;
  buttonText?: string;
  onButtonClick?: () => void;
  isLoading?: boolean;
  canClick?: boolean;
  formId?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ 
  title, 
  buttonText, 
  onButtonClick, 
  isLoading, 
  canClick = true,
  formId, 
  children
}: PageHeaderProps) {
  
  const isButtonDisabled = isLoading || !canClick;

  return (
    <div className="sticky top-20 sm:top-24 md:top-20 z-20 bg-white/70 dark:bg-dark-900/70 backdrop-blur-xl py-3 px-4 sm:px-6 mb-4 border border-gray-200 dark:border-white/10 rounded-2xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
      <h1 className="text-base sm:text-lg font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
        <span className="w-1.5 h-6 bg-violet-600 rounded-full shrink-0"></span> 
        <span className="wrap-break-word">{title}</span>
      </h1>
      
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end overflow-x-auto pb-1 sm:pb-0">
        {children}
        
        {buttonText && (
          <button 
            type={formId ? "submit" : "button"} 
            form={formId} 
            onClick={onButtonClick} 
            disabled={isButtonDisabled}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl font-bold text-sm transition-all bg-violet-600 text-white hover:bg-violet-700 ${
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