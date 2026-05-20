/** @typedef {{ id: string, text: string, dueDate: string }} WeekTask */

/** @param {number} week */
function storageKey(week) {
  return `jackie_tasks_week${week}`;
}

/** @param {number} week @returns {WeekTask[]} */
export function readWeekTasks(week) {
  try {
    const raw = localStorage.getItem(storageKey(week));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (t) =>
          t &&
          typeof t.text === "string" &&
          t.text.trim() &&
          typeof t.dueDate === "string" &&
          t.dueDate
      )
      .map((t) => ({
        id: String(t.id ?? crypto.randomUUID()),
        text: t.text.trim(),
        dueDate: t.dueDate,
      }))
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  } catch {
    return [];
  }
}

/** @param {number} week @param {WeekTask[]} tasks */
export function writeWeekTasks(week, tasks) {
  localStorage.setItem(storageKey(week), JSON.stringify(tasks));
}

/** @param {number} week @param {string} id */
export function deleteWeekTask(week, id) {
  const tasks = readWeekTasks(week).filter((t) => t.id !== id);
  writeWeekTasks(week, tasks);
  return tasks;
}

/** @param {number} week @param {string} text @param {string} dueDate */
export function addWeekTask(week, text, dueDate) {
  const tasks = readWeekTasks(week);
  tasks.push({
    id: crypto.randomUUID(),
    text: text.trim(),
    dueDate,
  });
  tasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  writeWeekTasks(week, tasks);
  return tasks;
}
