import { ToastProvider, useToast } from "./components/ui/Toast";
import { Button } from "./components/ui/Button";
import { DataTable, type Column } from "./components/ui/DataTable";
import { Skeleton } from "./components/ui/Skeleton";

interface DemoTask {
  id: number;
  title: string;
  status: string;
  priority: string;
}

const sampleData: DemoTask[] = [
  {
    id: 1,
    title: "Fix Login Auth Interceptor",
    status: "In Progress",
    priority: "High",
  },
  {
    id: 2,
    title: "Build Design System Components",
    status: "Done",
    priority: "High",
  },
  {
    id: 3,
    title: "Setup Recharts Analytics",
    status: "Backlog",
    priority: "Medium",
  },
];

const columns: Column<DemoTask>[] = [
  { header: "ID", accessorKey: "id" },
  { header: "Task Title", accessorKey: "title" },
  { header: "Status", accessorKey: "status" },
  { header: "Priority", accessorKey: "priority" },
];

function MainContent() {
  const { addToast } = useToast();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold text-blue-400">
        Design System: Toast & DataTable
      </h1>

      <div className="flex gap-3">
        <Button
          variant="primary"
          onClick={() => addToast("Task created successfully!", "success")}
        >
          Trigger Success Toast
        </Button>
        <Button
          variant="danger"
          onClick={() => addToast("Failed to delete task", "error")}
        >
          Trigger Error Toast
        </Button>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        <h2 className="text-lg font-semibold">DataTable Preview</h2>
        <DataTable data={sampleData} columns={columns} />

        <h2 className="text-lg font-semibold mt-6">Skeleton Loader Preview</h2>
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainContent />
    </ToastProvider>
  );
}
