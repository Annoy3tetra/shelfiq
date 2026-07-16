import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

import { motionPresets } from "../../../constants/theme";

/**
 * Animated logout button that matches the nav item entry animation
 * and has its own hover micro-interaction (icon rotation + red tint).
 */
const AnimatedLogoutButton = ({ onClick }) => {
  return (
    <motion.div variants={motionPresets.sidebar.item}>
      <motion.button
        onClick={onClick}
        className="group relative flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-red-300"
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
      >
        {/* Hover background */}
        <div className="absolute inset-0 rounded-lg bg-red-500/0 transition-all duration-200 group-hover:bg-red-500/[0.08]" />

        {/* Icon with rotation on hover */}
        <motion.span
          className="relative z-10 flex shrink-0 items-center justify-center"
          whileHover={{
            rotate: -12,
            transition: { type: "spring", stiffness: 400, damping: 15 },
          }}
        >
          <LogOut size={20} />
        </motion.span>

        <span className="relative z-10">Logout</span>
      </motion.button>
    </motion.div>
  );
};

export default AnimatedLogoutButton;
