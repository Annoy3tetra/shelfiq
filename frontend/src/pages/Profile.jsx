import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Shield, 
  Sliders, 
  Activity, 
  Lock, 
  Smartphone, 
  Laptop, 
  History, 
  Check, 
  BookOpen, 
  ShoppingCart, 
  Calendar,
  AlertCircle,
  Sun,
  Moon,
  Upload,
  ArrowRight
} from "lucide-react";

import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Avatar from "../components/ui/Avatar";
import ProfileImageUploaderModal from "../components/ui/ProfileImageUploaderModal";
import { cn } from "../utils/cn";

const activeSessionsData = [
  {
    id: 1,
    device: "Chrome on Windows 11",
    ip: "192.168.1.104",
    location: "Bangalore, India",
    current: true,
    time: "Active now"
  },
  {
    id: 2,
    device: "Safari on iPhone 15 Pro",
    ip: "103.45.22.98",
    location: "Mumbai, India",
    current: false,
    time: "2 hours ago"
  }
];

const loginHistoryData = [
  { id: 1, time: "July 15, 2026 08:32 PM", ip: "192.168.1.104", status: "Success", device: "Chrome / Windows" },
  { id: 2, time: "July 15, 2026 10:14 AM", ip: "192.168.1.104", status: "Success", device: "Chrome / Windows" },
  { id: 3, time: "July 14, 2026 09:45 PM", ip: "103.45.22.98", status: "Success", device: "Safari / iOS" },
  { id: 4, time: "July 14, 2026 02:22 PM", ip: "192.168.1.104", status: "Success", device: "Chrome / Windows" },
  { id: 5, time: "July 13, 2026 06:11 PM", ip: "192.168.1.104", status: "Success", device: "Chrome / Windows" }
];

const mockRecentActivity = [
  { id: 1, type: "book", message: "Added 12 new copies of 'Design Patterns' to Section C-3", time: "2 hours ago" },
  { id: 2, type: "sale", message: "Registered invoice #3928 for $240.00", time: "4 hours ago" },
  { id: 3, type: "book", message: "Updated stock quantity for 'Clean Architecture'", time: "Yesterday" },
  { id: 4, type: "sale", message: "Registered invoice #3921 for $78.50", time: "2 days ago" }
];

