import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { type Task, type TaskStatus } from "../../types/task";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  icon: string;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
  onMoveTask?: (id: string, targetStatus: TaskStatus) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  tasks,
  icon,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-80 shrink-0 bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 transition-colors min-h-[500px] ${
        isOver ? "ring-2 ring-blue-500/50 bg-blue-500/5" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm tracking-wide">
            {title}
          </h3>
        </div>
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          {tasks.length}
        </span>
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
            />
          ))}
          {tasks.length === 0 && (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-xs text-slate-400 text-center">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};
