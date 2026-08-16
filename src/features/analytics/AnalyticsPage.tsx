import React, { useState, useMemo, useRef } from "react";
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
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { toPng } from "html-to-image";
import { useTaskStore } from "../../store/taskStore";
import { type TaskStatus, type TaskPriority } from "../../types/task";
import { Button } from "../../components/ui/Button";

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
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Filter States
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Date Range Filtering Logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const taskDate = (task as any).createdAt
        ? new Date((task as any).createdAt)
        : null;
      if (!taskDate) return true;

      if (startDate && taskDate < new Date(startDate)) return false;
      if (endDate && taskDate > new Date(endDate)) return false;

      return true;
    });
  }, [tasks, startDate, endDate]);

  // Metric 1: KPI Summary
  const metrics = useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter((t) => t.status === "done").length;
    const urgent = filteredTasks.filter(
      (t) => t.priority === "urgent" && t.status !== "done",
    ).length;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, urgent, completionRate };
  }, [filteredTasks]);

  // Metric 2: Task Status Distribution (Donut Chart)
  const statusData = useMemo(() => {
    const counts: Record<TaskStatus, number> = {
      backlog: 0,
      in_progress: 0,
      review: 0,
      done: 0,
    };

    filteredTasks.forEach((task) => {
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
  }, [filteredTasks]);

  // Metric 3: Priority Breakdown (Bar Chart)
  const priorityData = useMemo(() => {
    const counts: Record<TaskPriority, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };

    filteredTasks.forEach((task) => {
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
  }, [filteredTasks]);

  // Metric 4: Sprint Velocity Chart Data
  const velocityData = useMemo(() => {
    const columns = [
      { key: "backlog", name: "Backlog" },
      { key: "in_progress", name: "In Progress" },
      { key: "review", name: "Review" },
      { key: "done", name: "Completed" },
    ];

    return columns.map((col) => {
      const colTasks = filteredTasks.filter((t) => t.status === col.key);
      const points = colTasks.reduce(
        (acc, t) => acc + ((t as any).storyPoints || 1),
        0,
      );
      return {
        stage: col.name,
        tasksCount: colTasks.length,
        points,
      };
    });
  }, [filteredTasks]);

  // Metric 5: Task Completion Trend over time (Line Chart)
  const completionTrendData = useMemo(() => {
    const datesMap: Record<string, number> = {};

    filteredTasks
      .filter((t) => t.status === "done")
      .forEach((t) => {
        const dateStr = (t as any).updatedAt
          ? new Date((t as any).updatedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })
          : "Recent";
        datesMap[dateStr] = (datesMap[dateStr] || 0) + 1;
      });

    const entries = Object.entries(datesMap).map(([date, completed]) => ({
      date,
      completed,
    }));
    return entries.length > 0
      ? entries
      : [{ date: "Today", completed: metrics.completed }];
  }, [filteredTasks, metrics.completed]);

  // Export Dashboard as PNG
  // Export Dashboard as PNG
  const handleExportPNG = async () => {
    if (!dashboardRef.current) return;
    try {
      setIsExporting(true);

      const isDarkMode = document.documentElement.classList.contains("dark");
      const bg = isDarkMode ? "#0f172a" : "#f8fafc";

      const dataUrl = await toPng(dashboardRef.current, {
        cacheBust: true,
        backgroundColor: bg,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `sprintdesk-analytics-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("PNG export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Sprint Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time insights, completion trends, and velocity metrics
          </p>
        </div>

        {/* Filters and PNG Export */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-xl text-xs shadow-sm">
            <label className="text-slate-600 dark:text-slate-400 font-semibold">
              From:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ colorScheme: "light dark" }}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            />

            <label className="text-slate-600 dark:text-slate-400 font-semibold ml-2">
              To:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ colorScheme: "light dark" }}
              className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
            />

            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-red-500 hover:text-red-600 font-bold ml-1 px-1.5 py-0.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportPNG}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "📸 Export PNG"}
          </Button>
        </div>
      </div>

      {/* Exportable Area */}
      <div
        ref={dashboardRef}
        className="space-y-6 p-2 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20"
      >
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

        {/* Charts Grid 1 */}
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
                    isAnimationActive={true}
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
                  <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={true}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Grid 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sprint Velocity Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
              Sprint Velocity & Volume
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={velocityData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="stage" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.5rem",
                      color: "#f8fafc",
                    }}
                  />
                  <Bar
                    dataKey="tasksCount"
                    name="Task Count"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Completion Trend over Time */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
              Task Completion Trend
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={completionTrendData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "0.5rem",
                      color: "#f8fafc",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    name="Completed Tasks"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 5 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
