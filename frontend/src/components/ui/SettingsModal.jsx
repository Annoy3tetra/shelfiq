import { useState, useEffect } from "react";
import { 
  User, 
  Settings, 
  Sliders, 
  LogOut, 
  Sun, 
  Moon, 
  Check, 
  Shield, 
  KeyRound,
  FileText
} from "lucide-react";
import Modal from "./Modal";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

const SettingsModal = ({ open, onClose }) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // Profile State
  const [profile, setProfile] = useState({
    name: "Sarah Jenkins",
    email: "sarah.jenkins@shelfiq.com",
    role: "Store Operations Manager",
    avatar: "SJ"
  });

  // ERP Preferences State
  const [preferences, setPreferences] = useState({
    lowStockThreshold: 10,
    currency: "USD",
    enableAI: true,
    autoBackup: true,
    backupInterval: "daily"
  });

  // Password State
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [theme, setTheme] = useState(() => {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  const [isSaved, setIsSaved] = useState(false);

  // Sync theme when settings open
  useEffect(() => {
    if (open) {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
      setIsSaved(false);
    }
  }, [open]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
    
    // Dispatch events to keep other theme toggle buttons synchronized
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("theme-change", { detail: newTheme }));
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const tabs = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "account", label: "Account & Theme", icon: Shield },
    { id: "preferences", label: "ERP Preferences", icon: Sliders },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="System Settings"
      description="Manage your ShelfIQ operator account and system preferences."
      width="max-w-3xl"
    >
      <div className="flex flex-col md:flex-row gap-6 min-h-[400px]">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-56 shrink-0 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-4 md:pb-0 md:pr-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400"
                      : "text-slate-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/40"
                  )}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-650 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 mt-4 md:mt-0 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out Operator</span>
          </button>
        </aside>

        {/* Tab Content Panel */}
        <form onSubmit={handleSave} className="flex-1 flex flex-col justify-between">
          <div className="space-y-6">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Personal Information</h3>
                
                {/* Profile Pic Upload */}
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/10">
                    {profile.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Sarah Jenkins</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Store Operations Manager</p>
                    <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      Upload new avatar
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-950 text-slate-950 dark:text-slate-100 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-950 text-slate-950 dark:text-slate-100 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Operator Role</label>
                    <select
                      value={profile.role}
                      onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-950 text-slate-950 dark:text-slate-100 font-medium cursor-pointer"
                    >
                      <option className="dark:bg-slate-900">Store Operations Manager</option>
                      <option className="dark:bg-slate-900">System Administrator</option>
                      <option className="dark:bg-slate-900">Inventory Specialist</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ACCOUNT TAB */}
            {activeTab === "account" && (
              <div className="space-y-5">
                {/* Theme Selector */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3.5">Appearance Settings</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleThemeChange("light")}
                      className={cn(
                        "flex items-center justify-center gap-2.5 rounded-xl border p-3.5 text-sm font-semibold transition-all",
                        theme === "light"
                          ? "border-blue-500 bg-blue-50/30 text-blue-600 ring-2 ring-blue-500/10 dark:border-blue-500/60"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850"
                      )}
                    >
                      <Sun size={16} />
                      <span>Light Theme</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleThemeChange("dark")}
                      className={cn(
                        "flex items-center justify-center gap-2.5 rounded-xl border p-3.5 text-sm font-semibold transition-all",
                        theme === "dark"
                          ? "border-blue-500 bg-slate-800/40 text-blue-400 ring-2 ring-blue-500/10 dark:border-blue-500/60"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850"
                      )}
                    >
                      <Moon size={16} />
                      <span>Dark Theme</span>
                    </button>
                  </div>
                </div>

                {/* Password Change */}
                <div className="space-y-3.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <KeyRound size={16} className="text-slate-400" />
                    Change Password
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Current Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password.current}
                        onChange={(e) => setPassword(prev => ({ ...prev, current: e.target.value }))}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-950 text-slate-950 dark:text-slate-100"
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={password.new}
                          onChange={(e) => setPassword(prev => ({ ...prev, new: e.target.value }))}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-950 text-slate-950 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Confirm New Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={password.confirm}
                          onChange={(e) => setPassword(prev => ({ ...prev, confirm: e.target.value }))}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-950 text-slate-950 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ERP PREFERENCES TAB */}
            {activeTab === "preferences" && (
              <div className="space-y-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Operational Preferences</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Low Stock Alert Threshold</label>
                    <input
                      type="number"
                      value={preferences.lowStockThreshold}
                      onChange={(e) => setPreferences(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-950 text-slate-950 dark:text-slate-100 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Primary Currency Symbol</label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:focus:bg-slate-950 text-slate-950 dark:text-slate-100 font-medium cursor-pointer"
                    >
                      <option value="USD">USD ($) United States Dollar</option>
                      <option value="EUR">EUR (€) Euro</option>
                      <option value="GBP">GBP (£) British Pound</option>
                      <option value="INR">INR (₹) Indian Rupee</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Intelligence & Backups</h4>
                  
                  {/* AI Predictions Toggle */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.enableAI}
                      onChange={(e) => setPreferences(prev => ({ ...prev, enableAI: e.target.checked }))}
                      className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">Enable AI Demand Forecasting</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">Allow machine learning algorithms to compute seasonal demands for inventories.</span>
                    </div>
                  </label>

                  {/* Auto Backup Toggle */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.autoBackup}
                      onChange={(e) => setPreferences(prev => ({ ...prev, autoBackup: e.target.checked }))}
                      className="h-4 w-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">Automated Database Backups</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">Store compressed system database backups daily in secure cloud directories.</span>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-650 hover:bg-slate-50 rounded-xl dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaved}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 rounded-xl shadow-md shadow-blue-600/10 hover:shadow-lg transition-all"
            >
              {isSaved ? (
                <>
                  <Check size={16} />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default SettingsModal;
