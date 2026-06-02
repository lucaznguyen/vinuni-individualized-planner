import { ChevronLeft, ChevronRight, Maximize2, Printer, StickyNote, X } from "lucide-react";
import { useEffect, useState } from "react";
import SpeakerNotes from "./SpeakerNotes";
import { slides } from "../data/slides";

function visualLabel(visual: string): string {
  const labels: Record<string, string> = {
    title: "Student-owned planner",
    problem: "Hidden workload",
    insight: "Support bridge",
    solution: "Heatmap + score + action",
    dashboard: "Local dashboard",
    demo: "Live demo flow",
    sos: "Support routing",
    pilot: "8-week pilot",
    metrics: "Impact metrics",
    ask: "Pilot ask"
  };
  return labels[visual] ?? visual;
}

export default function PitchDeck() {
  const [index, setIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [printView, setPrintView] = useState(false);
  const slide = slides[index];

  const next = () => setIndex((current) => Math.min(slides.length - 1, current + 1));
  const previous = () => setIndex((current) => Math.max(0, current - 1));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
      if (event.key.toLowerCase() === "n") setShowNotes((current) => !current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (printView) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between rounded-lg border border-vip-line bg-vip-panel p-4">
          <h1 className="text-xl font-semibold text-vip-ink">Printable Pitch Deck</h1>
          <button type="button" className="btn-secondary" onClick={() => setPrintView(false)}>
            <X size={17} aria-hidden="true" />
            Close print view
          </button>
        </div>
        {slides.map((item) => (
          <article key={item.id} className="rounded-lg border border-vip-line bg-white p-6 shadow-sheet print:break-after-page">
            <p className="text-sm font-semibold uppercase text-vip-blue">
              Slide {item.id} | {item.time}
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-vip-ink">{item.title}</h2>
            <p className="mt-4 text-lg leading-8 text-vip-muted">{item.message}</p>
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-vip-muted">
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-6 text-vip-muted">
              <span className="font-semibold text-vip-ink">Notes: </span>
              {item.speakerNotes}
            </p>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <section className="flex flex-col gap-3 rounded-lg border border-vip-line bg-vip-panel p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-vip-blue">10-minute pitch deck</p>
          <h1 className="mt-1 text-2xl font-semibold text-vip-ink">Pitch Deck</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-secondary" onClick={() => setShowNotes((current) => !current)}>
            <StickyNote size={17} aria-hidden="true" />
            {showNotes ? "Hide notes" : "Show notes"}
          </button>
          <button type="button" className="btn-secondary" onClick={() => setPrintView(true)}>
            <Printer size={17} aria-hidden="true" />
            Print view
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => document.documentElement.requestFullscreen?.()}
          >
            <Maximize2 size={17} aria-hidden="true" />
            Fullscreen
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <article className="min-h-[620px] rounded-lg border border-vip-line bg-white p-6 shadow-sheet md:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold uppercase text-vip-blue">
              Slide {slide.id} of {slides.length} | {slide.time}
            </p>
            <p className="rounded-lg bg-vip-panel px-3 py-2 text-sm font-semibold text-vip-blue">{visualLabel(slide.visual)}</p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              {slide.eyebrow && <p className="text-sm font-semibold uppercase text-vip-blue">{slide.eyebrow}</p>}
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-vip-ink md:text-5xl">{slide.title}</h2>
              <p className="mt-5 text-xl leading-9 text-vip-muted">{slide.message}</p>
              <ul className="mt-7 space-y-3 text-base leading-7 text-vip-muted">
                {slide.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-vip-blue" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-vip-line bg-vip-panel p-4">
              {slide.asset ? (
                <img src={slide.asset} alt="" className="max-h-[360px] w-full rounded-lg object-contain" />
              ) : (
                <div className="flex min-h-72 items-center justify-center rounded-lg border border-vip-line bg-white p-6 text-center">
                  <p className="max-w-xs text-2xl font-semibold leading-9 text-vip-blue">{visualLabel(slide.visual)}</p>
                </div>
              )}
            </div>
          </div>
        </article>

        <div className="space-y-4">
          {showNotes && <SpeakerNotes notes={slide.speakerNotes} time={slide.time} />}
          <div className="vip-panel">
            <div className="flex items-center justify-between gap-3">
              <button type="button" className="btn-secondary" onClick={previous} disabled={index === 0}>
                <ChevronLeft size={17} aria-hidden="true" />
                Previous
              </button>
              <button type="button" className="btn-primary" onClick={next} disabled={index === slides.length - 1}>
                Next
                <ChevronRight size={17} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-4 text-sm leading-6 text-vip-muted">
              Keyboard: Left/Right to move slides. N toggles presenter notes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
