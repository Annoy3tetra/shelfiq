import { memo } from "react";

/**
 * FloatingParticles — A system of 15 softly glowing particles that
 * drift, pulse, and fade inside the sidebar.
 *
 * Each particle has:
 *   - Unique position, size, opacity, drift speed, and drift delay
 *   - A separate pulse animation (opacity breathe)
 *   - Colors drawn from the theme palette (blue, cyan, indigo, slate)
 *
 * Performance: Pure CSS animations (transform + opacity only) on
 * individually composited layers. No JS animation loop.
 *
 * Accessibility: `aria-hidden`, `pointer-events-none`, all animations
 * disabled by the global `prefers-reduced-motion: reduce` rule.
 */

const particles = [
  // Group 1 — Blue tones (primary)
  { top: "8%",  left: "12%", size: 3,   opacity: 0.20, drift: "16s", pulse: "6s",  delay: "0s",   color: "59, 130, 246" },
  { top: "18%", left: "72%", size: 2,   opacity: 0.14, drift: "22s", pulse: "8s",  delay: "2s",   color: "59, 130, 246" },
  { top: "52%", left: "18%", size: 3.5, opacity: 0.18, drift: "18s", pulse: "7s",  delay: "4s",   color: "59, 130, 246" },
  { top: "82%", left: "62%", size: 2.5, opacity: 0.16, drift: "20s", pulse: "5s",  delay: "1s",   color: "59, 130, 246" },

  // Group 2 — Cyan tones (accent)
  { top: "14%", left: "55%", size: 2,   opacity: 0.15, drift: "24s", pulse: "9s",  delay: "3s",   color: "6, 182, 212" },
  { top: "38%", left: "82%", size: 3,   opacity: 0.12, drift: "14s", pulse: "6s",  delay: "5s",   color: "6, 182, 212" },
  { top: "68%", left: "42%", size: 2.5, opacity: 0.18, drift: "19s", pulse: "8s",  delay: "7s",   color: "6, 182, 212" },
  { top: "92%", left: "25%", size: 2,   opacity: 0.10, drift: "26s", pulse: "10s", delay: "1.5s", color: "6, 182, 212" },

  // Group 3 — Indigo tones (secondary)
  { top: "28%", left: "35%", size: 2,   opacity: 0.12, drift: "21s", pulse: "7s",  delay: "6s",   color: "99, 102, 241" },
  { top: "45%", left: "68%", size: 3,   opacity: 0.14, drift: "17s", pulse: "5s",  delay: "0.5s", color: "99, 102, 241" },
  { top: "75%", left: "85%", size: 2,   opacity: 0.10, drift: "23s", pulse: "9s",  delay: "3.5s", color: "99, 102, 241" },

  // Group 4 — Slate (neutral glow, larger and fainter)
  { top: "5%",  left: "88%", size: 4,   opacity: 0.06, drift: "28s", pulse: "11s", delay: "2.5s", color: "148, 163, 184" },
  { top: "35%", left: "5%",  size: 5,   opacity: 0.05, drift: "30s", pulse: "12s", delay: "4.5s", color: "148, 163, 184" },
  { top: "60%", left: "52%", size: 4,   opacity: 0.06, drift: "25s", pulse: "10s", delay: "8s",   color: "148, 163, 184" },
  { top: "88%", left: "38%", size: 3.5, opacity: 0.05, drift: "32s", pulse: "13s", delay: "6.5s", color: "148, 163, 184" },
];

const FloatingParticles = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <div
          key={`fp-${i}`}
          className="sidebar-fp absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: `rgba(${p.color}, ${p.opacity})`,
            boxShadow: `0 0 ${p.size * 2}px rgba(${p.color}, ${p.opacity * 0.6})`,
            "--fp-drift": p.drift,
            "--fp-pulse": p.pulse,
            "--fp-delay": p.delay,
          }}
        />
      ))}
    </div>
  );
};

export default memo(FloatingParticles);
