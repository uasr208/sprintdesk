import React from "react";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 transition-colors duration-200 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle SVG */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
          aria-label="Toggle Navigation Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-500 tracking-wider">
          SprintDesk
        </span>
        <span className="hidden xs:inline-block px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full">
          Sprint 1
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeSwitcher />

        <div className="flex items-center gap-2 sm:gap-3">
          {user?.image && (
            <img
              src={user.image}
              alt={user.username}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-300 dark:border-slate-700"
            />
          )}
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.email}
            </p>
          </div>
        </div>

        <Button
          variant="danger"
          size="sm"
          onClick={logout}
          className="text-xs sm:text-sm px-2.5 py-1"
        >
          Log Out
        </Button>
      </div>
    </header>
  );
};
