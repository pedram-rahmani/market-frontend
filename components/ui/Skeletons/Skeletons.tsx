import { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {

}

export function BaseSkeleton({ className = "w-full h-4", ...props }: SkeletonProps) {
  return (
    <div 
      className={`bg-white/70 dark:bg-custom-gray-400/10 animate-pulse rounded-lg ${className}`} 
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white/70 dark:bg-custom-gray-400/10 p-4 rounded-xl border border-custom-gray-400 dark:border-custom-gray-400/20 text-center flex flex-col items-center justify-center gap-y-2 animate-pulse">
      <BaseSkeleton className="w-20 h-4" />
      <BaseSkeleton className="w-12 h-6" />
    </div>
  );
}

export function SkeletonAvatar({ size = "size-12" }: { size?: string }) {
  return <BaseSkeleton className={`${size} rounded-full`} />;
}