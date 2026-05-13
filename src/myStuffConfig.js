/** Week track row label (left column). */
export const WEEK_TRACK_LABELS = [
  "Week 1: PM",
  "Week 2: Comms",
  "Week 3: Vibe Marketing",
  "Week 4: Ludwitt",
  "Week 5: Your App",
  "Week 6: OSS PR",
];

/** End-of-week deadlines (YYYY-MM-DD). */
export const WEEK_DEADLINE_ISO = [
  "2026-05-15",
  "2026-05-22",
  "2026-05-29",
  "2026-06-05",
  "2026-06-12",
  "2026-06-19",
];

/** Short label for reminder strip (after "Week N: "). */
export const WEEK_REMINDER_TITLES = [
  "PR + JSON due",
  "PR + JSON due",
  "PR + JSON due",
  "Ludwitt PR due",
  "Your App milestone due",
  "OSS demo due",
];

/** Required task labels per week (1-based week index in array: index 0 = week 1). */
export const REQUIRED_TASKS_BY_WEEK = [
  [
    "Open PR on cursor-boston",
    "Add JSON file with all required fields",
    "Record and add Loom URL",
    "Deploy and add Live URL",
    "Add Repo URL",
  ],
  [
    "Open PR on cursor-boston",
    "Add JSON file with all required fields",
    "Record and add Loom URL",
    "Deploy and add Live URL",
    "Add Repo URL",
  ],
  [
    "Open PR on cursor-boston",
    "Add JSON file with all required fields",
    "Record and add Loom URL",
    "Deploy and add Live URL",
    "Add Repo URL",
  ],
  [
    "Build education tool",
    "Open PR against Ludwitt repo",
    "Confirm PR is mergeable",
  ],
  ["Define startup concept", "Build and deploy", "Prepare show and tell for Friday call"],
  ["Pick open source project", "Land merged PR upstream", "Prepare demo day presentation"],
];

export function getRequiredTaskCount(week) {
  return REQUIRED_TASKS_BY_WEEK[week - 1]?.length ?? 0;
}
