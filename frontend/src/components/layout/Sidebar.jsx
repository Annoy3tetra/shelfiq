import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Book,
  Brain,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  ShoppingCart,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";
import { ShelfIQLogo } from "../ui/Logo";

const Sidebar = ({ isOpen = false, onClose }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const links = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Books",
      path: "/books",
      icon: <Book size={20} />,
    },
    {
      label: "Sales",
      path: "/sales",
      icon: <ShoppingCart size={20} />,
    },
    {
      label: "Forecast",
      path: "/forecast",
      icon: <Brain size={20} />,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#0F172A] px-4 py-5 text-white">
      <div className="mb-8 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center" onClick={onClose}>
          <ShelfIQLogo showText={true} />
        </Link>

        <button
          type="button"
          onClick={onClose}
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {links.map((link) => (
          <motion.div
            key={link.path}
            whileHover={{ x: 2 }}
            transition={{ duration: 0.14 }}
          >
            <Link
              to={link.path}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition",
                location.pathname === link.path
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          </motion.div>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-200"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 lg:block">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
              aria-label="Close navigation overlay"
            />
            <motion.aside
              initial={{ x: -288 }}
              animate={{ x: 0 }}
              exit={{ x: -288 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