const Profile = () => {
  const { user, setUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "profile";
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Tab State
  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  // Personal Info Form State
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || "Sarah Jenkins",
    email: user?.email || "sarah.jenkins@shelfiq.com",
    role: user?.role || "admin",
    joinedDate: "January 12, 2026"
  });

  useEffect(() => {
    if (user) {
      setPersonalInfo(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        role: user.role
      }));
    }
  }, [user]);

  const [infoSaved, setInfoSaved] = useState(false);
  const handleSaveInfo = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: personalInfo.name,
      email: personalInfo.email
    }));
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 2000);
  };

  // Security Form State
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  const handleSavePassword = (e) => {
    e.preventDefault();
    setPwError("");
    if (!password.current || !password.new || !password.confirm) {
      setPwError("All password fields are required");
      return;
    }
    if (password.new !== password.confirm) {
      setPwError("New passwords do not match");
      return;
    }
    if (password.new.length < 5) {
      setPwError("New password must be at least 5 characters long");
      return;
    }

    setPwSaved(true);
    setPassword({ current: "", new: "", confirm: "" });
    setTimeout(() => setPwSaved(false), 2000);
  };

  // Preferences State
  const [notifications, setNotifications] = useState({
    lowStock: true,
    newSales: true,
    insightsAI: false,
    system: true
  });

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

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("theme-change", { detail: newTheme }));
  };

  const menuTabs = [
    { id: "profile", label: "Personal Information", icon: User },
    { id: "security", label: "Security & Logins", icon: Shield },
    { id: "preferences", label: "System Preferences", icon: Sliders },
    { id: "activity", label: "Activity Overview", icon: Activity }
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header banner */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-[0_16px_40px_rgba(15,23,42,0.02)]">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-blue-600/5 to-cyan-500/5 blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            {/* Big Avatar with Editable Overlay */}
            <div className="relative">
              <Avatar
                src={user?.profile_image_url}
                name={personalInfo.name}
                size="xl"
                editable
                onEditClick={() => setIsUploadModalOpen(true)}
              />
              <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-900 border-2 border-white dark:border-slate-900 shadow-sm text-emerald-500 z-20">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </span>
            </div>
            {/* Details */}
            <div className="text-center sm:text-left min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-slate-950 dark:text-slate-100 flex flex-col sm:flex-row items-center gap-3">
                {personalInfo.name}
                <span className={cn(
                  "text-xs font-bold py-0.5 px-2.5 rounded-full uppercase tracking-wide",
                  personalInfo.role === "admin"
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                )}>
                  {personalInfo.role}
                </span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{personalInfo.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar size={13} />
                  Joined {personalInfo.joinedDate}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                <span className="font-semibold text-emerald-500">Active Operator Session</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Tabs Menu */}
          <aside className="w-full lg:w-64 shrink-0 bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <nav className="space-y-1">
              {menuTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-slate-800/80 dark:text-blue-400"
                        : "text-slate-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40"
                    )}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Panel content */}
          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {/* 1. PERSONAL INFORMATION */}
                {currentTab === "profile" && (
                  <Card className="p-6 sm:p-8">
                    <form onSubmit={handleSaveInfo} className="space-y-6">
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Personal Details</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Edit your name and contact details here.</p>
                      </div>

                      {/* Photo Upload Container */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
                        <Avatar
                          src={user?.profile_image_url}
                          name={personalInfo.name}
                          size="lg"
                          editable
                          onEditClick={() => setIsUploadModalOpen(true)}
                        />
                        <div className="text-center sm:text-left">
                          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Avatar Photo</h4>
                          <p className="text-xs text-slate-400 mt-0.5 mb-2.5">PNG, JPG, or WEBP up to 5MB.</p>
                          <button
                            type="button"
                            onClick={() => setIsUploadModalOpen(true)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg border border-slate-200 text-slate-650 hover:bg-slate-55 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Upload size={12} />
                            Change photo
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                          <input
                            type="text"
                            required
                            value={personalInfo.name}
                            onChange={(e) => setPersonalInfo(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-950 text-slate-950 dark:text-slate-100 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
                          <input
                            type="email"
                            required
                            value={personalInfo.email}
                            onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-950 text-slate-950 dark:text-slate-100 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Operator Role</label>
                          <input
                            type="text"
                            disabled
                            value={personalInfo.role === "admin" ? "System Administrator" : "Store Staff"}
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none text-slate-500 cursor-not-allowed dark:bg-slate-850 dark:border-slate-800 dark:text-slate-500 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Joined Date</label>
                          <input
                            type="text"
                            disabled
                            value={personalInfo.joinedDate}
                            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none text-slate-500 cursor-not-allowed dark:bg-slate-850 dark:border-slate-800 dark:text-slate-500 font-semibold"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                        <button
                          type="submit"
                          disabled={infoSaved}
                          className="flex items-center gap-2 py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-600/10 hover:shadow-lg transition-all"
                        >
                          {infoSaved ? (
                            <>
                              <Check size={16} />
                              <span>Details Saved!</span>
                            </>
                          ) : (
                            <span>Save Profile Info</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </Card>
                )}

                {/* 2. SECURITY & LOGINS */}
                {currentTab === "security" && (
                  <div className="space-y-6">
                    {/* Password Form */}
                    <Card className="p-6 sm:p-8">
                      <form onSubmit={handleSavePassword} className="space-y-5">
                        <div>
                          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Update Account Password</h2>
                          <p className="text-xs text-slate-500 mt-0.5">Ensure your account is protected with a long, complex password.</p>
                        </div>

                        {pwError && (
                          <div className="p-3.5 bg-red-50 border border-red-100 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                            <AlertCircle size={16} className="text-red-600 shrink-0" />
                            <span>{pwError}</span>
                          </div>
                        )}

                        {pwSaved && (
                          <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                            <Check size={16} className="text-emerald-600 shrink-0" />
                            <span>Password updated successfully!</span>
                          </div>
                        )}

                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Current Password</label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              value={password.current}
                              onChange={(e) => setPassword(prev => ({ ...prev, current: e.target.value }))}
                              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-950 text-slate-950 dark:text-slate-100"
                            />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">New Password</label>
                              <input
                                type="password"
                                placeholder="••••••••"
                                value={password.new}
                                onChange={(e) => setPassword(prev => ({ ...prev, new: e.target.value }))}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-950 text-slate-950 dark:text-slate-100"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                              <input
                                type="password"
                                placeholder="••••••••"
                                value={password.confirm}
                                onChange={(e) => setPassword(prev => ({ ...prev, confirm: e.target.value }))}
                                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-950 text-slate-950 dark:text-slate-100"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="submit"
                            className="flex items-center gap-2 py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all"
                          >
                            Update Password
                          </button>
                        </div>
                      </form>
                    </Card>

                    {/* Active Sessions */}
                    <Card className="p-6 sm:p-8">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Active Login Sessions</h3>
                      <p className="text-xs text-slate-400 mb-5">You are currently logged into these browser instances.</p>

                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {activeSessionsData.map((session) => (
                          <div key={session.id} className="flex gap-4 py-4 first:pt-0 last:pb-0 items-start">
                            <div className="h-10 w-10 bg-slate-50 border border-slate-200/60 dark:bg-slate-850 dark:border-slate-800 flex items-center justify-center rounded-xl text-slate-550 shrink-0">
                              {session.device.includes("Chrome") ? <Laptop size={18} /> : <Smartphone size={18} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-slate-850 dark:text-slate-200 flex items-center gap-2">
                                {session.device}
                                {session.current && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-450 border border-emerald-100 dark:border-transparent">
                                    Current Session
                                  </span>
                                )}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">{session.location} &bull; {session.ip}</p>
                            </div>
                            <span className="text-xs text-slate-400 font-medium shrink-0">{session.time}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Login History */}
                    <Card className="p-6 sm:p-8">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-1">
                        <History size={17} className="text-slate-400" />
                        Authentication History Log
                      </h3>
                      <p className="text-xs text-slate-400 mb-5">Audit log of the last 5 successful login actions.</p>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                              <th className="py-2.5">Date & Time</th>
                              <th className="py-2.5">IP Address</th>
                              <th className="py-2.5">Device / Agent</th>
                              <th className="py-2.5 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                            {loginHistoryData.map((log) => (
                              <tr key={log.id} className="text-slate-650 dark:text-slate-350 text-xs">
                                <td className="py-3 font-medium text-slate-850 dark:text-slate-200">{log.time}</td>
                                <td className="py-3">{log.ip}</td>
                                <td className="py-3">{log.device}</td>
                                <td className="py-3 text-right">
                                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    {log.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </div>
                )}

                {/* 3. SYSTEM PREFERENCES */}
                {currentTab === "preferences" && (
                  <div className="space-y-6">
                    {/* Theme Preferences */}
                    <Card className="p-6 sm:p-8">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Appearance Settings</h3>
                      <p className="text-xs text-slate-400 mb-5">Select a default theme preference for your dashboard operations.</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handleThemeChange("light")}
                          className={cn(
                            "flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
                            theme === "light"
                              ? "border-blue-500 bg-blue-50/20 text-blue-600 ring-2 ring-blue-500/10 dark:border-blue-500/60"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 dark:text-slate-400"
                          )}
                        >
                          <div className={cn("h-10 w-10 flex items-center justify-center rounded-lg border", theme === "light" ? "bg-white text-blue-500 border-blue-200" : "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700")}>
                            <Sun size={18} />
                          </div>
                          <div>
                            <span className="font-bold text-sm block">Light Theme</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">Classic bright workspace colors.</span>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleThemeChange("dark")}
                          className={cn(
                            "flex items-center gap-4 rounded-xl border p-4 text-left transition-all",
                            theme === "dark"
                              ? "border-blue-500 bg-slate-850/50 text-blue-400 ring-2 ring-blue-500/10 dark:border-blue-500/60"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 dark:text-slate-400"
                          )}
                        >
                          <div className={cn("h-10 w-10 flex items-center justify-center rounded-lg border", theme === "dark" ? "bg-slate-900 text-blue-400 border-slate-700" : "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700")}>
                            <Moon size={18} />
                          </div>
                          <div>
                            <span className="font-bold text-sm block">Dark Theme</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">Immersive dim environment layout.</span>
                          </div>
                        </button>
                      </div>
                    </Card>

                    {/* Notification Preferences */}
                    <Card className="p-6 sm:p-8">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Notification Preferences</h3>
                      <p className="text-xs text-slate-400 mb-6">Choose how and when you receive operational alerts.</p>

                      <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.lowStock}
                            onChange={(e) => setNotifications(prev => ({ ...prev, lowStock: e.target.checked }))}
                            className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                          />
                          <div>
                            <span className="text-sm font-bold text-slate-850 dark:text-slate-200 block">Low Stock Alerts</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">Receive instant navbar notifications when items drop below threshold configurations.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.newSales}
                            onChange={(e) => setNotifications(prev => ({ ...prev, newSales: e.target.checked }))}
                            className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                          />
                          <div>
                            <span className="text-sm font-bold text-slate-850 dark:text-slate-200 block">New Invoice Alerts</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">Get notified when store checkouts compile invoices and sales records successfully.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.insightsAI}
                            onChange={(e) => setNotifications(prev => ({ ...prev, insightsAI: e.target.checked }))}
                            className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                          />
                          <div>
                            <span className="text-sm font-bold text-slate-850 dark:text-slate-200 block">Insights AI & Demand Forecasting</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">Receive notifications summarizing ML reorder predictions and demand trends.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.system}
                            onChange={(e) => setNotifications(prev => ({ ...prev, system: e.target.checked }))}
                            className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                          />
                          <div>
                            <span className="text-sm font-bold text-slate-850 dark:text-slate-200 block">System Updates</span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">Receive reports for automated system backups and platform upgrades.</span>
                          </div>
                        </label>
                      </div>
                    </Card>
                  </div>
                )}

                {/* 4. ACTIVITY OVERVIEW */}
                {currentTab === "activity" && (
                  <div className="space-y-6">
                    {/* Activity Stats Grid */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Card className="p-5 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/40 flex items-center justify-center text-blue-600 shrink-0">
                          <BookOpen size={18} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Books Added</span>
                          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">142</span>
                        </div>
                      </Card>

                      <Card className="p-5 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 shrink-0">
                          <ShoppingCart size={18} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sales Created</span>
                          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">582</span>
                        </div>
                      </Card>

                      <Card className="p-5 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 shrink-0">
                          <Activity size={18} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Login</span>
                          <span className="text-sm font-semibold text-slate-850 dark:text-slate-200 block truncate">Today, 10:45 AM</span>
                        </div>
                      </Card>
                    </div>

                    {/* Timeline Activity */}
                    <Card className="p-6 sm:p-8">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-5">Recent Operation Timeline</h3>
                      
                      <div className="relative border-l border-slate-100 dark:border-slate-800 pl-5 ml-2.5 space-y-6">
                        {mockRecentActivity.map((activity) => (
                          <div key={activity.id} className="relative">
                            {/* Dot Icon marker */}
                            <span className={cn(
                              "absolute -left-[27.5px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900",
                              activity.type === "book" ? "bg-blue-500" : "bg-emerald-500"
                            )} />
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {activity.message}
                              </p>
                              <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">{activity.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ProfileImageUploaderModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </Layout>
  );
};

export default Profile;
