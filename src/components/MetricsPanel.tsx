import { BarChart3, CalendarDays, CheckCircle2, ShieldCheck, Users, type LucideIcon } from "lucide-react";

const metrics = [
  ["Workload visibility", "Can identify heavy weeks in advance", "+0.5 on 1-5 scale"],
  ["Support route clarity", "Knows who to ask when stuck", "+0.5 on 1-5 scale"],
  ["Academic control", "Feels in control of weekly study plan", "+0.5 on 1-5 scale"],
  ["Action readiness", "Knows what to do in the next 48 hours", "+0.5 on 1-5 scale"],
  ["Deadline anticipation", "Rarely surprised by deadlines", "+0.5 on 1-5 scale"],
  ["Weekly engagement", "Completes at least 4 of 8 check-ins", ">= 60%"],
  ["Action card use", "Uses action cards at least three times", ">= 60%"],
  ["Early help-seeking", "Contacts support before deadline", "+15-25%"],
  ["Clarification behavior", "Asks a question within 48 hours", ">= 50%"]
];

const timeline = [
  ["Weeks 0-1", "Recruit volunteers, brief Ambassadors, set up VIP Sheets, collect baseline survey"],
  ["Weeks 2-3", "Students use heatmap, action card, and SOS Navigator during real academic weeks"],
  ["Weeks 4-6", "Ambassadors run planning drop-ins and collect usability feedback"],
  ["Weeks 7-8", "Run route quiz, post-survey, impact report, and scale-up recommendation"]
];

const pilotStats: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "8 weeks", label: "Pilot duration", icon: CalendarDays },
  { value: "50-80", label: "Opt-in first-year students", icon: Users },
  { value: "4-6", label: "VIP Ambassadors", icon: CheckCircle2 },
  { value: "0", label: "Grades, GPA, clinical data", icon: ShieldCheck }
];

export default function MetricsPanel() {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-vip-line bg-vip-panel p-5">
        <p className="text-sm font-semibold uppercase text-vip-blue">Pilot and evaluation</p>
        <h1 className="mt-1 text-2xl font-semibold text-vip-ink">8-week privacy-first pilot</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-vip-muted">
          The pilot measures workload visibility, support navigation, academic control, action readiness, engagement,
          and early help-seeking. It does not collect grades, GPA, counseling records, clinical data, or private Canvas
          analytics.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {pilotStats.map(({ value, label, icon: Icon }) => (
          <article key={label} className="vip-panel">
            <Icon className="text-vip-blue" size={22} aria-hidden="true" />
            <p className="mt-4 text-3xl font-semibold text-vip-blue">{value}</p>
            <p className="mt-1 text-sm text-vip-muted">{label}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="vip-panel">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-vip-blue" size={20} aria-hidden="true" />
            <h2 className="text-lg font-semibold text-vip-ink">Pilot timeline</h2>
          </div>
          <div className="mt-5 space-y-4">
            {timeline.map(([period, body]) => (
              <div key={period} className="grid grid-cols-[88px_1fr] gap-3">
                <div className="text-sm font-semibold text-vip-blue">{period}</div>
                <div className="border-l border-vip-line pb-4 pl-4">
                  <p className="text-sm leading-6 text-vip-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="vip-panel">
          <div className="flex items-center gap-2">
            <BarChart3 className="text-vip-blue" size={20} aria-hidden="true" />
            <h2 className="text-lg font-semibold text-vip-ink">Impact metrics</h2>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {metrics.map(([title, body, target]) => (
              <div key={title} className="rounded-lg border border-vip-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-vip-ink">{title}</h3>
                  <span className="shrink-0 rounded-md bg-vip-panel px-2 py-1 text-xs font-semibold text-vip-blue">
                    {target}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-vip-muted">{body}</p>
                <div className="mt-3 h-2 rounded-full bg-vip-panel">
                  <div className="h-2 rounded-full bg-vip-blue" style={{ width: target.includes("0.5") ? "58%" : "68%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
