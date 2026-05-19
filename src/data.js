import { buildWeeks234Submissions } from "./cohortWeeks234.js";

/** Demo submissions for weeks 4–6 status table (week 4 cards only). */
export const submissions = buildWeeks234Submissions().filter((s) => s.week === 4);
