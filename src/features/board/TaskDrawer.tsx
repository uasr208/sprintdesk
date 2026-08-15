import React, { useState } from "react";
import { type Task } from "../../types/task";
import { Button } from "../../components/ui/Button";

interface TaskDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export const TaskDrawer: React.FC<TaskDrawerProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [comments, setComments] = useState<string[]>([
    "Initial task review completed.",
    "Assigned priority based on sprint scope.",
  ]);
  const [newComment, setNewComment] = useState("");

  if (!isOpen || !task) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([...comments, newComment.trim()]);
    setNewComment("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold uppercase rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {task.status.replace("_", " ")}
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold uppercase rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {task.priority}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit(task)}
              >
                ✏️ Edit
              </Button>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none px-2"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {task.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {task.description || "No detailed description provided."}
              </p>
            </div>

            {/* Assignee Information */}
            {task.assignee && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Assignee
                </h3>
                <div className="flex items-center gap-3">
                  <img
                    src={task.assignee.avatar}
                    alt={task.assignee.name}
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {task.assignee.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Activity & Comments ({comments.length})
              </h3>

              <div className="space-y-3">
                {comments.map((comment, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/50"
                  >
                    {comment}
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  className="text-xs"
                >
                  Post
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
