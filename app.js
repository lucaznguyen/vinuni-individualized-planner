const STORAGE_KEY = "vipPlannerStateV1";
const THEME_KEY = "vipPlannerTheme";

const TYPE_SCORES = {
  "Small task": 1,
  "Medium task": 2,
  "Large task": 3,
};

const SOS_ROUTES = {
  unclear: {
    label: "Assignment unclear",
    hint: "The requirement is vague.",
    icon: "✉️",
    firstAction: "Write one specific clarification question before asking for help.",
    route: "TA or instructor",
    template: "clarification",
  },
  deadlines: {
    label: "Too many deadlines",
    hint: "Several tasks are close together.",
    icon: "⏱️",
    firstAction: "Use a 48-hour triage and choose the highest-risk task first.",
    route: "VIP Ambassador or Peer Advisor",
    template: "planner",
  },
  start: {
    label: "Do not know how to start",
    hint: "The first step is unclear.",
    icon: "🧩",
    firstAction: "Try one small step, then bring the exact blocker to support.",
    route: "Office hour or PASS",
    template: "officeHour",
  },
  behind: {
    label: "Behind across courses",
    hint: "Multiple courses feel out of sync.",
    icon: "🎓",
    firstAction: "Book an academic planning conversation and bring your deadline bank.",
    route: "Professional or Faculty Advisor",
    template: "planner",
  },
  wellbeing: {
    label: "Stress affects daily functioning",
    hint: "Academic pressure is affecting daily life.",
    icon: "🤝",
    firstAction: "Use official wellbeing support and do not handle it alone.",
    route: "Health & Well-Being Center or Peer Support Group",
    template: "priority",
  },
};

const TEMPLATES = {
  clarification: {
    label: "Clarification Email",
    text: `Subject: Clarification on [assignment / task name]

Dear [TA / Instructor Name],

I am working on [assignment / task name] for [course code]. I have checked the syllabus and the assignment instructions, but I am still unsure about one point:

My question: [write one specific question]

What I have tried so far:
- [Step 1 you already tried]
- [Step 2 you already tried]

Could you please clarify what is expected for this part?

Thank you,
[Your name]`,
  },
  officeHour: {
    label: "Office-Hour Script",
    text: `Before the office hour:
1. Bring the assignment prompt, your attempt, and one specific question.
2. Mark the exact line, concept, or step where you got stuck.
3. Decide what answer you need before leaving.

During the office hour:
"I am working on [task]. I tried [your attempt]. I got stuck at [specific blocker]. Could you help me understand the next step?"

After the office hour:
- Write down the answer in your own words.
- Update your deadline bank.
- Schedule the next focused work block.`,
  },
  planner: {
    label: "48-Hour Planner",
    text: `48-Hour Academic Triage

1. List the next 3 deadlines.
   - Deadline 1:
   - Deadline 2:
   - Deadline 3:

2. Choose the highest-risk task.
   Consider: due date, task size, effort hours, and clarity.

3. Block two focused sessions.
   - Session 1: [date/time] — goal: [specific output]
   - Session 2: [date/time] — goal: [specific output]

4. Ask one question within 24 hours if a task is unclear.

5. Protect one buffer slot.
   Use it for unexpected fixes, group work delays, or review.`,
  },
  priority: {
    label: "Priority Matrix",
    text: `Priority Matrix

Urgent + Important:
- Due soon, high weight, or blocking other work.
- Do first. Create a concrete output today.

Important + Not Urgent:
- Major tasks due later.
- Schedule focused sessions now before they become urgent.

Urgent + Less Important:
- Small admin tasks or quick submissions.
- Batch them into one short block.

Not Urgent + Less Important:
- Optional polish or low-value tasks.
- Do only after protecting core deadlines and wellbeing routines.`,
  },
};

const PILOT_TIMELINE = [
  { week: "Week 0", title: "Recruit", text: "Invite opt-in first-year participants and prepare onboarding materials." },
  { week: "Week 1", title: "Setup Sheet", text: "Students create their VIP sheet and enter syllabus-based deadlines." },
  { week: "Week 2", title: "First Heatmap", text: "Students view their first workload heatmap during a real academic week." },
  { week: "Week 3", title: "SOS Navigator", text: "Students use routes when they are unsure who to ask." },
  { week: "Week 4", title: "Feedback", text: "Collect usability notes and check whether the levels are clear." },
  { week: "Week 5", title: "Red/Yellow Actions", text: "Practice action cards, 48-hour triage, and clarification behavior." },
  { week: "Week 6", title: "Refine", text: "Adjust wording, layout, and scoring explanations while the pilot runs." },
  { week: "Weeks 7–8", title: "Impact Report", text: "Run route quiz, post-survey, and summarize anonymized results." },
];

