import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { 
  ChevronDown, 
  LogOut, 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Moon, 
  Sun,
  Laptop
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { motionPresets } from "../../constants/theme";
import SettingsModal from "./SettingsModal";
import Avatar from "./Avatar";
import { cn } from "../../utils/cn";

const UserMenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { logout, user } = useAuth();
  const dropdownRef = useRef(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const name = user?.name || "Sarah Jenkins";
  const email = user?.email || "sarah.jenkins@shelfiq.com";
  const role = user?.role || "admin";

  // Check current theme
  const [theme, setTheme] = useState(() => {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  useEffect(() => {
    const syncTheme = () => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };
    window.addEventListener("theme-change", syncTheme);
    window.addEventListener("storage", syncTheme);
    return () => {
      window.removeEventListener("theme-change", syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("theme-change", { detail: nextTheme }));
  };

  return (
    <div ref={dropdownRef} className="relative">
      <motion.button
        type="button"
        whileHover={{ y: -1 }}
        transition={{ duration: 0.15 }}
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 items-center gap-3.5 rounded-full border border-slate-200 bg-white pl-2 pr-4 shadow-sm transition hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:border-slate-700 text-left"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar
          src={user?.profile_image_url}
          name={name}
          size="sm"
          showOnlineIndicator
        />

        <div className="hidden leading-tight lg:block">
          <span className="block text-sm font-semibold text-slate-850 dark:text-slate-100">
            {name}
          </span>
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            {role}
          </span>
        </div>
        <ChevronDown size={14} className="text-slate-400" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            {...motionPresets.dropdown}
            className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900"
            role="menu"
          >
            {/* Header info card */}
            <div className="px-3.5 py-3 border-b border-slate-100 dark:border-slate-800/80 mb-1">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user?.profile_image_url}
                  name={name}
                  size="md"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {email}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide",
                  role === "admin" 
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-450" 
                    : "bg-slate-100 text-slate-700 dark:bg-slate-850 dark:text-slate-300"
                )}>
                  {role} Badge
                </span>
                <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Online
                </span>
              </div>
            </div>

            {/* View Profile */}
            <Link 
              to="/profile" 
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800/60 transition-colors" 
              role="menuitem"
            >
              <User size={15} className="text-slate-400" />
              <span>View Profile</span>
            </Link>

            {/* Edit Profile (Quick Link) */}
            <Link 
              to="/profile?tab=profile" 
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800/60 transition-colors" 
              role="menuitem"
            >
              <Settings size={15} className="text-slate-400" />
              <span>Edit Profile</span>
            </Link>

            {/* Security Settings */}
            <Link 
              to="/profile?tab=security" 
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800/60 transition-colors" 
              role="menuitem"
            >
              <Shield size={15} className="text-slate-400" />
              <span>Security Settings</span>
            </Link>

            {/* Preferences */}
            <Link 
              to="/profile?tab=preferences" 
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800/60 transition-colors" 
              role="menuitem"
            >
              <Bell size={15} className="text-slate-400" />
              <span>Notification Settings</span>
            </Link>

            {/* Inline Theme Preferences Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800/60 transition-colors"
              role="menuitem"
            >
              <div className="flex items-center gap-3.5">
                {theme === "dark" ? <Sun size={15} className="text-slate-400" /> : <Moon size={15} className="text-slate-400" />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-105 dark:bg-slate-800 text-slate-400 rounded">
                Toggle
              </span>
            </button>

            <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800/80" />

            {/* Open Settings Modal */}
            <button
              type="button"
              onClick={() => { setOpen(false); setShowSettings(true); }}
              className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800/60 transition-colors"
              role="menuitem"
            >
              <Laptop size={15} className="text-slate-400" />
              <span>System Settings Modal</span>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors mt-0.5"
              role="menuitem"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default UserMenu;
