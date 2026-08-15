import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export const AppLayout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div className="flex flex-1 relative">
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