let state = loadState();
let toastTimeout = null;

const els = {
  themeToggle: document.querySelector("#themeToggle"),
  mobileMenu: document.querySelector("#mobileMenu"),
  navLinks: document.querySelector("#navLinks"),
  heroWeekLabel: document.querySelector("#heroWeekLabel"),
  heroLevelPill: document.querySelector("#heroLevelPill"),
  heroHeatmapMini: document.querySelector("#heroHeatmapMini"),
  heroActionText: document.querySelector("#heroActionText"),
  heroOpenCount: document.querySelector("#heroOpenCount"),
  heroNextDue: document.querySelector("#heroNextDue"),
  kpiWeekLevel: document.querySelector("#kpiWeekLevel"),
  kpiWeekSummary: document.querySelector("#kpiWeekSummary"),
  kpiOpenDeadlines: document.querySelector("#kpiOpenDeadlines"),
  kpiOpenSummary: document.querySelector("#kpiOpenSummary"),
  kpiNextDue: document.querySelector("#kpiNextDue"),
  kpiNextDueSummary: document.querySelector("#kpiNextDueSummary"),
  kpiRoute: document.querySelector("#kpiRoute"),
  weeklyHeatmap: document.querySelector("#weeklyHeatmap"),
  actionLevelPill: document.querySelector("#actionLevelPill"),
  selectedWeekLabel: document.querySelector("#selectedWeekLabel"),
  selectedWeekSignals: document.querySelector("#selectedWeekSignals"),
  loadMeter: document.querySelector("#loadMeter"),
  loadMeterLabel: document.querySelector("#loadMeterLabel"),
  actionList: document.querySelector("#actionList"),
  copyActionBtn: document.querySelector("#copyActionBtn"),
  taskForm: document.querySelector("#taskForm"),
  taskId: document.querySelector("#taskId"),
  courseInput: document.querySelector("#courseInput"),
  taskInput: document.querySelector("#taskInput"),
  dueInput: document.querySelector("#dueInput"),
  typeInput: document.querySelector("#typeInput"),
  effortInput: document.querySelector("#effortInput"),
  clarityInput: document.querySelector("#clarityInput"),
  statusInput: document.querySelector("#statusInput"),
  submitTaskBtn: document.querySelector("#submitTaskBtn"),
  deadlineSearch: document.querySelector("#deadlineSearch"),
  statusFilter: document.querySelector("#statusFilter"),
  deadlineTableBody: document.querySelector("#deadlineTableBody"),
  exportCsvBtn: document.querySelector("#exportCsvBtn"),
  resetDemoBtn: document.querySelector("#resetDemoBtn"),
  scrollToAddTask: document.querySelector("#scrollToAddTask"),
  sosOptions: document.querySelector("#sosOptions"),
  sosResult: document.querySelector("#sosResult"),
  copySosBtn: document.querySelector("#copySosBtn"),
  templateTabs: document.querySelector("#templateTabs"),
  templateTitle: document.querySelector("#templateTitle"),
  templateBody: document.querySelector("#templateBody"),
  copyTemplateBtn: document.querySelector("#copyTemplateBtn"),
  downloadTemplatePackBtn: document.querySelector("#downloadTemplatePackBtn"),
  pilotTimeline: document.querySelector("#pilotTimeline"),
  toast: document.querySelector("#toast"),
};

init();

function init() {
  applyTheme(getInitialTheme());
  setDefaultDueDate();
  renderAll();
  attachEvents();
  setupRevealAnimation();
}

function loadState() {
  const fallback = {
    deadlines: makeSampleDeadlines(),
    selectedWeekStart: toISODate(getMonday(new Date())),
    sosKey: "deadlines",
    templateKey: "clarification",
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.deadlines)) return fallback;
    return {
      deadlines: parsed.deadlines.map(normalizeDeadline).filter(Boolean),
      selectedWeekStart: parsed.selectedWeekStart || fallback.selectedWeekStart,
      sosKey: parsed.sosKey || fallback.sosKey,
      templateKey: parsed.templateKey || fallback.templateKey,
    };
  } catch (error) {
    console.warn("Could not load saved VIP data.", error);
    return fallback;
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Could not save VIP data.", error);
  }
}

