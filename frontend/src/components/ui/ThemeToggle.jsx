import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const getInitialTheme = () => {
  const stored = localStorage.getItem("theme");

  if (stored === "dark" || stored === "light") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
  }, [isDark, theme]);

  useEffect(() => {
    const handleThemeChange = (e) => {
      const updatedTheme = e.detail || localStorage.getItem("theme") || "light";
      setTheme(updatedTheme);
    };

    window.addEventListener("theme-change", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);

    return () => {
      window.removeEventListener("theme-change", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </motion.button>
  );
};

export default ThemeToggle;
