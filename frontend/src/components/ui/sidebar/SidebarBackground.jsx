import { memo } from "react";

import AnimatedGrid from "./AnimatedGrid";
import FloatingParticles from "./FloatingParticles";
import ScannerEffect from "./ScannerEffect";

/**
 * SidebarBackground — Composite atmospheric background layer.
 *
 * Orchestrates three independent visual layers:
 *   1. AnimatedGrid     — Parallax dual-grid with diagonal drift
 *   2. FloatingParticles — 15 color-coded glowing particles
 *   3. ScannerEffect     — Periodic inventory-scanner sweep
 *
 * Each layer is a standalone, memoized component with its own
 * CSS animations. This composition wrapper adds edge vignettes
 * for depth and ensures all effects sit behind sidebar content.
 *
 * Performance:
 *   - Zero JS animation loops — all CSS keyframes
 *   - Every animated property is GPU-composited (transform/opacity)
 *   - All animations disabled for prefers-reduced-motion users
 *
 * Accessibility:
 *   - `aria-hidden="true"` on the container
 *   - `pointer-events: none` so nothing intercepts clicks
 */
const SidebarBackground = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 1 — Technical grid with parallax drift */}
      <AnimatedGrid />

      {/* Layer 2 — Floating particle system */}
      <FloatingParticles />

      {/* Layer 3 — Scanner sweep (every ~12s) */}
      <ScannerEffect />

      {/* Top vignette — fades content into the dark background */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0F172A] to-transparent" />

      {/* Bottom vignette — anchors the sidebar visually */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0F172A]/80 to-transparent" />
    </div>
  );
};

export default memo(SidebarBackground);
