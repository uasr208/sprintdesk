import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/board", label: "Kanban Board", icon: "📋" },
    { to: "/analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-20 md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:static top-16 left-0 bottom-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-2 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } min-h-[calc(100vh-4rem)]`}
      >
        <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
          <span>Menu</span>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden text-slate-400 hover:text-slate-200 text-lg leading-none"
              aria-label="Close menu"
            >
              ✕
            </button>
          )}
        </div>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </aside>
    </>
  );
};
