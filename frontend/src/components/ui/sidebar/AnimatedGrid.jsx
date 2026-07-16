import { memo } from "react";

/**
 * AnimatedGrid — A subtle, continuously moving technical grid overlay.
 *
 * Uses pure CSS for performance: two overlapping grid layers with
 * different movement speeds create a parallax depth effect reminiscent
 * of Vercel/Linear dashboards. The primary grid drifts diagonally,
 * while a secondary finer grid moves slower for depth.
 *
 * Performance: CSS `background-position` animation on composited layer.
 * Accessibility: `aria-hidden`, `pointer-events-none`, respects
 *                `prefers-reduced-motion` via CSS keyframe guard.
 */
const AnimatedGrid = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    >
      {/* Primary grid — 28px cells, drifts diagonally */}
      <div className="sidebar-animated-grid sidebar-animated-grid--primary absolute inset-0" />

      {/* Secondary grid — 56px cells, slower drift for parallax */}
      <div className="sidebar-animated-grid sidebar-animated-grid--secondary absolute inset-0" />

      {/* Horizontal accent lines at fixed positions — very faint */}
      <div
        className="absolute inset-x-0 top-[30%] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.06) 30%, rgba(6, 182, 212, 0.04) 70%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 top-[65%] h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.05) 40%, rgba(59, 130, 246, 0.04) 60%, transparent 100%)",
        }}
      />
    </div>
  );
};

export default memo(AnimatedGrid);
