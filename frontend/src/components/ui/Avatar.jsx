import { useState } from "react";
import { Camera } from "lucide-react";
import { cn } from "../../utils/cn";

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
  "2xl": "h-24 w-24 text-2xl",
};

const indicatorSizes = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3.5 w-3.5 border-2",
  xl: "h-4 w-4 border-2",
  "2xl": "h-5 w-5 border-2",
};

/**
 * Reusable Circular Avatar component with image loading fallback,
 * initials generator, online status dot, and hover "Change photo" overlay.
 */
const Avatar = ({
  src,
  name = "User",
  size = "md",
  className,
  showOnlineIndicator = false,
  editable = false,
  onEditClick,
  ...props
}) => {
  const [imgError, setImgError] = useState(false);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const indicatorSizeClass = indicatorSizes[size] || indicatorSizes.md;

  const handleContainerClick = () => {
    if (editable && onEditClick) {
      onEditClick();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      role={editable ? "button" : undefined}
      tabIndex={editable ? 0 : undefined}
      onKeyDown={editable ? (e) => (e.key === "Enter" || e.key === " ") && onEditClick?.() : undefined}
      className={cn(
        "relative inline-flex shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-indigo-650 font-bold text-white shadow-md shadow-blue-500/15 ring-2 ring-white/10 dark:ring-slate-800/80 transition-all duration-200 overflow-hidden",
        sizeClass,
        editable && "cursor-pointer group hover:ring-blue-500/50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <span className="leading-none tracking-tight">{initials}</span>
      )}

      {/* Editable Hover Overlay */}
      {editable && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-full bg-slate-950/65 opacity-0 backdrop-blur-[1px] transition-all duration-200 group-hover:opacity-100 group-focus:opacity-100">
          <Camera className={cn("text-white transition-transform duration-200 group-hover:scale-110", size === "xl" || size === "2xl" ? "h-6 w-6 mb-0.5" : "h-3.5 w-3.5")} />
          {(size === "xl" || size === "2xl" || size === "lg") && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/95 text-center px-1 leading-tight">
              Change photo
            </span>
          )}
        </div>
      )}

      {/* Online Status Dot */}
      {showOnlineIndicator && (
        <span
          className={cn(
            "absolute bottom-0 right-0 z-20 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-sm",
            indicatorSizeClass
          )}
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        </span>
      )}
    </div>
  );
};

export default Avatar;
