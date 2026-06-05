import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PILOT_START_DATE } from "../lib/dateUtils";
import type { ClarityLevel, EffortLevel, Task, TaskType, WeightLevel } from "../types";

const emptyTask: Task = {
  id: "",
  course: "",
  task: "",
  dueDate: PILOT_START_DATE,
  taskType: "Medium",
  effort: "Medium",
  clarity: "Clear",
  weight: "",
  completed: false
};

interface TaskFormProps {
  editingTask: Task | null;
  draftTask: Task | null;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

export default function TaskForm({ editingTask, draftTask, onSubmit, onCancel }: TaskFormProps) {
  const [form, setForm] = useState<Task>(emptyTask);

  useEffect(() => {
    setForm(editingTask ?? draftTask ?? emptyTask);
  }, [editingTask, draftTask]);

  const update = <K extends keyof Task>(key: K, value: Task[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({
      ...form,
      id: form.id || crypto.randomUUID(),
      course: form.course.trim(),
      task: form.task.trim()
    });
    if (!editingTask) setForm(emptyTask);
  };

  return (
    <form className="vip-panel" onSubmit={submit}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase text-vip-blue">{editingTask ? "Edit task" : "Add task"}</p>
          <h2 className="mt-1 text-xl font-semibold text-vip-ink">Deadline entry</h2>
        </div>
        {editingTask && (
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Cancel editing">
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="form-field">
          <span>Course</span>
          <input
            aria-label="Course"
            required
            value={form.course}
            onChange={(event) => update("course", event.target.value)}
          />
        </label>
        <label className="form-field">
          <span>Task</span>
          <input
            aria-label="Task"
            required
            value={form.task}
            onChange={(event) => update("task", event.target.value)}
          />
        </label>
        <label className="form-field">
          <span>Due date</span>
          <input
            aria-label="Due date"
            inputMode="numeric"
            placeholder="YYYY-MM-DD"
            required
            type="text"
            value={form.dueDate}
            onChange={(event) => update("dueDate", event.target.value)}
          />
        </label>
        <label className="form-field">
          <span>Task type</span>
          <select
            aria-label="Task type"
            value={form.taskType}
            onChange={(event) => update("taskType", event.target.value as TaskType)}
          >
            <option>Small</option>
            <option>Medium</option>
            <option>Large</option>
          </select>
        </label>
        <label className="form-field">
          <span>Expected effort</span>
          <select
            aria-label="Expected effort"
            value={form.effort}
            onChange={(event) => update("effort", event.target.value as EffortLevel)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <label className="form-field">
          <span>Clarity</span>
          <select
            aria-label="Clarity"
            value={form.clarity}
            onChange={(event) => update("clarity", event.target.value as ClarityLevel)}
          >
            <option>Clear</option>
            <option>Unclear</option>
          </select>
        </label>
        <label className="form-field">
          <span>Weight</span>
          <select
            aria-label="Weight"
            value={String(form.weight ?? "")}
            onChange={(event) => update("weight", event.target.value as WeightLevel)}
          >
            <option value="">Optional</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <label className="flex min-h-12 items-center gap-3 rounded-lg border border-vip-line bg-white px-3 py-2 text-sm font-medium text-vip-muted">
          <input
            type="checkbox"
            checked={form.completed}
            onChange={(event) => update("completed", event.target.checked)}
            className="h-4 w-4 accent-vip-blue"
          />
          Completed
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="submit" className="btn-primary">
          <Save size={17} aria-hidden="true" />
          {editingTask ? "Save changes" : "Add task"}
        </button>
        {editingTask && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