function normalizeDeadline(item) {
  if (!item || !item.due || !item.task) return null;
  return {
    id: item.id || cryptoId(),
    course: String(item.course || "COURSE").trim().slice(0, 32),
    task: String(item.task || "Untitled task").trim().slice(0, 100),
    due: item.due,
    type: TYPE_SCORES[item.type] ? item.type : "Medium task",
    effort: clamp(Number(item.effort) || 3, 1, 20),
    clarity: ["Clear", "Partly clear", "Unclear"].includes(item.clarity) ? item.clarity : "Clear",
    status: ["Open", "In progress", "Done"].includes(item.status) ? item.status : "Open",
  };
}

function makeSampleDeadlines() {
  const monday = getMonday(new Date());
  return [
    {
      id: cryptoId(),
      course: "ECON101",
      task: "Reading response",
      due: toISODate(addDays(monday, 1)),
      type: "Small task",
      effort: 2,
      clarity: "Clear",
      status: "Done",
    },
    {
      id: cryptoId(),
      course: "MATH102",
      task: "Problem Set 2",
      due: toISODate(addDays(monday, 3)),
      type: "Medium task",
      effort: 5,
      clarity: "Partly clear",
      status: "In progress",
    },
    {
      id: cryptoId(),
      course: "WRIT101",
      task: "Essay outline",
      due: toISODate(addDays(monday, 4)),
      type: "Medium task",
      effort: 4,
      clarity: "Unclear",
      status: "Open",
    },
    {
      id: cryptoId(),
      course: "COMP101",
      task: "Lab report",
      due: toISODate(addDays(monday, 9)),
      type: "Medium task",
      effort: 5,
      clarity: "Clear",
      status: "Open",
    },
    {
      id: cryptoId(),
      course: "STAT101",
      task: "Quiz 3",
      due: toISODate(addDays(monday, 10)),
      type: "Small task",
      effort: 3,
      clarity: "Clear",
      status: "Open",
    },
    {
      id: cryptoId(),
      course: "HIST101",
      task: "Group milestone",
      due: toISODate(addDays(monday, 11)),
      type: "Large task",
      effort: 8,
      clarity: "Unclear",
      status: "Open",
    },
    {
      id: cryptoId(),
      course: "BIO101",
      task: "Midterm preparation",
      due: toISODate(addDays(monday, 16)),
      type: "Large task",
      effort: 9,
      clarity: "Clear",
      status: "Open",
    },
  ];
}

function attachEvents() {
  els.themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (error) {
      console.warn("Could not save theme.", error);
    }
  });

  els.mobileMenu.addEventListener("click", () => {
    const isOpen = els.mobileMenu.getAttribute("aria-expanded") === "true";
    setMobileMenu(!isOpen);
  });

  els.navLinks.addEventListener("click", (event) => {
    if (event.target.matches("a")) setMobileMenu(false);
  });

  els.weeklyHeatmap.addEventListener("click", (event) => {
    const target = event.target.closest("[data-week-start]");
    if (!target) return;
    state.selectedWeekStart = target.dataset.weekStart;
    saveState();
    renderAll();
  });

  els.taskForm.addEventListener("submit", handleTaskSubmit);
  els.deadlineTableBody.addEventListener("click", handleDeadlineTableClick);
  els.deadlineSearch.addEventListener("input", renderDeadlineTable);
  els.statusFilter.addEventListener("change", renderDeadlineTable);

  els.exportCsvBtn.addEventListener("click", () => {
    downloadFile("vip-deadline-bank.csv", deadlinesToCsv(state.deadlines), "text/csv;charset=utf-8");
    showToast("Deadline CSV exported.");
  });

  els.resetDemoBtn.addEventListener("click", () => {
    const ok = window.confirm("Reset the local demo data to the default sample deadlines?");
    if (!ok) return;
    state.deadlines = makeSampleDeadlines();
    state.selectedWeekStart = toISODate(getMonday(new Date()));
    state.sosKey = "deadlines";
    state.templateKey = "clarification";
    clearTaskForm();
    saveState();
    renderAll();
    showToast("Demo data reset.");
  });

  els.scrollToAddTask.addEventListener("click", () => {
    els.courseInput.scrollIntoView({ behavior: "smooth", block: "center" });
    els.courseInput.focus();
  });

  els.copyActionBtn.addEventListener("click", async () => {
    await copyText(getCurrentActionCardText());
    showToast("Action card copied.");
  });

  els.sosOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-sos-key]");
    if (!button) return;
    state.sosKey = button.dataset.sosKey;
    const route = SOS_ROUTES[state.sosKey];
    if (route?.template) state.templateKey = route.template;
    saveState();
    renderSosNavigator();
    renderTemplatePack();
  });

  els.copySosBtn.addEventListener("click", async () => {
    const route = SOS_ROUTES[state.sosKey] || SOS_ROUTES.deadlines;
    await copyText(`VIP SOS Route\nSituation: ${route.label}\nFirst action: ${route.firstAction}\nSupport route: ${route.route}`);
    showToast("SOS route copied.");
  });

  els.templateTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-template-key]");
    if (!button) return;
    state.templateKey = button.dataset.templateKey;
    saveState();
    renderTemplatePack();
  });

  els.copyTemplateBtn.addEventListener("click", async () => {
    const selected = TEMPLATES[state.templateKey] || TEMPLATES.clarification;
    await copyText(selected.text);
    showToast("Template copied.");
  });

  els.downloadTemplatePackBtn.addEventListener("click", () => {
    const content = Object.values(TEMPLATES)
      .map((template) => `${template.label}\n${"=".repeat(template.label.length)}\n\n${template.text}`)
      .join("\n\n---\n\n");
    downloadFile("vip-template-pack.txt", content, "text/plain;charset=utf-8");
    showToast("Template pack downloaded.");
  });
}

