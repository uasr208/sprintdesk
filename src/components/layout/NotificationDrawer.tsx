import React from "react";
import { useNotificationStore } from "../../store/notificationStore";
import { Button } from "../ui/Button";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { notifications, markAsRead, markAllAsRead, clearAll } =
    useNotificationStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popover Panel */}
      <div className="fixed right-4 top-18 z-50 w-80 sm:w-96 max-h-[80vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Notifications
          </h3>
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Mark all read
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={clearAll}
              className="text-xs text-slate-500 hover:text-red-500 font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[60vh]">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No notifications yet
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer text-xs ${
                  item.isRead
                    ? "bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/60 text-slate-500"
                    : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/80 text-slate-800 dark:text-slate-200 font-medium"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold capitalize text-slate-900 dark:text-slate-100">
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {item.timestamp}
                  </span>
                </div>
                <p className="line-clamp-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-full text-xs"
          >
            Close
          </Button>
        </div>
      </div>
    </>
  );
};
