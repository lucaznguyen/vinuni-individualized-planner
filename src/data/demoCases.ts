import type { DemoCase, Task } from "../types";

const caseOneTasks: Task[] = [
  {
    id: "case1-ds",
    course: "Data Structures",
    task: "Lab Checkpoint",
    dueDate: "2026-09-21",
    taskType: "Medium",
    effort: "High",
    clarity: "Clear",
    weight: "Medium",
    completed: false
  },
  {
    id: "case1-calculus",
    course: "Calculus",
    task: "Problem Set",
    dueDate: "2026-09-24",
    taskType: "Medium",
    effort: "Medium",
    clarity: "Clear",
    weight: "Medium",
    completed: false
  },
  {
    id: "case1-physics",
    course: "Physics",
    task: "Short Quiz",
    dueDate: "2026-09-27",
    taskType: "Small",
    effort: "Low",
    clarity: "Clear",
    weight: "Low",
    completed: false
  },
  {
    id: "case1-writing",
    course: "Writing Seminar",
    task: "Reflection Paragraph",
    dueDate: "2026-10-01",
    taskType: "Small",
    effort: "Medium",
    clarity: "Clear",
    weight: "Low",
    completed: false
  }
];

const caseTwoTasks: Task[] = [
  ...caseOneTasks.slice(0, 3),
  {
    id: "case2-reading",
    course: "Business/Economics",
    task: "Reading Response",
    dueDate: "2026-09-30",
    taskType: "Small",
    effort: "Low",
    clarity: "Clear",
    weight: "Low",
    completed: false
  },
  {
    id: "case2-milestone",
    course: "Foundations Project",
    task: "Project Milestone",
    dueDate: "2026-09-24",
    taskType: "Large",
    effort: "High",
    clarity: "Clear",
    weight: "High",
    completed: false
  }
];

const caseThreeTasks: Task[] = [
  {
    id: "case3-writing",
    course: "Writing Seminar",
    task: "Writing Reflection Essay",
    dueDate: "2026-09-24",
    taskType: "Medium",
    effort: "Medium",
    clarity: "Unclear",
    weight: "Medium",
    completed: false
  },
  {
    id: "case3-ds",
    course: "Data Structures",
    task: "Lab Debugging Check",
    dueDate: "2026-09-25",
    taskType: "Medium",
    effort: "High",
    clarity: "Clear",
    weight: "Medium",
    completed: false
  },
  {
    id: "case3-physics",
    course: "Physics",
    task: "Formula Practice Quiz",
    dueDate: "2026-09-27",
    taskType: "Small",
    effort: "Medium",
    clarity: "Clear",
    weight: "Low",
    completed: false
  }
];

export const demoCases: DemoCase[] = [
  {
    id: "hidden-workload",
    title: "Case 1 - Hidden workload becomes visible",
    scenario:
      "A first-year student has deadlines across four courses. Individually they look manageable, but Week 3 becomes a heavy planning signal.",
    flow: [
      "Show the deadline table.",
      "Open the weekly heatmap.",
      "Read the score explanation.",
      "Use the action card as the next-step plan."
    ],
    tasks: caseOneTasks,
    selectedWeek: 3
  },
  {
    id: "add-task-red-week",
    title: "Case 2 - Add Task live demo",
    scenario:
      "Adding a new Project Milestone due in Week 3 pushes the week into Red and changes the action card immediately.",
    flow: [
      "Click Run demo.",
      "Open the Dashboard tab.",
      "Show the new Project Milestone in the deadline bank.",
      "Point to the Red Week score and Red Week action card."
    ],
    tasks: caseTwoTasks,
    selectedWeek: 3
  },
  {
    id: "unclear-assignment",
    title: "Case 3 - Unclear assignment and support route",
    scenario:
      "Marking the Writing Reflection Essay as Unclear increases the score and routes the student to TA or instructor support.",
    flow: [
      "Show Writing Reflection Essay marked Unclear.",
      "Show the clarity-risk point in the score.",
      "Open SOS Navigator.",
      "Show the TA/Instructor route and clarification email template."
    ],
    tasks: caseThreeTasks,
    selectedWeek: 3
  }
];