function renderAll() {
  ensureSelectedWeekIsVisible();
  renderHeroPreview();
  renderKpis();
  renderHeatmap();
  renderActionCard();
  renderDeadlineTable();
  renderSosNavigator();
  renderTemplatePack();
  renderPilotTimeline();
}

function ensureSelectedWeekIsVisible() {
  if (!state.selectedWeekStart || Number.isNaN(parseDate(state.selectedWeekStart).getTime())) {
    state.selectedWeekStart = toISODate(getMonday(new Date()));
    return;
  }
  const weeks = getWeekStarts();
  if (!weeks.includes(state.selectedWeekStart)) {
    state.selectedWeekStart = toISODate(getMonday(new Date()));
  }
}

function renderHeroPreview() {
  const selected = analyzeWeek(state.selectedWeekStart);
  const open = getOpenDeadlines();
  const next = getNextDeadline();
  const actionText = generateActions(selected)[0] || "Add upcoming deadlines from your syllabus.";

  els.heroWeekLabel.textContent = formatWeekRange(parseDate(state.selectedWeekStart));
  setLevelPill(els.heroLevelPill, selected.level);
  els.heroActionText.textContent = actionText;
  els.heroOpenCount.textContent = String(open.length);
  els.heroNextDue.textContent = next ? formatShortDate(parseDate(next.due)) : "—";

  const miniCells = Array.from(els.heroHeatmapMini.querySelectorAll("span"));
  const start = getMonday(new Date());
  miniCells.forEach((cell, index) => {
    const date = addDays(start, index);
    const dayTasks = open.filter((deadline) => sameDay(parseDate(deadline.due), date));
    cell.className = dayClass(dayTasks);
    cell.title = dayTasks.length ? `${formatShortDate(date)} · ${dayTasks.length} task(s)` : formatShortDate(date);
  });
}

function renderKpis() {
  const selected = analyzeWeek(state.selectedWeekStart);
  const open = getOpenDeadlines();
  const next = getNextDeadline();
  const summary = weekSummary(selected);

  els.kpiWeekLevel.textContent = `${capitalize(selected.level)} Week`;
  els.kpiWeekSummary.textContent = summary.short;
  els.kpiOpenDeadlines.textContent = String(open.length);
  els.kpiOpenSummary.textContent = open.length === 1 ? "1 task still active." : `${open.length} tasks still active.`;
  els.kpiNextDue.textContent = next ? formatShortDate(parseDate(next.due)) : "—";
  els.kpiNextDueSummary.textContent = next ? `${next.course} · ${next.task}` : "Add a deadline to start.";

  const route = SOS_ROUTES[state.sosKey] || SOS_ROUTES.deadlines;
  els.kpiRoute.textContent = route.route.split(" or ")[0];
}

