import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTaskStore } from '../../store/taskStore';
import { type Task, type TaskPriority, type TaskStatus } from '../../types/task';

interface RawTodo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

const mapTodoToTask = (todo: RawTodo): Task => {
  const statuses: TaskStatus[] = ['backlog', 'in_progress', 'review', 'done'];
  const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];

  // Map completed status or distribute deterministically
  const status: TaskStatus = todo.completed
    ? 'done'
    : statuses[todo.id % 3]; // Distribute among backlog, in_progress, review

  const priority: TaskPriority = priorities[todo.id % priorities.length];

  return {
    id: `todo-${todo.id}`,
    title: todo.title.charAt(0).toUpperCase() + todo.title.slice(1),
    description: `Task description for sprint item #${todo.id}. Refactor logic and implement responsive behavior.`,
    status,
    priority,
    assignee: {
      name: `Engineer ${todo.userId}`,
      avatar: `https://i.pravatar.cc/150?u=${todo.userId}`,
    },
    tags: [todo.id % 2 === 0 ? 'Frontend' : 'Backend', 'Sprint 1'],
    createdAt: new Date(Date.now() - todo.id * 86400000).toISOString(),
  };
};

export const useTasks = () => {
  const { tasks, setTasks } = useTaskStore();

  return useQuery({
    queryKey: ['initial-tasks'],
    queryFn: async () => {
      const { data } = await axios.get<RawTodo[]>(
        'https://jsonplaceholder.typicode.com/todos?_limit=30'
      );
      const mappedTasks = data.map(mapTodoToTask);
      
      // Only seed if store is currently empty
      if (tasks.length === 0) {
        setTasks(mappedTasks);
      }
      return mappedTasks;
    },
    enabled: tasks.length === 0,
  });
};