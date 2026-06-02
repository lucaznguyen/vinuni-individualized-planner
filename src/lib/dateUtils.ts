export const PILOT_START_DATE = "2026-09-07";
export const PILOT_WEEKS = 8;

const dayMs = 24 * 60 * 60 * 1000;

export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric"
  }).format(parseLocalDate(value));
}

export function getWeekNumber(dueDate: string): number {
  const start = parseLocalDate(PILOT_START_DATE);
  const target = parseLocalDate(dueDate);
  const diff = Math.floor((target.getTime() - start.getTime()) / dayMs);
  return Math.min(PILOT_WEEKS, Math.max(1, Math.floor(diff / 7) + 1));
}

export function getWeekRange(week: number): { start: string; end: string; label: string } {
  const startDate = addDays(parseLocalDate(PILOT_START_DATE), (week - 1) * 7);
  const endDate = addDays(startDate, 6);
  const start = toDateInputValue(startDate);
  const end = toDateInputValue(endDate);

  return {
    start,
    end,
    label: `Week ${week}: ${formatDate(start)}-${formatDate(end)}`
  };
}

export function isDateWithinWeek(dueDate: string, week: number): boolean {
  const range = getWeekRange(week);
  const date = parseLocalDate(dueDate).getTime();
  return date >= parseLocalDate(range.start).getTime() && date <= parseLocalDate(range.end).getTime();
}

export function daysBetween(a: string, b: string): number {
  return Math.abs(parseLocalDate(a).getTime() - parseLocalDate(b).getTime()) / dayMs;
}