function renderHeatmap() {
  const weekStarts = getWeekStarts();
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  els.weeklyHeatmap.innerHTML = "";

  const header = document.createElement("div");
  header.className = "heatmap-row header";
  header.innerHTML = `<div>Week</div>${dayLabels.map((day) => `<div>${day}</div>`).join("")}<div>Level</div>`;
  els.weeklyHeatmap.appendChild(header);

  weekStarts.forEach((weekStartIso) => {
    const weekStart = parseDate(weekStartIso);
    const analysis = analyzeWeek(weekStartIso);
    const row = document.createElement("div");
    row.className = `heatmap-row ${weekStartIso === state.selectedWeekStart ? "is-selected" : ""}`;

    const weekCell = document.createElement("button");
    weekCell.type = "button";
    weekCell.className = "week-cell";
    weekCell.dataset.weekStart = weekStartIso;
    weekCell.innerHTML = `${formatWeekRange(weekStart)}<span>${analysis.tasks.length} active deadline${analysis.tasks.length === 1 ? "" : "s"}</span>`;
    row.appendChild(weekCell);

    for (let i = 0; i < 7; i += 1) {
      const date = addDays(weekStart, i);
      const dayTasks = analysis.tasks.filter((deadline) => sameDay(parseDate(deadline.due), date));
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = `day-cell ${dayTasks.length ? dayClass(dayTasks) : "empty"}`;
      cell.dataset.weekStart = weekStartIso;
      cell.title = dayTasks.map((task) => `${task.course}: ${task.task}`).join("\n") || "No active deadline";
      cell.innerHTML = `<strong>${date.getDate()}</strong><span>${dayTasks.length ? `${dayTasks.length} due` : "—"}</span>`;
      row.appendChild(cell);
    }

    const levelCell = document.createElement("button");
    levelCell.type = "button";
    levelCell.className = "level-cell";
    levelCell.dataset.weekStart = weekStartIso;
    levelCell.innerHTML = `<span class="level-pill level-${analysis.level}">${capitalize(analysis.level)}</span>`;
    row.appendChild(levelCell);

    els.weeklyHeatmap.appendChild(row);
  });
}

function renderActionCard() {
  const analysis = analyzeWeek(state.selectedWeekStart);
  const summary = weekSummary(analysis);
  const actions = generateActions(analysis);

  setLevelPill(els.actionLevelPill, analysis.level);
  els.selectedWeekLabel.textContent = formatWeekRange(parseDate(state.selectedWeekStart));
  els.selectedWeekSignals.textContent = summary.detail;
  els.loadMeterLabel.textContent = String(analysis.score);
  els.loadMeter.style.setProperty("--meter", `${Math.min(100, Math.max(8, (analysis.score / 12) * 100))}%`);
  els.loadMeter.style.setProperty("--meter-color", levelColor(analysis.level));

  els.actionList.innerHTML = "";
  actions.forEach((action) => {
    const li = document.createElement("li");
    li.textContent = action;
    els.actionList.appendChild(li);
  });
}

