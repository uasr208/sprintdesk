import React, { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useTaskStore } from "../../store/taskStore";
import { useTasks } from "./useTasks";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { useToast } from "../../components/ui/Toast";
import { type Task, type TaskStatus } from "../../types/task";

const columns: Array<{ id: TaskStatus; title: string; icon: string }> = [
  { id: "backlog", title: "Backlog", icon: "📥" },
  { id: "in_progress", title: "In Progress", icon: "⚡" },
  { id: "review", title: "In Review", icon: "🔍" },
  { id: "done", title: "Completed", icon: "✅" },
];

export const BoardPage: React.FC = () => {
  const { isLoading } = useTasks();
  const { tasks, moveTask, undoLastMove, deleteTask } = useTaskStore();
  const { addToast } = useToast();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = String(active.id);
    const overId = String(over.id);

    // Determine target column status
    let targetStatus: TaskStatus | null = null;
    if (columns.some((col) => col.id === overId)) {
      targetStatus = overId as TaskStatus;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) targetStatus = overTask.status;
    }

    const currentTask = tasks.find((t) => t.id === taskId);
    if (targetStatus && currentTask && currentTask.status !== targetStatus) {
      moveTask(taskId, targetStatus);
      addToast(`Moved task to ${targetStatus.replace("_", " ")}`, "info");
    }
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    addToast("Task deleted successfully", "success");
  };

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map((col) => (
          <div
            key={col}
            className="w-80 shrink-0 h-[500px] bg-slate-200 dark:bg-slate-800/40 animate-pulse rounded-2xl p-4"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Mobile-Responsive Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Sprint Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Drag cards across columns to update status
          </p>
        </div>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 w-full lg:w-auto">
          <div className="w-full xs:w-48 sm:w-64">
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-full xs:w-36">
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { value: "all", label: "All Priorities" },
                { value: "urgent", label: "Urgent" },
                { value: "high", label: "High" },
                { value: "medium", label: "Medium" },
                { value: "low", label: "Low" },
              ]}
            />
          </div>

          <button
            onClick={() => {
              undoLastMove();
              addToast("Reverted last task movement", "info");
            }}
            className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors shrink-0 flex items-center justify-center gap-1"
            title="Undo Last Move"
          >
            <span>↩️</span> <span>Undo</span>
          </button>
        </div>
      </div>

      {/* Board Columns Container */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              icon={col.icon}
              tasks={filteredTasks.filter((t) => t.status === col.id)}
              onDeleteTask={handleDelete}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
