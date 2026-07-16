import { cn } from "../../utils/cn";

export const ShelfIQIcon = ({ className = "h-8 w-8", ...props }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* Gradients */}
      <defs>
        <linearGradient id="gradient-blue" x1="6" y1="16" x2="9" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="gradient-indigo" x1="10.5" y1="10" x2="13.5" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="gradient-cyan" x1="18.5" y1="6" x2="21.5" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06B6D4" />
          <stop offset="1" stopColor="#0891B2" />
        </linearGradient>
      </defs>

      {/* Left Page / Analytics Bars */}
      <rect x="6" y="16" width="3" height="10" rx="1.5" fill="url(#gradient-blue)" />
      <rect x="10.5" y="10" width="3" height="16" rx="1.5" fill="url(#gradient-indigo)" />
      
      {/* Right Page / Analytics Bars */}
      <rect x="18.5" y="6" width="3" height="20" rx="1.5" fill="url(#gradient-cyan)" />
      <rect x="23" y="12" width="3" height="14" rx="1.5" fill="url(#gradient-blue)" />

      {/* Spine / Book Open Curve */}
      <path 
        d="M4 26.5C9.5 26.5 12.5 28 16 28C19.5 28 22.5 26.5 28 26.5" 
        stroke="#94A3B8" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        className="stroke-slate-400 dark:stroke-slate-600"
      />
      
      {/* Intelligent AI Sparkle / Insights AI Dot */}
      <circle cx="20" cy="3" r="1.5" fill="#06B6D4" className="animate-pulse" />
    </svg>
  );
};

export const ShelfIQLogo = ({ className = "", showText = true, darkText = false }) => {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <div className="h-9 w-9 rounded-xl bg-[#0F172A] border border-slate-800 flex items-center justify-center shadow-md dark:bg-slate-900 dark:border-slate-800">
        <ShelfIQIcon className="h-5.5 w-5.5" />
      </div>
      
      {showText && (
        <span className={cn(
          "text-xl font-bold tracking-tight",
          darkText ? "text-slate-900" : "text-white"
        )}>
          Shelf<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">IQ</span>
        </span>
      )}
    </div>
  );
};
