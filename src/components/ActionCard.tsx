import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getActionsForScore, getActionSummary } from "../lib/actionCards";
import { getStatusClasses } from "../lib/loadScore";
import type { ScoreBreakdown } from "../types";

interface ActionCardProps {
  score: ScoreBreakdown;
  onOpenSOS: () => void;
}

export default function ActionCard({ score, onOpenSOS }: ActionCardProps) {
  const actions = getActionsForScore(score);

  return (
    <section className="vip-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase text-vip-blue">Next 24-48 hours</p>
          <h2 className="mt-1 text-xl font-semibold text-vip-ink">Action Card</h2>
        </div>
        <span className={`rounded-lg border px-3 py-2 text-sm font-semibold ${getStatusClasses(score.status)}`}>
          {score.status}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-vip-muted">{getActionSummary(score)}</p>

      {score.highestRiskTask && (
        <div className="mt-4 rounded-lg border border-vip-line bg-vip-panel p-3">
          <p className="text-xs font-semibold uppercase text-vip-blue">Highest-risk task</p>
          <p className="mt-1 text-sm font-semibold text-vip-ink">
            {score.highestRiskTask.course}: {score.highestRiskTask.task}
          </p>
        </div>
      )}

      <ul className="mt-4 space-y-2">
        {actions.map((action) => (
          <li key={action} className="flex gap-2 text-sm leading-6 text-vip-muted">
            <CheckCircle2 className="mt-0.5 shrink-0 text-vip-blue" size={17} aria-hidden="true" />
            <span>{action}</span>
          </li>
        ))}
      </ul>

      <button type="button" className="btn-secondary mt-5" onClick={onOpenSOS}>
        Open SOS Navigator
        <ArrowRight size={17} aria-hidden="true" />
      </button>
    </section>
  );
}
