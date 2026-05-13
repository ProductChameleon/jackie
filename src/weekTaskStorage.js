const customListKey = (week) => `jackie_week_${week}_custom_list`;

export function readRequiredChecked(week, taskCount) {
  const out = [];
  for (let i = 0; i < taskCount; i++) {
    out.push(localStorage.getItem(`jackie_week_${week}_required_${i}`) === "1");
  }
  return out;
}

export function writeRequiredChecked(week, index, checked) {
  localStorage.setItem(
    `jackie_week_${week}_required_${index}`,
    checked ? "1" : "0"
  );
}

export function setAllRequiredChecked(week, taskCount, checked) {
  for (let i = 0; i < taskCount; i++) {
    writeRequiredChecked(week, i, checked);
  }
}

/** @returns {{ id: string, label: string, done: boolean }[]} */
export function readCustomTasks(week) {
  try {
    const raw = localStorage.getItem(customListKey(week));
    if (!raw) return [];
    const labels = JSON.parse(raw);
    if (!Array.isArray(labels)) return [];
    return labels.map((label, index) => ({
      id: `c-${week}-${index}`,
      label: String(label),
      done: localStorage.getItem(`jackie_week_${week}_custom_${index}`) === "1",
    }));
  } catch {
    return [];
  }
}

export function writeCustomTasks(week, tasks) {
  for (let i = 0; i < 64; i++) {
    localStorage.removeItem(`jackie_week_${week}_custom_${i}`);
  }
  localStorage.setItem(customListKey(week), JSON.stringify(tasks.map((t) => t.label)));
  tasks.forEach((t, index) => {
    localStorage.setItem(
      `jackie_week_${week}_custom_${index}`,
      t.done ? "1" : "0"
    );
  });
}
