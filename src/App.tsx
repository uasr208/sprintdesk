import { useState } from "react";
import { Button } from "./components/ui/Button";
import { Select } from "./components/ui/Select";
import { Modal } from "./components/ui/Modal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priority, setPriority] = useState("medium");

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold text-blue-400">
        Design System Component Preview
      </h1>

      <div className="w-full max-w-md space-y-4 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-md">
        <Select
          label="Task Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          options={[
            { label: "Low Priority", value: "low" },
            { label: "Medium Priority", value: "medium" },
            { label: "High Priority", value: "high" },
          ]}
        />

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="w-full mt-2"
        >
          Open Test Modal
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Save Task
            </Button>
          </>
        }
      >
        <p className="text-sm">
          This is an accessible modal overlay with keyboard (Escape key)
          support!
        </p>
      </Modal>
    </div>
  );
}
