export const WEEKS = [
  {
    number: 1,
    label: "PM Tool",
    branch: "c1w1pm-submission",
    opens: "2026-05-11",
    deadline: "2026-05-16",
    type: "standard",
  },
  {
    number: 2,
    label: "Comms",
    branch: "c1w2comms-submission",
    opens: "2026-05-19",
    deadline: "2026-05-23",
    type: "standard",
  },
  {
    number: 3,
    label: "Vibe Marketing",
    branch: "c1w3mkt-submission",
    opens: "2026-05-26",
    deadline: "2026-05-30",
    type: "standard",
  },
  {
    number: 4,
    label: "Ludwitt Education Tool",
    branch: "c1w4edu-submission",
    opens: "2026-06-01",
    deadline: "2026-06-06",
    type: "extended",
    realWorkLabel: "Ludwitt PR",
    realWorkInstructions:
      "Open a PR against the Ludwitt repo. Mergeability is the acceptance criterion.",
  },
  {
    number: 5,
    label: "Your App",
    branch: "c1w5startup-submission",
    opens: "2026-06-08",
    deadline: "2026-06-13",
    type: "extended",
    realWorkLabel: "Your App",
    realWorkInstructions:
      "Ship something you can show at demo day -- a working prototype, landing page, or public alpha.",
  },
  {
    number: 6,
    label: "OSS PR",
    branch: "c1w6oss-submission",
    opens: "2026-06-15",
    deadline: "2026-06-20",
    type: "extended",
    realWorkLabel: "OSS PR",
    realWorkInstructions:
      "Land a merged PR on a major open source project. Bring the upstream PR URL to demo day.",
  },
];

/** @param {string} iso YYYY-MM-DD */
export function parseLocalDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** @param {typeof WEEKS[0]} week @param {Date} [today] */
export function isWeekFuture(week, today = new Date()) {
  return startOfDay(today) < startOfDay(parseLocalDate(week.opens));
}

/** @param {typeof WEEKS[0]} week @param {Date} [today] */
export function isWeekOpen(week, today = new Date()) {
  const t = startOfDay(today);
  const opens = startOfDay(parseLocalDate(week.opens));
  const deadline = startOfDay(parseLocalDate(week.deadline));
  return t >= opens && t <= deadline;
}

/** @param {typeof WEEKS[0]} week @param {Date} [today] */
export function isWednesdayOrLaterInWindow(week, today = new Date()) {
  if (!isWeekOpen(week, today)) return false;
  return today.getDay() >= 3;
}

/** @param {string} iso */
export function formatShortDate(iso) {
  return parseLocalDate(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
