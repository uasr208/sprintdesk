import React from "react";
import { NavLink } from "react-router-dom";

export const Sidebar: React.FC = () => {
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/board", label: "Kanban Board", icon: "📋" },
    { to: "/analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)] p-4 flex flex-col gap-2 transition-colors duration-200">
      <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
        Menu
      </div>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
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
  );
};
