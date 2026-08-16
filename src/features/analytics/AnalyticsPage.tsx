import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useTaskStore } from "../../store/taskStore";
import { type TaskStatus, type TaskPriority } from "../../types/task";

const STATUS_COLORS: Record<TaskStatus, string> = {
  backlog: "#64748b",
  in_progress: "#3b82f6",
  review: "#f59e0b",
  done: "#10b981",
};

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "#94a3b8",
  medium: "#3b82f6",
  high: "#f59e0b",
  urgent: "#ef4444",
};

export const AnalyticsPage: React.FC = () => {
  const { tasks } = useTaskStore();

  // Metric 1: Key Performance Indicators
  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "done").length;
    const urgent = tasks.filter(
      (t) => t.priority === "urgent" && t.status !== "done",
    ).length;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, urgent, completionRate };
  }, [tasks]);

  // Metric 2: Status Distribution Chart Data
  const statusData = useMemo(() => {
    const counts: Record<TaskStatus, number> = {
      backlog: 0,
      in_progress: 0,
      review: 0,
      done: 0,
    };

    tasks.forEach((task) => {
      if (counts[task.status] !== undefined) {
        counts[task.status]++;
      }
    });

    return [
      { name: "Backlog", value: counts.backlog, color: STATUS_COLORS.backlog },
      {
        name: "In Progress",
        value: counts.in_progress,
        color: STATUS_COLORS.in_progress,
      },
      { name: "In Review", value: counts.review, color: STATUS_COLORS.review },
      { name: "Completed", value: counts.done, color: STATUS_COLORS.done },
    ];
  }, [tasks]);

  // Metric 3: Priority Breakdown Chart Data
  const priorityData = useMemo(() => {
    const counts: Record<TaskPriority, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };

    tasks.forEach((task) => {
      if (counts[task.priority] !== undefined) {
        counts[task.priority]++;
      }
    });

    return [
      { priority: "Low", count: counts.low, fill: PRIORITY_COLORS.low },
      {
        priority: "Medium",
        count: counts.medium,
        fill: PRIORITY_COLORS.medium,
      },
      { priority: "High", count: counts.high, fill: PRIORITY_COLORS.high },
      {
        priority: "Urgent",
        count: counts.urgent,
        fill: PRIORITY_COLORS.urgent,
      },
    ];
  }, [tasks]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          Sprint Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Real-time insights and metrics derived directly from your live task
          board
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Tasks
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {metrics.total}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Completion Rate
          </p>
          <p className="text-2xl font-black text-emerald-500 mt-1">
            {metrics.completionRate}%
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Completed Tasks
          </p>
          <p className="text-2xl font-black text-blue-500 mt-1">
            {metrics.completed}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Urgent Active Tasks
          </p>
          <p className="text-2xl font-black text-red-500 mt-1">
            {metrics.urgent}
          </p>
        </div>
      </div>

      {/* Charts Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Donut Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
            Task Status Distribution
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.5rem",
                    color: "#f8fafc",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
            Priority Breakdown
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis dataKey="priority" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "0.5rem",
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
