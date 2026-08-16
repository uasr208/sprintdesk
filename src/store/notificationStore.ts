import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotifications: (items: Omit<NotificationItem, 'isRead'>[]) => NotificationItem[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      addNotifications: (newItems) => {
        const existingIds = new Set(get().notifications.map((n) => n.id));
        const freshlyAdded: NotificationItem[] = [];

        const incoming = newItems
          .filter((item) => !existingIds.has(item.id))
          .map((item) => {
            const newItem = { ...item, isRead: false };
            freshlyAdded.push(newItem);
            return newItem;
          });

        if (incoming.length === 0) return [];

        const updatedList = [...incoming, ...get().notifications].slice(0, 20); // Keep top 20
        const unreadCount = updatedList.filter((n) => !n.isRead).length;

        set({ notifications: updatedList, unreadCount });
        return freshlyAdded;
      },

      markAsRead: (id) => {
        const updated = get().notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        );
        set({
          notifications: updated,
          unreadCount: updated.filter((n) => !n.isRead).length,
        });
      },

      markAllAsRead: () => {
        const updated = get().notifications.map((n) => ({ ...n, isRead: true }));
        set({ notifications: updated, unreadCount: 0 });
      },

      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'sprintdesk-notifications',
    }
  )
);