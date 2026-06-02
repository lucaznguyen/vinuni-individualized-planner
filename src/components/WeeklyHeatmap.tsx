import type { ScoreBreakdown } from "../types";
import { getStatusClasses } from "../lib/loadScore";

interface WeeklyHeatmapProps {
  scores: ScoreBreakdown[];
  selectedWeek: number;
  onSelectWeek: (week: number) => void;
}

export default function WeeklyHeatmap({ scores, selectedWeek, onSelectWeek }: WeeklyHeatmapProps) {
  return (
    <section className="vip-panel">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-vip-blue">Weeks 1-8</p>
          <h2 className="mt-1 text-xl font-semibold text-vip-ink">Weekly workload heatmap</h2>
        </div>
        <p className="text-sm text-vip-muted">Green 0-4 | Yellow 5-8 | Red 9+</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
        {scores.map((score) => (
          <button
            key={score.week}
            type="button"
            className={`min-h-28 rounded-lg border p-3 text-left transition hover:-translate-y-0.5 ${
              getStatusClasses(score.status)
            } ${selectedWeek === score.week ? "ring-2 ring-vip-blue ring-offset-2" : ""}`}
            onClick={() => onSelectWeek(score.week)}
          >
            <span className="block text-sm font-semibold">Week {score.week}</span>
            <span className="mt-3 block text-3xl font-semibold">{score.total}</span>
            <span className="mt-2 block text-xs font-semibold">{score.status}</span>
            <span className="mt-1 block text-xs opacity-80">{score.activeTaskCount} active tasks</span>
          </button>
        ))}
      </div>
    </section>
  );
}
