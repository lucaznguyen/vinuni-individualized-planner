import type { ClarityLevel, EffortLevel, Task, TaskType, WeightLevel } from "../types";

export const csvColumns = [
  "id",
  "course",
  "task",
  "dueDate",
  "taskType",
  "effort",
  "clarity",
  "weight",
  "completed"
];

const validTaskTypes: TaskType[] = ["Small", "Medium", "Large"];
const validEfforts: EffortLevel[] = ["Low", "Medium", "High"];
const validClarity: ClarityLevel[] = ["Clear", "Unclear"];
const validWeights: WeightLevel[] = ["", "Low", "Medium", "High"];

export function tasksToCsv(tasks: Task[]): string {
  const rows = tasks.map((task) =>
    csvColumns.map((column) => escapeCell(String(task[column as keyof Task] ?? ""))).join(",")
  );

  return [csvColumns.join(","), ...rows].join("\n");
}

export function parseTasksCsv(csv: string): { tasks: Task[]; error?: string } {
  const rows = parseCsvRows(csv.trim());
  if (rows.length < 2) {
    return { tasks: [], error: "CSV must include a header row and at least one task." };
  }

  const header = rows[0].map((cell) => cell.trim());
  const missing = csvColumns.filter((column) => !header.includes(column));
  if (missing.length > 0) {
    return { tasks: [], error: `Missing required columns: ${missing.join(", ")}.` };
  }

  const tasks: Task[] = [];
  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    if (row.every((cell) => cell.trim() === "")) continue;
    const record = Object.fromEntries(header.map((column, index) => [column, row[index] ?? ""]));
    const taskType = record.taskType as TaskType;
    const effort = record.effort as EffortLevel;
    const clarity = record.clarity as ClarityLevel;
    const weight = record.weight as WeightLevel;

    if (!record.course || !record.task || !record.dueDate) {
      return { tasks: [], error: `Row ${rowIndex + 1} must include course, task, and dueDate.` };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(record.dueDate)) {
      return { tasks: [], error: `Row ${rowIndex + 1} has an invalid dueDate. Use YYYY-MM-DD.` };
    }
    if (!validTaskTypes.includes(taskType)) {
      return { tasks: [], error: `Row ${rowIndex + 1} has an invalid taskType.` };
    }
    if (!validEfforts.includes(effort)) {
      return { tasks: [], error: `Row ${rowIndex + 1} has an invalid effort.` };
    }
    if (!validClarity.includes(clarity)) {
      return { tasks: [], error: `Row ${rowIndex + 1} has an invalid clarity value.` };
    }
    if (!validWeights.includes(weight) && Number.isNaN(Number(record.weight))) {
      return { tasks: [], error: `Row ${rowIndex + 1} has an invalid weight.` };
    }

    tasks.push({
      id: record.id || crypto.randomUUID(),
      course: record.course,
      task: record.task,
      dueDate: record.dueDate,
      taskType,
      effort,
      clarity,
      weight: record.weight ? weight || Number(record.weight) : "",
      completed: record.completed.toLowerCase() === "true"
    });
  }

  return { tasks };
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCell(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function parseCsvRows(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let insideQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === '"' && insideQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);
  return rows;
}
