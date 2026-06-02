import { Copy, Mail, Route } from "lucide-react";
import { useMemo, useState } from "react";
import { getClarificationTemplate } from "../lib/actionCards";

interface SOSNavigatorProps {
  compact?: boolean;
}

type SituationId = "unclear" | "deadlines" | "start" | "behind" | "stress";

const routes: {
  id: SituationId;
  situation: string;
  firstAction: string;
  route: string;
  note: string;
}[] = [
  {
    id: "unclear",
    situation: "Assignment unclear",
    firstAction: "Write one specific clarification question.",
    route: "TA / Instructor",
    note: "Use the template to ask about the exact requirement or next step."
  },
  {
    id: "deadlines",
    situation: "Too many deadlines",
    firstAction: "Use 48-hour triage and choose the highest-risk task.",
    route: "VIP Ambassador / Peer Advisor",
    note: "Ask for planning help, not grading advice."
  },
  {
    id: "start",
    situation: "Do not know how to start",
    firstAction: "Try one small step, then bring the blocker.",
    route: "Office Hour / PASS",
    note: "Prepare the part you tried and the point where you got stuck."
  },
  {
    id: "behind",
    situation: "Behind across courses",
    firstAction: "Book an academic planning conversation.",
    route: "Academic Advisor",
    note: "Use the meeting to make a realistic catch-up plan across courses."
  },
  {
    id: "stress",
    situation: "Stress affects daily functioning",
    firstAction: "Use official VinUni wellbeing support.",
    route: "Health & Well-Being Center / PSG",
    note: "This is support routing only. VIP does not diagnose or provide counseling."
  }
];

export default function SOSNavigator({ compact = false }: SOSNavigatorProps) {
  const [selectedId, setSelectedId] = useState<SituationId>("unclear");
  const selected = useMemo(() => routes.find((routeItem) => routeItem.id === selectedId) ?? routes[0], [selectedId]);
  const template = getClarificationTemplate("Writing Seminar", "Writing Reflection Essay");

  const copyTemplate = async () => {
    await navigator.clipboard.writeText(template);
  };

  if (compact) {
    return (
      <section className="vip-panel">
        <div className="flex items-center gap-2">
          <Route size={18} className="text-vip-blue" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-vip-ink">SOS Navigator shortcut</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-vip-muted">
          If academic stress affects daily functioning, use official VinUni wellbeing support.
        </p>
        <div className="mt-4 space-y-2 text-sm">
          {routes.slice(0, 3).map((routeItem) => (
            <div key={routeItem.id} className="rounded-lg border border-vip-line bg-white p-3">
              <p className="font-semibold text-vip-ink">{routeItem.situation}</p>
              <p className="mt-1 text-vip-muted">{routeItem.route}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-vip-line bg-vip-panel p-5">
        <p className="text-sm font-semibold uppercase text-vip-blue">Ask the right person</p>
        <h1 className="mt-1 text-2xl font-semibold text-vip-ink">Academic SOS Navigator</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-vip-muted">
          Choose the academic problem. VIP maps it to a first action and a support route. The Navigator does not provide
          diagnosis or counseling advice.
        </p>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="vip-panel">
          <h2 className="text-lg font-semibold text-vip-ink">Student situation</h2>
          <div className="mt-4 space-y-2">
            {routes.map((routeItem) => (
              <button
                key={routeItem.id}
                type="button"
                className={`w-full rounded-lg border px-4 py-3 text-left text-sm transition ${
                  selectedId === routeItem.id
                    ? "border-vip-blue bg-vip-blue text-white"
                    : "border-vip-line bg-white text-vip-muted hover:border-vip-blue hover:text-vip-blue"
                }`}
                onClick={() => setSelectedId(routeItem.id)}
              >
                {routeItem.situation}
              </button>
            ))}
          </div>
        </div>

        <div className="vip-panel">
          <div className="flex items-center gap-2">
            <Route className="text-vip-blue" size={20} aria-hidden="true" />
            <h2 className="text-lg font-semibold text-vip-ink">Recommended route</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-vip-line bg-white p-4">
              <p className="text-xs font-semibold uppercase text-vip-blue">Situation</p>
              <p className="mt-2 text-sm font-semibold text-vip-ink">{selected.situation}</p>
            </div>
            <div className="rounded-lg border border-vip-line bg-white p-4">
              <p className="text-xs font-semibold uppercase text-vip-blue">First action</p>
              <p className="mt-2 text-sm font-semibold text-vip-ink">{selected.firstAction}</p>
            </div>
            <div className="rounded-lg border border-vip-line bg-white p-4">
              <p className="text-xs font-semibold uppercase text-vip-blue">Where to ask</p>
              <p className="mt-2 text-sm font-semibold text-vip-ink">{selected.route}</p>
            </div>
          </div>
          <p className="mt-4 rounded-lg border border-vip-line bg-vip-panel p-3 text-sm leading-6 text-vip-muted">
            {selected.note}
          </p>
          <p className="mt-3 text-sm leading-6 text-vip-muted">
            If academic stress affects daily functioning, use official VinUni wellbeing support. VIP keeps this as a
            support route, not a diagnosis or mental health recommendation.
          </p>
        </div>
      </section>

      <section className="vip-panel">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-vip-blue">Template pack</p>
            <h2 className="mt-1 text-lg font-semibold text-vip-ink">Clarification email template</h2>
          </div>
          <button type="button" className="btn-secondary" onClick={copyTemplate}>
            <Copy size={17} aria-hidden="true" />
            Copy
          </button>
        </div>
        <pre className="mt-4 whitespace-pre-wrap rounded-lg border border-vip-line bg-white p-4 text-sm leading-6 text-vip-ink">
          <Mail className="mb-3 inline text-vip-blue" size={18} aria-hidden="true" /> {template}
        </pre>
      </section>
    </div>
  );
}
