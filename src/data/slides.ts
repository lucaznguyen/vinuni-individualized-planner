import type { Slide } from "../types";

const assetPath = (filename: string) => `${import.meta.env.BASE_URL}assets/${filename}`;

export const slides: Slide[] = [
  {
    id: 1,
    title: "VIP - VinUni Individualized Planner",
    eyebrow: "VinUni Wellbeing Changemaker Contest",
    message: "See your load early. Plan your week clearly. Ask the right person.",
    bullets: ["Privacy-first academic wellbeing initiative", "Built for first-year transition", "Student-owned, opt-in, and local-first"],
    visual: "title",
    asset: assetPath("figure_vip.png"),
    time: "0:00-0:45",
    speakerNotes:
      "Open by naming the project and the simple promise: VIP helps students see academic pressure before it becomes overwhelming. Emphasize that it is not a monitoring system. It is a student-owned planner that connects workload visibility to clear next steps."
  },
  {
    id: 2,
    title: "Problem Story",
    message: "First-year students do not struggle because of one task. They struggle when many course tasks silently converge in the same week.",
    bullets: ["Deadlines are scattered across courses", "The total weekly load can stay hidden", "By the time pressure is obvious, planning time is short"],
    visual: "problem",
    asset: assetPath("figure_overview.png"),
    time: "0:45-1:35",
    speakerNotes:
      "Tell the Week 3 story: a quiz, lab, essay, and group milestone each looks reasonable alone, but together they create a heavy week. The gap is early visibility, not student motivation."
  },
  {
    id: 3,
    title: "Key Insight",
    message: "VinUni has support resources. The gap is early visibility and support navigation.",
    bullets: ["Office hours, PASS, advising, and wellbeing support already exist", "Students may not know when to seek help", "They may also be unsure which route fits the problem"],
    visual: "insight",
    time: "1:35-2:20",
    speakerNotes:
      "Position VIP as a bridge. It does not replace instructors, advisors, PASS, or wellbeing support. It helps students decide earlier when to use those routes and how to ask a more specific question."
  },
  {
    id: 4,
    title: "Solution",
    message: "VIP turns syllabus deadlines into a weekly heatmap, load score, action card, and SOS Navigator.",
    bullets: ["Deadline Bank for syllabus tasks", "Academic Load Score with visible rules", "Action Card for the next 24-48 hours", "Navigator for where to ask"],
    visual: "solution",
    asset: assetPath("figure_load_score.png"),
    time: "2:20-3:00",
    speakerNotes:
      "Explain the four outputs. Stress that the score is a transparent heuristic, not AI. The student can see why a week is Green, Yellow, or Red."
  },
  {
    id: 5,
    title: "Live Demo Setup",
    message: "The dashboard is a polished Google-Sheet-like planner owned by the student.",
    bullets: ["No backend, login, tracking, or external database", "Tasks are stored only in the browser", "Students can import/export CSV"],
    visual: "dashboard",
    asset: assetPath("figure_dashboard.png"),
    time: "3:00-3:35",
    speakerNotes:
      "Before showing the demo, set the privacy boundary. The dashboard is not a staff monitoring page. It is a personal planning workspace that students may choose to use."
  },
  {
    id: 6,
    title: "Live Demo",
    message: "Case 1 and Case 2 show the core value: hidden workload becomes visible, then a new task changes the plan immediately.",
    bullets: ["Run Case 1 to show Week 3 workload", "Run Case 2 to add a project milestone", "Show heatmap, score, and action card updating together"],
    visual: "demo",
    time: "3:35-5:55",
    speakerNotes:
      "Walk through the Dashboard. Use Case 1 first, then Case 2. Point out that the student does not just see a warning; the Red Week produces concrete next actions."
  },
  {
    id: 7,
    title: "Academic SOS Navigator",
    message: "The Navigator turns 'I am stuck' into a clear support route.",
    bullets: ["Unclear assignment -> TA or Instructor", "Too many deadlines -> VIP Ambassador or Peer Advisor", "Stress affects daily functioning -> official wellbeing support"],
    visual: "sos",
    asset: assetPath("figure_sos.png"),
    time: "5:55-6:55",
    speakerNotes:
      "Show Case 3. The point is routing, not diagnosis. If a student is unsure about assignment requirements, the next step is a specific question to the TA or instructor."
  },
  {
    id: 8,
    title: "Pilot Plan",
    message: "An 8-week opt-in pilot can test VIP with 50-80 first-year students.",
    bullets: ["4-6 VIP Ambassadors", "Short weekly check-ins", "Mid-pilot refinement", "Aggregated and anonymized reporting"],
    visual: "pilot",
    asset: assetPath("figure_pilot.png"),
    time: "6:55-7:50",
    speakerNotes:
      "Describe the pilot as feasible and bounded. Ambassadors help with setup and routing, but they do not view grades, provide counseling, or monitor students."
  },
  {
    id: 9,
    title: "Impact Metrics",
    message: "VIP measures planning and help-seeking readiness, not GPA or clinical outcomes.",
    bullets: ["Workload visibility and deadline anticipation", "Support route clarity", "Academic control and action readiness", "Engagement and early help-seeking"],
    visual: "metrics",
    time: "7:50-9:00",
    speakerNotes:
      "Make the evaluation credible by focusing on outcomes VIP can plausibly influence in eight weeks. Do not claim that it diagnoses stress or directly improves grades."
  },
  {
    id: 10,
    title: "Closing Ask",
    message: "Approve a low-risk pilot and help connect VIP to first-year support channels.",
    bullets: ["Permission to pilot with volunteers", "Connection with Peer Advisors, SAM, and support teams", "Recruitment support for first-year students"],
    visual: "ask",
    time: "9:00-10:00",
    speakerNotes:
      "End with the promise: every first-year student should be able to say, I know what is coming, I know what to do next, and I know who can help."
  }
];
