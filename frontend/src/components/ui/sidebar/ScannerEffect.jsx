import { memo } from "react";

/**
 * ScannerEffect — A thin glowing horizontal line that sweeps down
 * the sidebar every ~12 seconds, evoking an inventory-scanning or
 * data-analysis aesthetic.
 *
 * Implementation: A single CSS-animated element with a composite
 * gradient (sharp line + soft glow halo). The line fades in near
 * the top, traverses the full height, and fades out near the bottom.
 *
 * Timing: 12s cycle with ~2s visible sweep and ~10s idle gap
 * (achieved via keyframe percentages — the line is transparent
 * for most of the cycle, only briefly visible during transit).
 *
 * Performance: Single DOM element, `transform: translateY` only,
 * composited on GPU. No JS runtime.
 *
 * Accessibility: `aria-hidden`, `pointer-events-none`, respects
 * `prefers-reduced-motion` via the global CSS guard.
 */
const ScannerEffect = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="sidebar-scanner absolute inset-x-0 top-0 h-[2px]">
        {/* Scanner line core */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.15) 20%, rgba(59, 130, 246, 0.25) 50%, rgba(6, 182, 212, 0.15) 80%, transparent 100%)",
          }}
        />
        {/* Scanner glow halo — wider and softer */}
        <div
          className="absolute -top-3 inset-x-0 h-8"
          style={{
            background:
              "linear-gradient(90deg, transparent 5%, rgba(59, 130, 246, 0.04) 25%, rgba(6, 182, 212, 0.06) 50%, rgba(59, 130, 246, 0.04) 75%, transparent 95%)",
          }}
        />
      </div>
    </div>
  );
};

export default memo(ScannerEffect);
