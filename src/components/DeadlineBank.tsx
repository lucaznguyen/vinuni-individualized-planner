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

  const completionButton = (task: Task) => (
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
  );

  const clarityButton = (task: Task) => (
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
  );

  const actionButtons = (task: Task) => (
    <div className="flex gap-2">
      <button type="button" className="icon-btn" onClick={() => onEdit(task)} aria-label={`Edit ${task.task}`}>
        <Edit3 size={16} aria-hidden="true" />
      </button>
      <button type="button" className="icon-btn-danger" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.task}`}>
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </div>
  );

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

      {viewMode === "dashboard" ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {visibleTasks.map((task) => (
            <article
              key={task.id}
              className={`rounded-lg border border-vip-line bg-white p-4 ${task.completed ? "opacity-70" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  {completionButton(task)}
                  <div>
                    <p className="text-sm font-semibold text-vip-blue">{task.course}</p>
                    <h3 className="mt-1 text-base font-semibold text-vip-ink">{task.task}</h3>
                  </div>
                </div>
                {actionButtons(task)}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-lg bg-vip-panel px-3 py-2">
                  <p className="text-xs font-semibold uppercase text-vip-blue">Due</p>
                  <p className="mt-1 text-vip-ink">{formatDate(task.dueDate)}</p>
                </div>
                <div className="rounded-lg bg-vip-panel px-3 py-2">
                  <p className="text-xs font-semibold uppercase text-vip-blue">Type</p>
                  <p className="mt-1 text-vip-ink">{task.taskType}</p>
                </div>
                <div className="rounded-lg bg-vip-panel px-3 py-2">
                  <p className="text-xs font-semibold uppercase text-vip-blue">Effort</p>
                  <p className="mt-1 text-vip-ink">{task.effort}</p>
                </div>
                <div className="rounded-lg bg-vip-panel px-3 py-2">
                  <p className="text-xs font-semibold uppercase text-vip-blue">Weight</p>
                  <p className="mt-1 text-vip-ink">{task.weight || "-"}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-vip-line pt-3">
                <span className="text-sm font-medium text-vip-muted">Clarity</span>
                {clarityButton(task)}
              </div>
            </article>
          ))}
          {visibleTasks.length === 0 && (
            <div className="rounded-lg border border-vip-line bg-white p-8 text-center text-sm text-vip-muted md:col-span-2">
              No tasks in this week.
            </div>
          )}
        </div>
      ) : (
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
                  {completionButton(task)}
                </td>
                <td className="px-3 py-3 font-medium">{task.course}</td>
                <td className="px-3 py-3">{task.task}</td>
                <td className="px-3 py-3">{formatDate(task.dueDate)}</td>
                <td className="px-3 py-3">{task.taskType}</td>
                <td className="px-3 py-3">{task.effort}</td>
                <td className="px-3 py-3">{clarityButton(task)}</td>
                <td className="px-3 py-3">{task.weight || "-"}</td>
                <td className="px-3 py-3">
                  {actionButtons(task)}
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
      )}
    </section>
  );
}
