export const GITHUB_HANDLE_STORAGE_KEY = "jackie_github_handle";

/** @returns {string | null} */
export function getStoredGitHubHandle() {
  try {
    const value = localStorage.getItem(GITHUB_HANDLE_STORAGE_KEY);
    if (typeof value !== "string") return null;
    const trimmed = value.trim().replace(/^@/, "");
    return trimmed || null;
  } catch {
    return null;
  }
}

/** @param {string} handle */
export function setStoredGitHubHandle(handle) {
  const trimmed = handle.trim().replace(/^@/, "");
  if (!trimmed) return;
  localStorage.setItem(GITHUB_HANDLE_STORAGE_KEY, trimmed);
}

export function clearStoredGitHubHandle() {
  localStorage.removeItem(GITHUB_HANDLE_STORAGE_KEY);
}

/** @param {string} input */
export function normalizeGitHubHandle(input) {
  return input.trim().replace(/^@/, "");
}
