import { cn } from "../../utils/cn";

export const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-800", className)}
    />
  );
};

export const StatCardSkeleton = () => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-5 h-8 w-20" />
      <Skeleton className="mt-4 h-3 w-32" />
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <Skeleton className="h-5 w-40" />
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="mt-5 grid grid-cols-4 gap-4">
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4" />
        </div>
      ))}
    </div>
  );
};
