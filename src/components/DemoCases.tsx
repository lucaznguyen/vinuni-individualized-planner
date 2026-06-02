import { Play, TableProperties } from "lucide-react";
import { demoCases } from "../data/demoCases";

interface DemoCasesProps {
  onRunDemo: (caseId: string) => void;
}

export default function DemoCases({ onRunDemo }: DemoCasesProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-vip-line bg-vip-panel p-5">
        <p className="text-sm font-semibold uppercase text-vip-blue">Pitch-ready walkthroughs</p>
        <h1 className="mt-1 text-2xl font-semibold text-vip-ink">Demo Cases</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-vip-muted">
          Each Run demo button loads a scenario into the dashboard and selects Week 3 so the pitch can move quickly.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {demoCases.map((demoCase) => (
          <article key={demoCase.id} className="vip-panel flex flex-col">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-vip-panel text-vip-blue">
                <TableProperties size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-vip-ink">{demoCase.title}</h2>
                <p className="mt-2 text-sm leading-6 text-vip-muted">{demoCase.scenario}</p>
              </div>
            </div>

            <ol className="mt-5 space-y-2 text-sm leading-6 text-vip-muted">
              {demoCase.flow.map((step, index) => (
                <li key={step} className="flex gap-2">
                  <span className="font-semibold text-vip-blue">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <button
              type="button"
              className="btn-primary mt-6"
              onClick={() => onRunDemo(demoCase.id)}
              aria-label={`Run ${demoCase.title}`}
            >
              <Play size={17} aria-hidden="true" />
              Run demo
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
