import type { Task } from "../types";

const storageKey = "vip.tasks.v1";

export function loadTasksFromStorage(): Task[] | null {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as Task[]) : null;
  } catch {
    return null;
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

export function clearStoredTasks(): void {
  localStorage.removeItem(storageKey);
}
