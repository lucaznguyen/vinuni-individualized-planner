import { Download, FileUp, Pause, Play, RotateCcw, ShieldCheck, Trash2 } from "lucide-react";
import { type Dispatch, type SetStateAction, useEffect, useMemo, useRef, useState } from "react";
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

const guidedTourSteps = [
  {
    week: 1,
    title: "Week 1 - Preview the term",
    body: "A quiet week is still useful: students can enter syllabus deadlines before the pressure appears."
  },
  {
    week: 2,
    title: "Week 2 - First workload signal",
    body: "The first lab creates a visible planning cue while the week is still manageable."
  },
  {
    week: 3,
    title: "Week 3 - Hidden workload becomes visible",
    body: "Several courses converge, so the score and action card turn the cluster into a 24-48 hour plan."
  },
  {
    week: 5,
    title: "Week 5 - Next project checkpoint",
    body: "The tour jumps ahead to show how VIP keeps future project work in view before it becomes urgent."
  }
] as const;

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
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [tourPlaying, setTourPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const weekScores = useMemo(() => calculateAllWeeks(tasks), [tasks]);
  const selectedScore = useMemo(() => calculateWeekScore(tasks, selectedWeek), [tasks, selectedWeek]);
  const tourStep = guidedTourSteps[tourStepIndex];
  const tourScore = weekScores[tourStep.week - 1];

  useEffect(() => {
    if (!tourPlaying) return undefined;

    setSelectedWeek(tourStep.week);
    const timeoutId = window.setTimeout(() => {
      setTourStepIndex((current) => {
        if (current >= guidedTourSteps.length - 1) {
          setTourPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [setSelectedWeek, tourPlaying, tourStep.week]);

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

  const startTour = () => {
    setTourStepIndex((current) => (current >= guidedTourSteps.length - 1 ? 0 : current));
    setTourPlaying(true);
  };

  const restartTour = () => {
    setTourStepIndex(0);
    setSelectedWeek(guidedTourSteps[0].week);
    setTourPlaying(true);
  };

  const selectTourStep = (index: number) => {
    setTourPlaying(false);
    setTourStepIndex(index);
    setSelectedWeek(guidedTourSteps[index].week);
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

      <section className="vip-panel">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase text-vip-blue">Live demo automation</p>
            <h2 className="mt-1 text-xl font-semibold text-vip-ink">Guided week tour</h2>
            <p className="mt-2 text-sm leading-6 text-vip-muted">{tourStep.body}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary" onClick={tourPlaying ? () => setTourPlaying(false) : startTour}>
              {tourPlaying ? <Pause size={17} aria-hidden="true" /> : <Play size={17} aria-hidden="true" />}
              {tourPlaying ? "Pause" : "Start tour"}
            </button>
            <button type="button" className="btn-secondary" onClick={restartTour}>
              <RotateCcw size={17} aria-hidden="true" />
              Restart
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-4">
          {guidedTourSteps.map((step, index) => {
            const score = weekScores[step.week - 1];
            const active = index === tourStepIndex;
            return (
              <button
                key={step.week}
                type="button"
                className={`rounded-lg border px-3 py-3 text-left transition ${
                  active
                    ? "border-vip-blue bg-vip-blue text-white"
                    : "border-vip-line bg-white text-vip-muted hover:border-vip-blue hover:text-vip-blue"
                }`}
                onClick={() => selectTourStep(index)}
              >
                <span className="block text-sm font-semibold">{step.title}</span>
                <span className={`mt-1 block text-xs ${active ? "text-white/85" : "text-vip-muted"}`}>
                  Score {score.total} | {score.status}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 rounded-lg border border-vip-line bg-vip-panel p-3 text-sm leading-6 text-vip-muted">
          <span className="font-semibold text-vip-ink">{tourStep.title}:</span> Score {tourScore.total},{" "}
          {tourScore.activeTaskCount} active tasks, {tourScore.status} status.
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
