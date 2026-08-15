import React, { useEffect, useState } from "react";

export const ThemeSwitcher: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return (
      localStorage.getItem("sprintdesk_theme") === "dark" ||
      (!("sprintdesk_theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("sprintdesk_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("sprintdesk_theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle Theme"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
};
