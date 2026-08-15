import { Button } from "./components/ui/Button";
import { Input } from "./components/ui/Input";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold text-blue-400">
        Design System Component Preview
      </h1>

      <div className="w-full max-w-md space-y-4 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
        <Input
          label="Email Address"
          placeholder="name@example.com"
          helperText="We'll never share your email."
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error="Password must be at least 8 characters long"
        />

        <Button variant="primary" className="w-full mt-2">
          Submit
        </Button>
      </div>
    </div>
  );
}
