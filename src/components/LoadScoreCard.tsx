import { Info } from "lucide-react";
import { getStatusClasses, getStatusDescription } from "../lib/loadScore";
import type { ScoreBreakdown } from "../types";

interface LoadScoreCardProps {
  score: ScoreBreakdown;
}

export default function LoadScoreCard({ score }: LoadScoreCardProps) {
  const rows = [
    ["Assessment Load", score.assessmentLoad, "Small +1, Medium +2, Large +3"],
    ["Deadline Clustering", score.clustering, "Two within 48h +2; three within 72h +3"],
    ["Expected Effort", score.expectedEffort, "Medium +1, High +2"],
    ["Task Clarity Risk", score.clarityRisk, "Unclear +1 each, max +2 per week"]
  ] as const;

  return (
    <section className="vip-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase text-vip-blue">{score.weekLabel}</p>
          <h2 className="mt-1 text-xl font-semibold text-vip-ink">Academic Load Score</h2>
        </div>
        <span className={`rounded-lg border px-3 py-2 text-sm font-semibold ${getStatusClasses(score.status)}`}>
          {score.status}
        </span>
      </div>

      <div className="mt-5 flex items-end gap-4">
        <p className="text-6xl font-semibold text-vip-blue">{score.total}</p>
        <p className="pb-2 text-sm leading-6 text-vip-muted">{getStatusDescription(score.status)}</p>
      </div>

      <div className="mt-5 space-y-3">
        {rows.map(([label, value, rule]) => (
          <div key={label} className="grid grid-cols-[1fr_auto] gap-3 border-b border-vip-line pb-3 last:border-b-0 last:pb-0">
            <div>
              <p className="text-sm font-semibold text-vip-ink">{label}</p>
              <p className="mt-1 text-xs leading-5 text-vip-muted">{rule}</p>
            </div>
            <p className="text-lg font-semibold text-vip-blue">+{value}</p>
          </div>
        ))}
      </div>

      {score.clusterNotes.length > 0 && (
        <div className="mt-4 rounded-lg border border-vip-line bg-vip-panel p-3 text-sm text-vip-muted">
          {score.clusterNotes.join(" ")}
        </div>
      )}

      <div className="mt-4 flex gap-2 rounded-lg border border-vip-line bg-white p-3 text-sm leading-6 text-vip-muted">
        <Info className="mt-0.5 shrink-0 text-vip-blue" size={17} aria-hidden="true" />
        <span>Transparent heuristic, not an AI model. The score describes weekly academic load, not student capability.</span>
      </div>
    </section>
  );
}
