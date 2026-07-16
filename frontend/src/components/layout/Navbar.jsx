import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

import NotificationButton from "../ui/NotificationButton";
import SearchBar from "../ui/SearchBar";
import ThemeToggle from "../ui/ThemeToggle";
import UserMenu from "../ui/UserMenu";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/books": "Books",
  "/sales": "Sales",
  "/insights-ai": "Insights AI",
};

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "Workspace";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#F8FAFC]/95 px-4 py-3 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/90 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open sidebar"
          title="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            ShelfIQ Console
          </p>
          <h1 className="truncate text-xl font-semibold text-slate-950">
            {title}
          </h1>
        </div>

        <SearchBar className="ml-auto hidden max-w-md md:flex" />

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <ThemeToggle />
          <NotificationButton />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
