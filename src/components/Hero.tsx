import { ShieldCheck, TableProperties } from "lucide-react";

const dashboardFigure = `${import.meta.env.BASE_URL}assets/figure_dashboard.png`;

interface HeroProps {
  onOpenDashboard: () => void;
}

export default function Hero({ onOpenDashboard }: HeroProps) {
  return (
    <div className="space-y-8">
      <section className="grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-lg border border-vip-line bg-vip-panel px-3 py-2 text-sm font-medium text-vip-blue">
            <ShieldCheck size={16} aria-hidden="true" />
            Privacy-first, opt-in, no backend
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-vip-ink md:text-5xl">
              VIP - VinUni Individualized Planner
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-vip-muted">
              See your load early. Plan your week clearly. Ask the right person.
            </p>
            <p className="max-w-3xl text-base leading-7 text-vip-muted">
              VIP helps first-year students turn scattered syllabus deadlines into a local planner with a weekly
              workload heatmap, Academic Load Score, action cards, and an Academic SOS Navigator.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn-primary" onClick={onOpenDashboard}>
              <TableProperties size={18} aria-hidden="true" />
              Open prototype
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-vip-line bg-vip-panel shadow-sheet">
          <img
            src={dashboardFigure}
            alt="VIP dashboard mockup from the proposal"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Student-owned",
            body: "Tasks are stored only in the browser. Students choose what to enter and when to export it."
          },
          {
            title: "Transparent",
            body: "The load score uses visible point rules for task size, clustering, effort, and clarity risk."
          },
          {
            title: "Actionable",
            body: "Every Yellow or Red week produces next steps and a support route, not just a warning."
          }
        ].map((item) => (
          <article key={item.title} className="vip-panel">
            <h2 className="text-lg font-semibold text-vip-blue">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-vip-muted">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="vip-panel lg:col-span-2">
          <h2 className="text-xl font-semibold text-vip-ink">What VIP is and is not</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-vip-line bg-white p-4">
              <p className="text-sm font-semibold text-vip-blue">VIP is</p>
              <p className="mt-2 text-sm leading-6 text-vip-muted">
                A privacy-first academic planning and support-navigation tool for first-year undergraduate students.
              </p>
            </div>
            <div className="rounded-lg border border-vip-line bg-white p-4">
              <p className="text-sm font-semibold text-vip-red">VIP is not</p>
              <p className="mt-2 text-sm leading-6 text-vip-muted">
                A diagnostic, surveillance, grading, counseling-replacement, or staff monitoring system.
              </p>
            </div>
          </div>
        </div>
        <div className="vip-panel">
          <h2 className="text-xl font-semibold text-vip-ink">Pilot frame</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-vip-line pb-2">
              <dt className="text-vip-muted">Duration</dt>
              <dd className="font-semibold">8 weeks</dd>
            </div>
            <div className="flex items-center justify-between border-b border-vip-line pb-2">
              <dt className="text-vip-muted">Participants</dt>
              <dd className="font-semibold">50-80 opt-in students</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-vip-muted">Ambassadors</dt>
              <dd className="font-semibold">4-6</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
