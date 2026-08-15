import React from "react";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";
import { ThemeSwitcher } from "./ThemeSwitcher";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <span className="text-xl font-black text-blue-600 dark:text-blue-500 tracking-wider">
          SprintDesk
        </span>
        <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full">
          Sprint 1
        </span>
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />

        <div className="flex items-center gap-3">
          {user?.image && (
            <img
              src={user.image}
              alt={user.username}
              className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700"
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

        <Button variant="danger" size="sm" onClick={logout}>
          Log Out
        </Button>
      </div>
    </header>
  );
};
