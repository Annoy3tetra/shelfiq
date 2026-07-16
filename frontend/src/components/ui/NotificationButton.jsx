import { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Info, 
  Trash2, 
  Check, 
  BellOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

const initialNotifications = [
  {
    id: 1,
    category: "low-stock",
    title: "Low Stock Warning",
    message: "'Clean Code' (ISBN-13: 9780132350884) has only 2 copies left in Rack B-4.",
    time: "10m ago",
    read: false,
  },
  {
    id: 2,
    category: "new-sales",
    title: "New Sale Registered",
    message: "Invoice #3482 created successfully. Total amount: $124.50.",
    time: "35m ago",
    read: false,
  },
  {
    id: 3,
    category: "insights-ai",
    title: "Insights AI Update",
    message: "Sci-Fi demand predicted to spike 30% next week. Restock recommended.",
    time: "2h ago",
    read: false,
  },
  {
    id: 4,
    category: "system",
    title: "System Backup Success",
    message: "Database backup size: 142MB. Operations fully stored without errors.",
    time: "6h ago",
    read: true,
  },
];

const categoryConfig = {
  "low-stock": {
    Icon: AlertTriangle,
    bgColor: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400",
    borderColor: "border-amber-100 dark:border-amber-900/40",
  },
  "new-sales": {
    Icon: CheckCircle2,
    bgColor: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400",
    borderColor: "border-emerald-100 dark:border-emerald-900/40",
  },
  "insights-ai": {
    Icon: TrendingUp,
    bgColor: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400",
    borderColor: "border-indigo-100 dark:border-indigo-900/40",
  },
  "system": {
    Icon: Info,
    bgColor: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
    borderColor: "border-blue-100 dark:border-blue-900/40",
  },
};

const NotificationButton = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleDismiss = (id, e) => {
    e.stopPropagation(); // Avoid triggering dropdown item click toggle
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <motion.button
        type="button"
        whileHover={{ y: -1 }}
        transition={{ duration: 0.15 }}
        onClick={() => setOpen((prev) => !prev)}
        className="relative grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        aria-label="Notifications"
        title="Notifications"
        aria-expanded={open}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-2.5 top-2.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 border-2 border-white dark:border-slate-900" />
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 z-50 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 pt-1.5 px-2.5 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold py-0.5 px-2 bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h3>
              </div>
              
              {notifications.length > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:text-slate-400 dark:text-blue-400 dark:hover:text-blue-300 dark:disabled:text-slate-600 transition-colors"
                  >
                    Mark all read
                  </button>
                  <span className="h-3 w-px bg-slate-200 dark:bg-slate-800" />
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-xs font-semibold text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* List */}
            <div className="max-h-[360px] overflow-y-auto py-1.5 space-y-1">
              {notifications.length > 0 ? (
                notifications.map((n) => {
                  const { Icon, bgColor, borderColor } = categoryConfig[n.category] || categoryConfig["system"];
                  
                  return (
                    <motion.div
                      layout
                      key={n.id}
                      onClick={() => handleToggleRead(n.id)}
                      className={cn(
                        "group relative flex gap-3.5 rounded-xl p-3 border text-left cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50",
                        n.read 
                          ? "border-transparent bg-white dark:bg-slate-900 opacity-70" 
                          : "border-slate-100 bg-blue-50/20 dark:bg-slate-850/20 dark:border-slate-800/50"
                      )}
                    >
                      {/* Icon */}
                      <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border", bgColor, borderColor)}>
                        <Icon size={16} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={cn(
                            "text-sm font-bold truncate",
                            n.read ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-slate-100"
                          )}>
                            {n.title}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap ml-2">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                          {n.message}
                        </p>
                      </div>

                      {/* Hover Dismiss Button */}
                      <button
                        type="button"
                        onClick={(e) => handleDismiss(n.id, e)}
                        className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-350 transition-all"
                        title="Dismiss"
                      >
                        <Trash2 size={13} />
                      </button>

                      {/* Unread circle marker if hovered/visible */}
                      {!n.read && (
                        <div className="absolute right-3.5 bottom-3.5 h-1.5 w-1.5 rounded-full bg-blue-500 group-hover:opacity-0 transition-opacity" />
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                  <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-850 flex items-center justify-center text-slate-400 dark:text-slate-600 mb-3 border border-slate-100 dark:border-slate-800/40">
                    <BellOff size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1">All caught up!</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-500 max-w-[200px]">No notifications to show at this time.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationButton;
