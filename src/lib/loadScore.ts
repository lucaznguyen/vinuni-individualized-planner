import type { ScoreBreakdown, Task, TaskType, EffortLevel, WeekStatus } from "../types";
import { daysBetween, getWeekNumber, getWeekRange } from "./dateUtils";

const taskTypePoints: Record<TaskType, number> = {
  Small: 1,
  Medium: 2,
  Large: 3
};

const effortPoints: Record<EffortLevel, number> = {
  Low: 0,
  Medium: 1,
  High: 2
};

export function getStatus(total: number): WeekStatus {
  if (total >= 9) return "Red";
  if (total >= 5) return "Yellow";
  return "Green";
}

export function getStatusDescription(status: WeekStatus): string {
  if (status === "Red") return "High-load week. Act within 24-48 hours.";
  if (status === "Yellow") return "Heavy week. Plan early.";
  return "Manageable week. Maintain routine.";
}

export function getStatusClasses(status: WeekStatus): string {
  if (status === "Red") return "border-vip-red bg-red-50 text-vip-red";
  if (status === "Yellow") return "border-vip-yellow bg-yellow-50 text-vip-yellow";
  return "border-vip-green bg-green-50 text-vip-green";
}

export function calculateWeekScore(tasks: Task[], week: number): ScoreBreakdown {
  const weekTasks = tasks.filter((task) => getWeekNumber(task.dueDate) === week);
  const activeTasks = weekTasks.filter((task) => !task.completed);
  const completedTaskCount = weekTasks.length - activeTasks.length;
  const clusterNotes: string[] = [];

  const assessmentLoad = activeTasks.reduce((sum, task) => sum + taskTypePoints[task.taskType], 0);
  const expectedEffort = activeTasks.reduce((sum, task) => sum + effortPoints[task.effort], 0);
  const clarityRisk = Math.min(
    2,
    activeTasks.filter((task) => task.clarity === "Unclear").length
  );

  let hasTwoWithin48 = false;
  let hasThreeWithin72 = false;
  const sortedDates = activeTasks
    .map((task) => task.dueDate)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  for (let i = 0; i < sortedDates.length; i += 1) {
    for (let j = i + 1; j < sortedDates.length; j += 1) {
      if (daysBetween(sortedDates[i], sortedDates[j]) <= 2) {
        hasTwoWithin48 = true;
      }
    }
  }

  for (let i = 0; i < sortedDates.length; i += 1) {
    for (let j = i + 2; j < sortedDates.length; j += 1) {
      if (daysBetween(sortedDates[i], sortedDates[j]) <= 3) {
        hasThreeWithin72 = true;
      }
    }
  }

  let clustering = 0;
  if (hasTwoWithin48) {
    clustering += 2;
    clusterNotes.push("Two deadlines fall within 48 hours.");
  }
  if (hasThreeWithin72) {
    clustering += 3;
    clusterNotes.push("Three or more deadlines fall within 72 hours.");
  }

  const total = assessmentLoad + clustering + expectedEffort + clarityRisk;
  const status = getStatus(total);
  const weekLabel = getWeekRange(week).label;
  const highestRiskTask = [...activeTasks].sort((a, b) => taskRisk(b) - taskRisk(a))[0];

  return {
    week,
    weekLabel,
    total,
    status,
    assessmentLoad,
    clustering,
    expectedEffort,
    clarityRisk,
    activeTaskCount: activeTasks.length,
    completedTaskCount,
    clusterNotes,
    tasks: weekTasks,
    highestRiskTask
  };
}

export function calculateAllWeeks(tasks: Task[]): ScoreBreakdown[] {
  return Array.from({ length: 8 }, (_, index) => calculateWeekScore(tasks, index + 1));
}

function taskRisk(task: Task): number {
  return taskTypePoints[task.taskType] + effortPoints[task.effort] + (task.clarity === "Unclear" ? 1 : 0);
}
