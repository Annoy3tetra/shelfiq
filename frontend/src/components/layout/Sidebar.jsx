import { Link } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  BarChart3,
  Book,
  Brain,
  LayoutDashboard,
  PanelLeftClose,
  ShoppingCart,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { motionPresets } from "../../constants/theme";
import { ShelfIQLogo } from "../ui/Logo";
import SidebarBackground from "../ui/sidebar/SidebarBackground";
import AnimatedNavItem from "../ui/sidebar/AnimatedNavItem";
import AnimatedLogoutButton from "../ui/sidebar/AnimatedLogoutButton";

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

const Sidebar = ({ isOpen = false, onClose }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const sidebarContent = (
    <div className="relative flex h-full flex-col bg-[#0F172A] px-4 py-5 text-white overflow-hidden">
      {/* Animated atmospheric background */}
      <SidebarBackground />

      {/* Logo with entry animation */}
      <motion.div
        className="relative z-10 mb-8 flex items-center justify-between"
        {...motionPresets.sidebar.logo}
      >
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
      </motion.div>

      {/* Navigation items with staggered entry + sliding active indicator */}
      <LayoutGroup>
        <motion.nav
          className="relative z-10 flex flex-1 flex-col gap-1"
          initial="initial"
          animate="animate"
          variants={motionPresets.sidebar.container}
        >
          {links.map((link) => (
            <AnimatedNavItem
              key={link.path}
              link={link}
              onNavigate={onClose}
            />
          ))}
        </motion.nav>
      </LayoutGroup>

      {/* Logout button with matching entry animation */}
      <motion.div
        className="relative z-10"
        initial="initial"
        animate="animate"
        variants={motionPresets.sidebar.container}
      >
        <AnimatedLogoutButton onClick={handleLogout} />
      </motion.div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile drawer — slide in/out with spring physics */}
      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.button
              type="button"
              {...motionPresets.sidebar.overlay}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-[2px] lg:hidden"
              aria-label="Close navigation overlay"
            />
            <motion.aside
              {...motionPresets.sidebar.mobileDrawer}
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
