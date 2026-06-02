import type { ScoreBreakdown, WeekStatus } from "../types";

const actionMap: Record<WeekStatus, string[]> = {
  Green: ["Maintain routine", "Preview next week", "Start one small task early"],
  Yellow: [
    "Plan early",
    "Block study time",
    "Start the highest-effort task",
    "Check unclear tasks",
    "Attend office hour or PASS if stuck"
  ],
  Red: [
    "Choose the highest-risk task",
    "Block two focused work sessions",
    "Ask one clarification question within 24 hours",
    "Use 48-hour triage",
    "Attend office hour or PASS",
    "Use SOS Navigator if stress or uncertainty continues"
  ]
};

export function getActionsForScore(score: ScoreBreakdown): string[] {
  return actionMap[score.status];
}

export function getActionSummary(score: ScoreBreakdown): string {
  if (score.status === "Red") {
    return "Act in the next 24-48 hours and route one blocker to the right support channel.";
  }
  if (score.status === "Yellow") {
    return "Plan early and resolve uncertainty before deadlines cluster.";
  }
  return "Keep the routine steady and preview the next week.";
}

export function getClarificationTemplate(course = "Course", task = "Assignment"): string {
  return `Subject: Clarification question about ${task}

Dear TA/Instructor,

I am working on ${task} for ${course}. I have checked the syllabus and instructions, but I am unsure about one requirement:

[Write one specific question here.]

Could you please clarify the expected next step or requirement?

Thank you,
[Your name]`;
}
