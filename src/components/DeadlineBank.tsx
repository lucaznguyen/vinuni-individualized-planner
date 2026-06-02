import { Check, Edit3, Trash2 } from "lucide-react";
import { formatDate, getWeekNumber } from "../lib/dateUtils";
import type { Task } from "../types";

interface DeadlineBankProps {
  tasks: Task[];
  selectedWeek: number;
  viewMode: "dashboard" | "sheet";
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onPatchTask: (id: string, patch: Partial<Task>) => void;
}

export default function DeadlineBank({
  tasks,
  selectedWeek,
  viewMode,
  onEdit,
  onDelete,
  onPatchTask
}: DeadlineBankProps) {
  const sortedTasks = [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const visibleTasks = viewMode === "sheet" ? sortedTasks : sortedTasks.filter((task) => getWeekNumber(task.dueDate) === selectedWeek);

  return (
    <section className="vip-panel overflow-hidden">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-vip-blue">
            {viewMode === "sheet" ? "All weeks" : `Week ${selectedWeek}`}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-vip-ink">Deadline Bank</h2>
        </div>
        <p className="text-sm text-vip-muted">{visibleTasks.length} tasks shown</p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-vip-line">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-vip-panel text-xs uppercase text-vip-muted">
            <tr>
              <th className="px-3 py-3 font-semibold">Done</th>
              <th className="px-3 py-3 font-semibold">Course</th>
              <th className="px-3 py-3 font-semibold">Task</th>
              <th className="px-3 py-3 font-semibold">Due</th>
              <th className="px-3 py-3 font-semibold">Type</th>
              <th className="px-3 py-3 font-semibold">Effort</th>
              <th className="px-3 py-3 font-semibold">Clarity</th>
              <th className="px-3 py-3 font-semibold">Weight</th>
              <th className="px-3 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-vip-line bg-white">
            {visibleTasks.map((task) => (
              <tr key={task.id} className={task.completed ? "text-vip-muted opacity-70" : "text-vip-ink"}>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                      task.completed ? "border-vip-green bg-green-50 text-vip-green" : "border-vip-line text-vip-muted"
                    }`}
                    onClick={() => onPatchTask(task.id, { completed: !task.completed })}
                    aria-label={`Mark ${task.task} ${task.completed ? "incomplete" : "complete"}`}
                  >
                    {task.completed && <Check size={16} aria-hidden="true" />}
                  </button>
                </td>
                <td className="px-3 py-3 font-medium">{task.course}</td>
                <td className="px-3 py-3">{task.task}</td>
                <td className="px-3 py-3">{formatDate(task.dueDate)}</td>
                <td className="px-3 py-3">{task.taskType}</td>
                <td className="px-3 py-3">{task.effort}</td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    className={`rounded-lg border px-2 py-1 text-xs font-semibold ${
                      task.clarity === "Unclear"
                        ? "border-vip-yellow bg-yellow-50 text-vip-yellow"
                        : "border-vip-line bg-white text-vip-muted"
                    }`}
                    onClick={() => onPatchTask(task.id, { clarity: task.clarity === "Unclear" ? "Clear" : "Unclear" })}
                  >
                    {task.clarity}
                  </button>
                </td>
                <td className="px-3 py-3">{task.weight || "-"}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <button type="button" className="icon-btn" onClick={() => onEdit(task)} aria-label={`Edit ${task.task}`}>
                      <Edit3 size={16} aria-hidden="true" />
                    </button>
                    <button type="button" className="icon-btn-danger" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.task}`}>
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visibleTasks.length === 0 && (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-vip-muted">
                  No tasks in this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
