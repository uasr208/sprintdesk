import { memo } from "react";
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
  icon: string;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (id: string) => void;
  onMoveTask?: (id: string, targetStatus: TaskStatus) => void;
}

export const KanbanColumn = memo(function KanbanColumn({
  id,
  title,
  icon,
  tasks,
  onTaskClick,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="w-[280px] sm:w-80 shrink-0 bg-slate-100 dark:bg-slate-900/50 rounded-2xl p-4 flex flex-col max-h-[calc(100vh-13rem)] border border-slate-200 dark:border-slate-800/80"
    >
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
            {title}
          </h3>
          <span className="px-2 py-0.5 text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
            />
          ))}

          {tasks.length === 0 && (
            <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-slate-400 text-xs">
              No tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
});
