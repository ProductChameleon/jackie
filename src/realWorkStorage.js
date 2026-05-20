/** @param {number} week */
function storageKey(week) {
  return `jackie_realwork_week${week}`;
}

/** @param {number} week @returns {string | null} */
export function getRealWorkUrl(week) {
  try {
    const value = localStorage.getItem(storageKey(week));
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed || null;
  } catch {
    return null;
  }
}

/** @param {number} week @param {string} url */
export function setRealWorkUrl(week, url) {
  localStorage.setItem(storageKey(week), url.trim());
}

/** @param {number} week */
export function clearRealWorkUrl(week) {
  localStorage.removeItem(storageKey(week));
}
