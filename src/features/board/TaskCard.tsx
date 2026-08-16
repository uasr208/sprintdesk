import React, { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "../../types/task";

interface TaskCardProps {
  task: Task;
  onTaskClick?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onMove?: (taskId: string, status: TaskStatus) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  low: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  high: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  urgent: "bg-red-500/10 text-red-400 border-red-500/20",
};

const statusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: "backlog", label: "Backlog" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "In Review" },
  { value: "done", label: "Completed" },
];

export const TaskCard = memo(function TaskCard({
  task,
  onTaskClick,
  onEdit,
  onDelete,
  onMove,
}: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onTaskClick?.(task)}
      className={`group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-40 border-blue-500 scale-95" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          className={`px-2 py-0.5 text-xs font-semibold rounded-md border uppercase tracking-wider ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>

        <div className="flex items-center gap-1">
          {onMove && (
            <select
              value={task.status}
              onChange={(e) => {
                e.stopPropagation();
                onMove(task.id, e.target.value as TaskStatus);
              }}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="text-[11px] bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded px-1.5 py-0.5 outline-none cursor-pointer focus:ring-1 focus:ring-blue-500"
              title="Move Task Status"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Move: {opt.label}
                </option>
              ))}
            </select>
          )}

          {/* Edit Button */}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-slate-200 text-xs"
              title="Edit Task"
            >
              ✏️
            </button>
          )}

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="p-1 hover:bg-red-500/10 rounded text-slate-400 hover:text-red-400 text-xs"
              title="Delete Task"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1 line-clamp-2">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50 text-xs">
        <div className="flex flex-wrap gap-1">
          {task.tags?.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded text-[10px]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {task.assignee && (
          <img
            src={task.assignee.avatar}
            alt={task.assignee.name}
            title={task.assignee.name}
            className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 ml-auto"
          />
        )}
      </div>
    </div>
  );
});
