import { Download, FileUp, RotateCcw, ShieldCheck, Trash2 } from "lucide-react";
import { type Dispatch, type SetStateAction, useMemo, useRef, useState } from "react";
import ActionCard from "./ActionCard";
import DeadlineBank from "./DeadlineBank";
import LoadScoreCard from "./LoadScoreCard";
import SOSNavigator from "./SOSNavigator";
import TaskForm from "./TaskForm";
import WeeklyHeatmap from "./WeeklyHeatmap";
import { calculateAllWeeks, calculateWeekScore } from "../lib/loadScore";
import { downloadCsv, parseTasksCsv, tasksToCsv } from "../lib/csv";
import type { Task } from "../types";

interface DashboardProps {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  draftTask: Task | null;
  onDraftConsumed: () => void;
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  saveStamp: string;
  onResetDemoData: () => void;
  onClearLocalData: () => void;
  onOpenSOS: () => void;
}

type ViewMode = "dashboard" | "sheet";

export default function Dashboard({
  tasks,
  setTasks,
  draftTask,
  onDraftConsumed,
  selectedWeek,
  setSelectedWeek,
  saveStamp,
  onResetDemoData,
  onClearLocalData,
  onOpenSOS
}: DashboardProps) {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [importMessage, setImportMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const weekScores = useMemo(() => calculateAllWeeks(tasks), [tasks]);
  const selectedScore = useMemo(() => calculateWeekScore(tasks, selectedWeek), [tasks, selectedWeek]);

  const upsertTask = (task: Task) => {
    setTasks((current) => {
      const exists = current.some((item) => item.id === task.id);
      return exists ? current.map((item) => (item.id === task.id ? task : item)) : [...current, task];
    });
    setEditingTask(null);
    if (draftTask?.id === task.id) onDraftConsumed();
  };

  const deleteTask = (id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  };

  const patchTask = (id: string, patch: Partial<Task>) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  };

  const handleExport = () => {
    downloadCsv("vip-deadline-bank.csv", tasksToCsv(tasks));
  };

  const handleImport = async (file?: File) => {
    if (!file) return;
    const csv = await file.text();
    const result = parseTasksCsv(csv);
    if (result.error) {
      setImportMessage(result.error);
      return;
    }
    setTasks(result.tasks);
    setImportMessage(`Imported ${result.tasks.length} tasks. Data stays local to this browser.`);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 rounded-lg border border-vip-line bg-vip-panel p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-vip-blue">Student-owned dashboard</p>
          <h1 className="mt-1 text-2xl font-semibold text-vip-ink">Deadline Bank, heatmap, score, and action card</h1>
          <p className="mt-2 text-sm leading-6 text-vip-muted">
            This demo stores data only in your browser. It does not collect grades, GPA, counseling records, clinical
            data, private Canvas analytics, or login data.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-lg border border-vip-line bg-white px-3 py-2 text-sm text-vip-muted">
            <ShieldCheck size={16} aria-hidden="true" />
            {saveStamp}
          </span>
          <div className="flex rounded-lg border border-vip-line bg-white p-1" aria-label="View mode">
            <button
              type="button"
              className={`rounded-md px-3 py-2 text-sm font-medium ${viewMode === "dashboard" ? "bg-vip-blue text-white" : "text-vip-muted"}`}
              onClick={() => setViewMode("dashboard")}
            >
              Dashboard Mode
            </button>
            <button
              type="button"
              className={`rounded-md px-3 py-2 text-sm font-medium ${viewMode === "sheet" ? "bg-vip-blue text-white" : "text-vip-muted"}`}
              onClick={() => setViewMode("sheet")}
            >
              Sheet Mode
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <TaskForm
          editingTask={editingTask}
          draftTask={draftTask}
          onCancel={() => setEditingTask(null)}
          onSubmit={upsertTask}
        />
        <div className="space-y-4">
          <WeeklyHeatmap scores={weekScores} selectedWeek={selectedWeek} onSelectWeek={setSelectedWeek} />
          <div className="grid gap-4 md:grid-cols-2">
            <LoadScoreCard score={selectedScore} />
            <ActionCard score={selectedScore} onOpenSOS={onOpenSOS} />
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <DeadlineBank
          tasks={tasks}
          selectedWeek={selectedWeek}
          viewMode={viewMode}
          onEdit={setEditingTask}
          onDelete={deleteTask}
          onPatchTask={patchTask}
        />
        <div className="space-y-4">
          <div className="vip-panel">
            <h2 className="text-lg font-semibold text-vip-ink">CSV and local data</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn-secondary" onClick={handleExport}>
                <Download size={17} aria-hidden="true" />
                Export CSV
              </button>
              <button type="button" className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                <FileUp size={17} aria-hidden="true" />
                Import CSV
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(event) => handleImport(event.target.files?.[0])}
              />
            </div>
            {importMessage && <p className="mt-3 text-sm leading-6 text-vip-muted">{importMessage}</p>}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-vip-line pt-4">
              <button type="button" className="btn-secondary" onClick={onResetDemoData}>
                <RotateCcw size={17} aria-hidden="true" />
                Reset demo data
              </button>
              <button type="button" className="btn-danger" onClick={onClearLocalData}>
                <Trash2 size={17} aria-hidden="true" />
                Clear local data
              </button>
            </div>
          </div>
          <SOSNavigator compact />
        </div>
      </section>
    </div>
  );
}
