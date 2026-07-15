import { useState } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import PageTransition from "../ui/PageTransition";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-72">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
};

export default Layout;
