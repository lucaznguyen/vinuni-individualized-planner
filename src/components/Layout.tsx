import { BarChart3, HelpCircle, LayoutDashboard, LineChart, MonitorPlay } from "lucide-react";
import type { ReactNode } from "react";

export type TabId = "overview" | "dashboard" | "demo" | "sos" | "metrics";

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "demo", label: "Demo Cases", icon: MonitorPlay },
  { id: "sos", label: "SOS Navigator", icon: HelpCircle },
  { id: "metrics", label: "Pilot & Metrics", icon: LineChart }
];

interface LayoutProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  children: ReactNode;
}

export default function Layout({ activeTab, onTabChange, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white text-vip-ink">
      <header className="sticky top-0 z-40 border-b border-vip-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <button
            type="button"
            className="flex items-center gap-3 text-left"
            onClick={() => onTabChange("overview")}
            aria-label="Open overview"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-vip-blue text-sm font-bold text-white">
              VIP
            </span>
            <span>
              <span className="block text-sm font-semibold text-vip-blue">VinUni Individualized Planner</span>
              <span className="block text-xs text-vip-muted">Student-owned workload visibility prototype</span>
            </span>
          </button>

          <nav className="flex gap-2 overflow-x-auto pb-1 lg:pb-0" aria-label="Main navigation">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "border-vip-blue bg-vip-blue text-white"
                      : "border-vip-line bg-white text-vip-muted hover:border-vip-blue hover:text-vip-blue"
                  }`}
                  onClick={() => onTabChange(tab.id)}
                >
                  <Icon aria-hidden="true" size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
