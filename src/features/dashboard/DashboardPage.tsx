import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useTaskStore } from "../../store/taskStore";
import { Button } from "../../components/ui/Button";

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { tasks } = useTaskStore();

  const activeTasks = tasks.filter((t) => t.status !== "done");
  const urgentTasks = tasks.filter(
    (t) => t.priority === "urgent" && t.status !== "done",
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-md">
        <h1 className="text-2xl sm:text-3xl font-black">
          Welcome back, {user?.firstName || "User"}! 👋
        </h1>
        <p className="mt-2 text-blue-100 text-sm sm:text-base max-w-xl">
          Here is your current sprint overview. You have{" "}
          <strong className="underline decoration-blue-300 font-semibold">
            {activeTasks.length} active tasks
          </strong>{" "}
          pending completion.
        </p>
        <div className="mt-4 flex gap-3">
          <Link to="/board">
            <Button variant="secondary" size="sm">
              Go to Sprint Board →
            </Button>
          </Link>
          <Link to="/analytics">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
          <span className="text-2xl">⚡</span>
          <h3 className="text-sm font-semibold text-slate-500 uppercase mt-2">
            Active Tasks
          </h3>
          <p className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {activeTasks.length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
          <span className="text-2xl">🔥</span>
          <h3 className="text-sm font-semibold text-slate-500 uppercase mt-2">
            Urgent Items
          </h3>
          <p className="text-3xl font-black text-red-500 mt-1">
            {urgentTasks.length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
          <span className="text-2xl">✅</span>
          <h3 className="text-sm font-semibold text-slate-500 uppercase mt-2">
            Completed
          </h3>
          <p className="text-3xl font-black text-emerald-500 mt-1">
            {tasks.filter((t) => t.status === "done").length}
          </p>
        </div>
      </div>
    </div>
  );
};
