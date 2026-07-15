import { motion } from "framer-motion";

import { cn } from "../../utils/cn";

const Card = ({ children, className = "", hover = false }) => {
  const Component = hover ? motion.section : "section";

  return (
    <Component
      whileHover={hover ? { y: -2 } : undefined}
      transition={hover ? { duration: 0.16, ease: "easeOut" } : undefined}
      className={cn(
        "rounded-lg border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-colors dark:border-slate-800 dark:bg-slate-900",
        className
      )}
    >
      {children}
    </Component>
  );
};

export default Card;
