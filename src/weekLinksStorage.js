/** @param {number} week @param {"repo" | "live"} kind */
function storageKey(week, kind) {
  return kind === "repo"
    ? `jackie_links_week${week}_repo`
    : `jackie_links_week${week}_live`;
}

/** @param {number} week @param {"repo" | "live"} kind @returns {string | null} */
export function getWeekLink(week, kind) {
  try {
    const value = localStorage.getItem(storageKey(week, kind));
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed || null;
  } catch {
    return null;
  }
}

/** @param {number} week @param {"repo" | "live"} kind @param {string} url */
export function setWeekLink(week, kind, url) {
  localStorage.setItem(storageKey(week, kind), url.trim());
}
