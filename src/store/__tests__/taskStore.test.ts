import { useTaskStore } from '../taskStore';
import { type Task } from '../../types/task';

describe('Zustand Task Store', () => {
  beforeEach(() => {
    localStorage.clear();
    useTaskStore.setState({ tasks: [] });
  });

  it('should add a new task', () => {
    const newTask: Task = {
      id: 'task-1',
      title: 'Write unit tests',
      status: 'backlog',
      priority: 'high',
      description: 'Cover store and components with Vitest',
      createdAt: new Date().toISOString(),
    };

    useTaskStore.getState().addTask(newTask);

    const tasks = useTaskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Write unit tests');
  });

  it('should move a task status', () => {
    const initialTask: Task = {
      id: 'task-1',
      title: 'Move task test',
      status: 'backlog',
      priority: 'medium',
      description: '',
      createdAt: new Date().toISOString(),
    };

    useTaskStore.setState({ tasks: [initialTask] });

    useTaskStore.getState().moveTask('task-1', 'in_progress');

    const updatedTask = useTaskStore.getState().tasks.find((t: Task) => t.id === 'task-1');
    expect(updatedTask?.status).toBe('in_progress');
  });

  it('should delete a task', () => {
    const initialTask: Task = {
      id: 'task-1',
      title: 'Task to delete',
      status: 'review',
      priority: 'low',
      description: '',
      createdAt: new Date().toISOString(),
    };

    useTaskStore.setState({ tasks: [initialTask] });

    useTaskStore.getState().deleteTask('task-1');

    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });
});