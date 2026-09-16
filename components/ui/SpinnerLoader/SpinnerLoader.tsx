interface SpinnerProps {
  variant?: "multi-color" | "simple";
  className?: string;
}

export default function SpinnerLoader({
  variant = "simple",
  className = "w-10 h-10",
}: SpinnerProps) {
  // multicolor spinner
  if (variant === "multi-color") {
    return (
      <div className={`relative animate-spin ${className}`}>
        <div className="absolute top-0 left-0 w-full h-full border-[3px] border-t-blue-500 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-[3px] border-r-green-500 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-[3px] border-b-yellow-500 rounded-full"></div>
      </div>
    );
  }

  // simple spinner
  return (
   <div className={`border-[3px] border-current/30 border-t-current rounded-full animate-spin ${className}`}></div>
  );
}
