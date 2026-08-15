import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Task, type TaskStatus } from '../types/task';

interface TaskState {
  tasks: Task[];
  previousState: Task[] | null;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetStatus: TaskStatus) => void;
  undoLastMove: () => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      previousState: null,

      setTasks: (tasks) => set({ tasks }),

      addTask: (newTaskData) => {
        const newTask: Task = {
          ...newTaskData,
          id: `task-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      moveTask: (taskId, targetStatus) => {
        const currentTasks = get().tasks;
        set({
          previousState: currentTasks,
          tasks: currentTasks.map((task) =>
            task.id === taskId ? { ...task, status: targetStatus } : task
          ),
        });
      },

      undoLastMove: () => {
        const { previousState } = get();
        if (previousState) {
          set({ tasks: previousState, previousState: null });
        }
      },
    }),
    {
      name: 'sprintdesk_tasks_storage',
    }
  )
);