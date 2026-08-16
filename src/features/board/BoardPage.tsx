import React, { useState, useMemo, useCallback } from "react";
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
import { TaskDrawer } from "./TaskDrawer";
import { TaskModal } from "./TaskModal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
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
  const { tasks, addTask, updateTask, moveTask, undoLastMove, deleteTask } =
    useTaskStore();
  const { addToast } = useToast();

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = tasks.find((t) => t.id === event.active.id);
      if (task) setActiveTask(task);
    },
    [tasks],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);
      if (!over) return;

      const taskId = String(active.id);
      const overId = String(over.id);

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
    },
    [tasks, moveTask, addToast],
  );

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  }, []);

  const handleOpenCreateModal = useCallback(() => {
    setEditingTask(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const handleSaveTask = useCallback(
    (taskData: Omit<Task, "id"> | Task) => {
      if ("id" in taskData) {
        updateTask(taskData.id, taskData);
        addToast("Task updated successfully", "success");
      } else {
        addTask(taskData);
        addToast("Task created successfully", "success");
      }
      setIsModalOpen(false);
    },
    [updateTask, addTask, addToast],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteTask(id);
      addToast("Task deleted successfully", "success");
    },
    [deleteTask, addToast],
  );

  const handleMoveTaskInline = useCallback(
    (id: string, targetStatus: TaskStatus) => {
      moveTask(id, targetStatus);
      addToast(`Moved task to ${targetStatus.replace("_", " ")}`, "info");
    },
    [moveTask, addToast],
  );

  const handleUndoMove = useCallback(() => {
    undoLastMove();
    addToast("Reverted last task movement", "info");
  }, [undoLastMove, addToast]);

  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleDrawerEdit = useCallback(
    (task: Task) => {
      setIsDrawerOpen(false);
      handleOpenEditModal(task);
    },
    [handleOpenEditModal],
  );

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
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Sprint Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Drag cards across columns or use quick actions to manage tasks
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
            onClick={handleUndoMove}
            className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium transition-colors shrink-0 flex items-center justify-center gap-1"
            title="Undo Last Move"
          >
            <span>↩️</span> <span>Undo</span>
          </button>

          <Button
            variant="primary"
            onClick={handleOpenCreateModal}
            className="shrink-0"
          >
            + New Task
          </Button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 w-full max-w-full touch-pan-x snap-x">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              icon={col.icon}
              tasks={filteredTasks.filter((t) => t.status === col.id)}
              onTaskClick={handleTaskClick}
              onEditTask={handleOpenEditModal}
              onDeleteTask={handleDelete}
              onMoveTask={handleMoveTaskInline}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Task Details Drawer */}
      <TaskDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onEdit={handleDrawerEdit}
      />

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />
    </div>
  );
};
