import { Button } from "./components/ui/Button";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold text-blue-400">
        Design System Component Preview
      </h1>
      <div className="flex flex-wrap gap-4 items-center">
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="primary" isLoading>
          Loading State
        </Button>
      </div>
    </div>
  );
}
