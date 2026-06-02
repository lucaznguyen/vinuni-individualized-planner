export type TaskType = "Small" | "Medium" | "Large";
export type EffortLevel = "Low" | "Medium" | "High";
export type ClarityLevel = "Clear" | "Unclear";
export type WeightLevel = "" | "Low" | "Medium" | "High";
export type WeekStatus = "Green" | "Yellow" | "Red";

export interface Task {
  id: string;
  course: string;
  task: string;
  dueDate: string;
  taskType: TaskType;
  effort: EffortLevel;
  clarity: ClarityLevel;
  weight?: number | WeightLevel;
  completed: boolean;
}

export interface ScoreBreakdown {
  week: number;
  weekLabel: string;
  total: number;
  status: WeekStatus;
  assessmentLoad: number;
  clustering: number;
  expectedEffort: number;
  clarityRisk: number;
  activeTaskCount: number;
  completedTaskCount: number;
  clusterNotes: string[];
  tasks: Task[];
  highestRiskTask?: Task;
}

export interface DemoCase {
  id: string;
  title: string;
  scenario: string;
  flow: string[];
  tasks: Task[];
  selectedWeek: number;
}

export interface Slide {
  id: number;
  title: string;
  eyebrow?: string;
  message: string;
  bullets: string[];
  visual: "title" | "problem" | "insight" | "solution" | "dashboard" | "demo" | "sos" | "pilot" | "metrics" | "ask";
  asset?: string;
  speakerNotes: string;
  time: string;
}
