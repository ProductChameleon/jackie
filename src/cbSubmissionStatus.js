import { githubFetch } from "./githubApi.js";

const GITHUB_OWNER = "rogerSuperBuilderAlpha";
const GITHUB_REPO = "cursor-boston";

/** @typedef {"merged" | "open" | "none"} CbSubmissionStatus */

/**
 * @param {string} branch
 * @param {string} login
 * @returns {Promise<CbSubmissionStatus>}
 */
export async function fetchCbSubmissionStatus(branch, login) {
  const loginLower = login.trim().replace(/^@/, "").toLowerCase();
  if (!loginLower) return "none";

  let page = 1;

  while (page <= 10) {
    const url = new URL(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/pulls`
    );
    url.searchParams.set("state", "all");
    url.searchParams.set("base", branch);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));

    const res = await githubFetch(url);
    if (!res.ok) {
      throw new Error(`GitHub API error (${res.status})`);
    }

    const prs = await res.json();
    if (!Array.isArray(prs) || prs.length === 0) return "none";

    const mine = prs.find(
      (pr) => String(pr.user?.login ?? "").toLowerCase() === loginLower
    );

    if (mine) {
      if (mine.merged_at) return "merged";
      if (mine.state === "open") return "open";
      return "none";
    }

    if (prs.length < 100) return "none";
    page += 1;
  }

  return "none";
}