function renderDeadlineTable() {
  const query = els.deadlineSearch.value.trim().toLowerCase();
  const status = els.statusFilter.value;
  const rows = [...state.deadlines]
    .filter((deadline) => status === "all" || deadline.status === status)
    .filter((deadline) => !query || `${deadline.course} ${deadline.task}`.toLowerCase().includes(query))
    .sort((a, b) => parseDate(a.due) - parseDate(b.due));

  els.deadlineTableBody.innerHTML = "";

  if (!rows.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="8" class="empty-state">No deadlines match this view.</td>`;
    els.deadlineTableBody.appendChild(tr);
    return;
  }

  rows.forEach((deadline) => {
    const tr = document.createElement("tr");
    const typeClass = deadline.type.toLowerCase().split(" ")[0];
    const statusClass = deadline.status === "Done" ? "status-done" : deadline.status === "In progress" ? "status-progress" : "status-open";
    tr.innerHTML = `
      <td>${escapeHtml(formatShortDate(parseDate(deadline.due)))}</td>
      <td><span class="course-code">${escapeHtml(deadline.course)}</span></td>
      <td><span class="task-name">${escapeHtml(deadline.task)}</span></td>
      <td><span class="type-pill ${typeClass}">${escapeHtml(deadline.type.replace(" task", ""))}</span></td>
      <td>${Number(deadline.effort)}h</td>
      <td>${escapeHtml(deadline.clarity)}</td>
      <td><span class="status-pill ${statusClass}">${escapeHtml(deadline.status)}</span></td>
      <td>
        <div class="row-actions">
          <button class="icon-action" type="button" data-action="edit" data-id="${deadline.id}" aria-label="Edit ${escapeHtml(deadline.task)}">✎</button>
          <button class="icon-action" type="button" data-action="toggle" data-id="${deadline.id}" aria-label="Toggle status for ${escapeHtml(deadline.task)}">✓</button>
          <button class="icon-action" type="button" data-action="delete" data-id="${deadline.id}" aria-label="Delete ${escapeHtml(deadline.task)}">×</button>
        </div>
      </td>
    `;
    els.deadlineTableBody.appendChild(tr);
  });
}

function renderSosNavigator() {
  const selectedKey = state.sosKey || "deadlines";
  const selected = SOS_ROUTES[selectedKey] || SOS_ROUTES.deadlines;

  els.sosOptions.innerHTML = "";
  Object.entries(SOS_ROUTES).forEach(([key, route]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `sos-option ${key === selectedKey ? "is-active" : ""}`;
    button.dataset.sosKey = key;
    button.innerHTML = `${route.icon} ${escapeHtml(route.label)}<span>${escapeHtml(route.hint)}</span>`;
    els.sosOptions.appendChild(button);
  });

  els.sosResult.innerHTML = `
    <h3>${escapeHtml(selected.label)}</h3>
    <div class="route-block">
      <div><span>First action</span><strong>${escapeHtml(selected.firstAction)}</strong></div>
      <div><span>Support route</span><strong>${escapeHtml(selected.route)}</strong></div>
    </div>
  `;
}

function renderTemplatePack() {
  const selectedKey = state.templateKey || "clarification";
  const selected = TEMPLATES[selectedKey] || TEMPLATES.clarification;

  els.templateTabs.innerHTML = "";
  Object.entries(TEMPLATES).forEach(([key, template]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `button template-tab ${key === selectedKey ? "is-active" : ""}`;
    button.dataset.templateKey = key;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", key === selectedKey ? "true" : "false");
    button.textContent = template.label;
    els.templateTabs.appendChild(button);
  });

  els.templateTitle.textContent = selected.label;
  els.templateBody.textContent = selected.text;
}

function renderPilotTimeline() {
  if (els.pilotTimeline.dataset.rendered === "true") return;
  els.pilotTimeline.innerHTML = PILOT_TIMELINE.map((item) => `
    <article class="timeline-item">
      <span class="timeline-dot" aria-hidden="true"></span>
      <small>${escapeHtml(item.week)}</small>
      <strong>${escapeHtml(item.title)}</strong>
      <p>${escapeHtml(item.text)}</p>
    </article>
  `).join("");
  els.pilotTimeline.dataset.rendered = "true";
}

function handleTaskSubmit(event) {
  event.preventDefault();
  const newDeadline = normalizeDeadline({
    id: els.taskId.value || cryptoId(),
    course: els.courseInput.value,
    task: els.taskInput.value,
    due: els.dueInput.value,
    type: els.typeInput.value,
    effort: els.effortInput.value,
    clarity: els.clarityInput.value,
    status: els.statusInput.value,
  });

  if (!newDeadline) {
    showToast("Please complete the deadline fields.");
    return;
  }

  const editing = Boolean(els.taskId.value);
  if (editing) {
    state.deadlines = state.deadlines.map((deadline) => deadline.id === newDeadline.id ? newDeadline : deadline);
  } else {
    state.deadlines.push(newDeadline);
  }

  state.selectedWeekStart = toISODate(getMonday(parseDate(newDeadline.due)));
  clearTaskForm();
  saveState();
  renderAll();
  showToast(editing ? "Deadline updated." : "Deadline added.");
}

function handleDeadlineTableClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const deadline = state.deadlines.find((item) => item.id === button.dataset.id);
  if (!deadline) return;

  if (button.dataset.action === "edit") {
    els.taskId.value = deadline.id;
    els.courseInput.value = deadline.course;
    els.taskInput.value = deadline.task;
    els.dueInput.value = deadline.due;
    els.typeInput.value = deadline.type;
    els.effortInput.value = deadline.effort;
    els.clarityInput.value = deadline.clarity;
    els.statusInput.value = deadline.status;
    els.submitTaskBtn.textContent = "Update Deadline";
    els.courseInput.scrollIntoView({ behavior: "smooth", block: "center" });
    els.courseInput.focus();
    return;
  }

  if (button.dataset.action === "toggle") {
    deadline.status = deadline.status === "Done" ? "Open" : "Done";
    saveState();
    renderAll();
    showToast(deadline.status === "Done" ? "Marked as done." : "Moved back to open.");
    return;
  }

  if (button.dataset.action === "delete") {
    state.deadlines = state.deadlines.filter((item) => item.id !== deadline.id);
    saveState();
    renderAll();
    showToast("Deadline deleted.");
  }
}

function clearTaskForm() {
  els.taskForm.reset();
  els.taskId.value = "";
  els.effortInput.value = "3";
  els.submitTaskBtn.textContent = "Add Deadline";
  setDefaultDueDate();
}

function setDefaultDueDate() {
  if (!els.dueInput.value) {
    els.dueInput.value = toISODate(addDays(new Date(), 7));
  }
}

function analyzeWeek(weekStartIso) {
  const weekStart = parseDate(weekStartIso);
  const weekEnd = addDays(weekStart, 6);
  const tasks = getOpenDeadlines().filter((deadline) => {
    const due = parseDate(deadline.due);
    return due >= weekStart && due <= endOfDay(weekEnd);
  });

  const assessmentLoad = tasks.reduce((sum, deadline) => sum + (TYPE_SCORES[deadline.type] || 2), 0);
  const clustering = calculateClustering(tasks);
  const effortHours = tasks.reduce((sum, deadline) => sum + (Number(deadline.effort) || 0), 0);
  const expectedEffort = effortHours >= 12 ? 2 : effortHours >= 7 ? 1 : 0;
  const unclearCount = tasks.filter((deadline) => deadline.clarity === "Unclear").length;
  const clarityRisk = Math.min(2, unclearCount);
  const score = assessmentLoad + clustering + expectedEffort + clarityRisk;
  const level = score >= 9 ? "red" : score >= 5 ? "yellow" : "green";

  return {
    weekStart,
    weekEnd,
    tasks,
    assessmentLoad,
    clustering,
    expectedEffort,
    effortHours,
    clarityRisk,
    unclearCount,
    score,
    level,
  };
}

function calculateClustering(tasks) {
  if (tasks.length < 2) return 0;
  const dates = tasks.map((deadline) => parseDate(deadline.due)).sort((a, b) => a - b);
  let hasTwoWithin48 = false;
  let hasThreeWithin72 = false;

  for (let i = 0; i < dates.length; i += 1) {
    if (dates[i + 1] && hoursBetween(dates[i], dates[i + 1]) <= 48) {
      hasTwoWithin48 = true;
    }
    if (dates[i + 2] && hoursBetween(dates[i], dates[i + 2]) <= 72) {
      hasThreeWithin72 = true;
    }
  }

  if (hasThreeWithin72) return 3;
  if (hasTwoWithin48) return 2;
  return 0;
}

function getWeekStarts() {
  const currentMonday = getMonday(new Date());
  const starts = new Set();
  for (let i = -1; i <= 8; i += 1) {
    starts.add(toISODate(addDays(currentMonday, i * 7)));
  }
  state.deadlines.forEach((deadline) => {
    starts.add(toISODate(getMonday(parseDate(deadline.due))));
  });
  return [...starts].sort((a, b) => parseDate(a) - parseDate(b)).slice(0, 14);
}

function getOpenDeadlines() {
  return state.deadlines.filter((deadline) => deadline.status !== "Done");
}

function getNextDeadline() {
  const today = startOfDay(new Date());
  return getOpenDeadlines()
    .filter((deadline) => parseDate(deadline.due) >= today)
    .sort((a, b) => parseDate(a.due) - parseDate(b.due))[0] || null;
}

function getHighestRiskTask(tasks) {
  return [...tasks].sort((a, b) => {
    const scoreA = (TYPE_SCORES[a.type] || 2) * 3 + Number(a.effort) + (a.clarity === "Unclear" ? 4 : a.clarity === "Partly clear" ? 1 : 0);
    const scoreB = (TYPE_SCORES[b.type] || 2) * 3 + Number(b.effort) + (b.clarity === "Unclear" ? 4 : b.clarity === "Partly clear" ? 1 : 0);
    if (scoreA !== scoreB) return scoreB - scoreA;
    return parseDate(a.due) - parseDate(b.due);
  })[0] || null;
}

function generateActions(analysis) {
  if (!analysis.tasks.length) {
    return [
      "Add upcoming syllabus deadlines to keep the week visible.",
      "Review the next two weeks and reserve one buffer block.",
      "Keep the SOS Navigator ready in case a task becomes unclear.",
    ];
  }

  const highest = getHighestRiskTask(analysis.tasks);
  const highestText = highest ? `${highest.course} · ${highest.task}` : "the highest-risk task";

  if (analysis.level === "green") {
    return [
      "Maintain your normal routine and keep the deadline bank updated.",
      `Start with ${highestText} so the week stays manageable.`,
      "Protect one short review block before the next due date.",
    ];
  }

  if (analysis.level === "yellow") {
    return [
      `Choose ${highestText} as the first priority for the next 24 hours.`,
      "Block two focused study sessions before the closest deadline.",
      analysis.unclearCount ? "Write one clarification question and send it early." : "Check whether any task needs clarification before starting.",
      "Use the SOS Navigator if the first step is still unclear.",
    ];
  }

  return [
    `Triage now: make ${highestText} the highest-risk task.`,
    "Create two focused sessions and one buffer slot within the next 48 hours.",
    analysis.unclearCount ? "Ask one specific clarification question today." : "Confirm the requirements before investing long work time.",
    "Use the SOS Navigator to choose the right support route instead of guessing.",
  ];
}

function weekSummary(analysis) {
  if (!analysis.tasks.length) {
    return {
      short: "No active workload signal.",
      detail: "No active deadlines in this week.",
    };
  }

  const levelText = {
    green: "Maintain routine.",
    yellow: "Plan early.",
    red: "Act within 24–48 hours.",
  }[analysis.level];

  return {
    short: levelText,
    detail: `${analysis.tasks.length} active deadline${analysis.tasks.length === 1 ? "" : "s"}, ${analysis.effortHours}h expected effort, ${analysis.unclearCount} unclear task${analysis.unclearCount === 1 ? "" : "s"}.`,
  };
}

function getCurrentActionCardText() {
  const analysis = analyzeWeek(state.selectedWeekStart);
  const actions = generateActions(analysis);
  const summary = weekSummary(analysis);
  return `VIP Action Card\nWeek: ${formatWeekRange(parseDate(state.selectedWeekStart))}\nLevel: ${capitalize(analysis.level)} Week\nSignals: ${summary.detail}\n\nNext 24–48 hours:\n${actions.map((action, index) => `${index + 1}. ${action}`).join("\n")}`;
}

function dayClass(dayTasks) {
  if (!dayTasks.length) return "";
  const score = dayTasks.reduce((sum, deadline) => sum + (TYPE_SCORES[deadline.type] || 2) + (Number(deadline.effort) >= 6 ? 2 : Number(deadline.effort) >= 3 ? 1 : 0) + (deadline.clarity === "Unclear" ? 1 : 0), 0);
  if (score >= 6 || dayTasks.length >= 3) return "cell-high high";
  if (score >= 3 || dayTasks.length >= 2) return "cell-medium medium";
  return "cell-low low";
}

function setLevelPill(element, level) {
  element.className = `level-pill level-${level}`;
  element.textContent = capitalize(level);
}

function levelColor(level) {
  if (level === "red") return "#EF4444";
  if (level === "yellow") return "#F6C445";
  return "#20B26B";
}

function deadlinesToCsv(deadlines) {
  const headers = ["Course", "Task", "Due date", "Type", "Expected effort hours", "Clarity", "Status"];
  const rows = deadlines
    .sort((a, b) => parseDate(a.due) - parseDate(b.due))
    .map((deadline) => [deadline.course, deadline.task, deadline.due, deadline.type, deadline.effort, deadline.clarity, deadline.status]);
  return [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => els.toast.classList.remove("is-visible"), 2400);
}

function setMobileMenu(open) {
  els.mobileMenu.setAttribute("aria-expanded", open ? "true" : "false");
  els.navLinks.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
}

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch (error) {
    console.warn("Could not read theme.", error);
  }
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  els.themeToggle.textContent = theme === "dark" ? "☀" : "☾";
  els.themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
}

function setupRevealAnimation() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!window.IntersectionObserver) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => observer.observe(el));
}

function parseDate(value) {
  if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12, 0, 0, 0);
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function startOfDay(date) {
  const parsed = parseDate(date);
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function endOfDay(date) {
  const parsed = parseDate(date);
  parsed.setHours(23, 59, 59, 999);
  return parsed;
}

function getMonday(date) {
  const parsed = parseDate(date);
  const day = parsed.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(parsed, diff);
}

function addDays(date, amount) {
  const parsed = parseDate(date);
  parsed.setDate(parsed.getDate() + amount);
  return parsed;
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function hoursBetween(a, b) {
  return Math.abs(parseDate(b) - parseDate(a)) / 36e5;
}

function toISODate(date) {
  const parsed = parseDate(date);
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(parseDate(date));
}

function formatWeekRange(weekStart) {
  const start = parseDate(weekStart);
  const end = addDays(start, 6);
  const sameMonth = start.getMonth() === end.getMonth();
  const startLabel = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(start);
  const endLabel = new Intl.DateTimeFormat("en", sameMonth ? { day: "numeric" } : { month: "short", day: "numeric" }).format(end);
  return `${startLabel}–${endLabel}`;
}

function capitalize(value) {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function cryptoId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `vip-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
