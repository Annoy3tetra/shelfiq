import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import { cn } from "../../../utils/cn";
import { motionPresets } from "../../../constants/theme";

/**
 * Animated sidebar navigation item with:
 * - Staggered entry animation (controlled by parent's staggerChildren)
 * - Sliding active indicator via Framer Motion layoutId
 * - Hover: subtle scale, glow, background transition
 * - Icon micro-interactions: rotation + bounce on hover
 */
const AnimatedNavItem = ({ link, onNavigate }) => {
  const location = useLocation();
  const isActive = location.pathname === link.path;

  return (
    <motion.div
      variants={motionPresets.sidebar.item}
      className="relative"
    >
      <Link
        to={link.path}
        onClick={onNavigate}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium",
          "transition-colors duration-200",
          isActive
            ? "text-white"
            : "text-slate-400 hover:text-white"
        )}
      >
        {/* Active indicator — slides between items via layoutId */}
        {isActive && (
          <motion.div
            layoutId="sidebar-active-indicator"
            className="absolute inset-0 rounded-lg bg-white/[0.08]"
            style={{
              boxShadow:
                "0 0 0 1px rgba(255, 255, 255, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.04)",
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30,
            }}
          />
        )}

        {/* Hover background — separate from active for clean layering */}
        {!isActive && (
          <div className="absolute inset-0 rounded-lg bg-white/0 transition-all duration-200 group-hover:bg-white/[0.05] group-hover:shadow-[0_0_12px_rgba(59,130,246,0.06)]" />
        )}

        {/* Icon with micro-interactions */}
        <motion.span
          className="relative z-10 flex shrink-0 items-center justify-center"
          whileHover={{
            rotate: [0, -6, 4, 0],
            y: [0, -1, 0],
            transition: {
              duration: 0.4,
              ease: "easeInOut",
            },
          }}
        >
          {link.icon}
        </motion.span>

        {/* Label */}
        <span className="relative z-10">{link.label}</span>

        {/* Active glow accent on the left edge */}
        {isActive && (
          <motion.div
            layoutId="sidebar-active-glow"
            className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-400"
            style={{
              boxShadow: "0 0 8px rgba(59, 130, 246, 0.4)",
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30,
            }}
          />
        )}
      </Link>
    </motion.div>
  );
};

export default AnimatedNavItem;
